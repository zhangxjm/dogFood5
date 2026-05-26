from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import os
import uuid

from backend.app.database import get_db
from backend.app import models, schemas

router = APIRouter(prefix="/api/works", tags=["works"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=schemas.WorkResponse)
async def upload_work(
    user_id: int = Form(...),
    task_id: int = Form(...),
    description: Optional[str] = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    file_ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    db_work = models.Work(
        user_id=user_id,
        task_id=task_id,
        image_path=unique_filename,
        description=description or ""
    )
    db.add(db_work)
    db.flush()

    today = datetime.utcnow().date()
    existing_checkin = db.query(models.CheckIn).filter(
        models.CheckIn.user_id == user_id,
        models.CheckIn.check_date >= datetime(today.year, today.month, today.day)
    ).first()

    if not existing_checkin:
        db_checkin = models.CheckIn(
            user_id=user_id,
            work_id=db_work.id
        )
        db.add(db_checkin)

    db.commit()
    db.refresh(db_work)

    return {
        **schemas.WorkResponse.model_validate(db_work).model_dump(),
        "username": user.username,
        "nickname": user.nickname,
        "task_title": task.title
    }


@router.get("/", response_model=List[schemas.WorkResponse])
def list_works(
    task_id: Optional[int] = None,
    user_id: Optional[int] = None,
    is_excellent: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(models.Work)
    if task_id is not None:
        query = query.filter(models.Work.task_id == task_id)
    if user_id is not None:
        query = query.filter(models.Work.user_id == user_id)
    if is_excellent is not None:
        query = query.filter(models.Work.is_excellent == is_excellent)

    works = query.order_by(models.Work.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for work in works:
        user = db.query(models.User).filter(models.User.id == work.user_id).first()
        task = db.query(models.Task).filter(models.Task.id == work.task_id).first()
        result.append({
            **schemas.WorkResponse.model_validate(work).model_dump(),
            "username": user.username if user else "",
            "nickname": user.nickname if user else "",
            "task_title": task.title if task else ""
        })
    return result


@router.get("/excellent", response_model=List[schemas.WorkResponse])
def list_excellent_works(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    works = db.query(models.Work).filter(
        models.Work.is_excellent == True
    ).order_by(models.Work.likes.desc()).offset(skip).limit(limit).all()

    result = []
    for work in works:
        user = db.query(models.User).filter(models.User.id == work.user_id).first()
        task = db.query(models.Task).filter(models.Task.id == work.task_id).first()
        result.append({
            **schemas.WorkResponse.model_validate(work).model_dump(),
            "username": user.username if user else "",
            "nickname": user.nickname if user else "",
            "task_title": task.title if task else ""
        })
    return result


@router.get("/{work_id}", response_model=schemas.WorkResponse)
def get_work(work_id: int, db: Session = Depends(get_db)):
    work = db.query(models.Work).filter(models.Work.id == work_id).first()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")

    user = db.query(models.User).filter(models.User.id == work.user_id).first()
    task = db.query(models.Task).filter(models.Task.id == work.task_id).first()

    return {
        **schemas.WorkResponse.model_validate(work).model_dump(),
        "username": user.username if user else "",
        "nickname": user.nickname if user else "",
        "task_title": task.title if task else ""
    }


@router.put("/{work_id}/like", response_model=schemas.WorkResponse)
def like_work(work_id: int, db: Session = Depends(get_db)):
    work = db.query(models.Work).filter(models.Work.id == work_id).first()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")

    work.likes += 1
    db.commit()
    db.refresh(work)

    user = db.query(models.User).filter(models.User.id == work.user_id).first()
    task = db.query(models.Task).filter(models.Task.id == work.task_id).first()

    return {
        **schemas.WorkResponse.model_validate(work).model_dump(),
        "username": user.username if user else "",
        "nickname": user.nickname if user else "",
        "task_title": task.title if task else ""
    }


@router.put("/{work_id}/excellent", response_model=schemas.WorkResponse)
def mark_excellent(work_id: int, db: Session = Depends(get_db)):
    work = db.query(models.Work).filter(models.Work.id == work_id).first()
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")

    work.is_excellent = True
    db.commit()
    db.refresh(work)

    user = db.query(models.User).filter(models.User.id == work.user_id).first()
    task = db.query(models.Task).filter(models.Task.id == work.task_id).first()

    return {
        **schemas.WorkResponse.model_validate(work).model_dump(),
        "username": user.username if user else "",
        "nickname": user.nickname if user else "",
        "task_title": task.title if task else ""
    }
