from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import os
import uuid
from PIL import Image
from app import schemas, crud, models
from app.database import get_db
from app.security import get_current_active_user, get_current_admin_user
from app.config import get_settings

router = APIRouter(prefix="/submissions", tags=["submissions"])
settings = get_settings()

UPLOAD_DIR = settings.UPLOAD_DIR
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = settings.MAX_UPLOAD_SIZE


def allowed_file(filename: str) -> bool:
    return os.path.splitext(filename.lower())[1] in ALLOWED_EXTENSIONS


def save_upload_file(upload_file: UploadFile) -> str:
    file_ext = os.path.splitext(upload_file.filename)[1].lower()
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        buffer.write(upload_file.file.read())

    try:
        with Image.open(file_path) as img:
            img.verify()
    except Exception:
        os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is not a valid image"
        )

    return f"/uploads/{unique_filename}"


@router.get("/", response_model=List[schemas.SubmissionListResponse])
def read_submissions(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[int] = None,
    task_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    submissions = crud.get_submissions(db, skip=skip, limit=limit, user_id=user_id, task_id=task_id)
    result = []
    for sub in submissions:
        result.append(schemas.SubmissionListResponse(
            id=sub.id,
            user_id=sub.user_id,
            task_id=sub.task_id,
            image_path=sub.image_path,
            description=sub.description,
            is_excellent=sub.is_excellent,
            likes_count=sub.likes_count,
            created_at=sub.created_at,
            submission_date=sub.submission_date,
            username=sub.user.username,
            nickname=sub.user.nickname,
            task_title=sub.task.title
        ))
    return result


@router.get("/me", response_model=List[schemas.SubmissionListResponse])
def read_my_submissions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    submissions = crud.get_submissions(db, skip=skip, limit=limit, user_id=current_user.id)
    result = []
    for sub in submissions:
        result.append(schemas.SubmissionListResponse(
            id=sub.id,
            user_id=sub.user_id,
            task_id=sub.task_id,
            image_path=sub.image_path,
            description=sub.description,
            is_excellent=sub.is_excellent,
            likes_count=sub.likes_count,
            created_at=sub.created_at,
            submission_date=sub.submission_date,
            username=sub.user.username,
            nickname=sub.user.nickname,
            task_title=sub.task.title
        ))
    return result


@router.get("/{submission_id}", response_model=schemas.SubmissionResponse)
def read_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_submission = crud.get_submission(db, submission_id=submission_id)
    if db_submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")
    return db_submission


@router.post("/", response_model=schemas.SubmissionResponse)
async def create_submission(
    task_id: int = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    today = date.today()

    existing_submission = crud.get_user_submission_by_date(db, user_id=current_user.id, submission_date=today)
    if existing_submission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted today's work"
        )

    task = crud.get_task(db, task_id=task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if not task.is_active:
        raise HTTPException(status_code=400, detail="Task is not active")

    if today < task.start_date or today > task.end_date:
        raise HTTPException(status_code=400, detail="Task is not available for today")

    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size: {MAX_FILE_SIZE / 1024 / 1024}MB"
        )

    image_path = save_upload_file(file)

    submission_data = schemas.SubmissionCreate(task_id=task_id, description=description)
    db_submission = crud.create_submission(
        db=db,
        submission=submission_data,
        user_id=current_user.id,
        image_path=image_path,
        submission_date=today
    )

    crud.update_user_checkin_stats(db=db, user_id=current_user.id, submission_date=today)

    db.refresh(db_submission)
    return db_submission


@router.put("/{submission_id}", response_model=schemas.SubmissionResponse)
def update_submission(
    submission_id: int,
    submission_update: schemas.SubmissionUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_submission = crud.get_submission(db, submission_id=submission_id)
    if db_submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    if db_submission.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to update this submission")

    return crud.update_submission(db=db, submission_id=submission_id, submission_update=submission_update)


@router.delete("/{submission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_submission = crud.get_submission(db, submission_id=submission_id)
    if db_submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    if db_submission.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this submission")

    crud.delete_submission(db=db, submission_id=submission_id)
    return None


@router.post("/{submission_id}/like", response_model=schemas.LikeResponse)
def like_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_submission = crud.get_submission(db, submission_id=submission_id)
    if db_submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    return crud.create_like(db=db, user_id=current_user.id, submission_id=submission_id)


@router.delete("/{submission_id}/like", status_code=status.HTTP_204_NO_CONTENT)
def unlike_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_submission = crud.get_submission(db, submission_id=submission_id)
    if db_submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    crud.delete_like(db=db, user_id=current_user.id, submission_id=submission_id)
    return None


@router.post("/{submission_id}/excellent", response_model=schemas.SubmissionResponse)
def mark_submission_as_excellent(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_submission = crud.get_submission(db, submission_id=submission_id)
    if db_submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    return crud.mark_as_excellent(db=db, submission_id=submission_id)
