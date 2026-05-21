from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app import schemas, crud
from app.database import get_db

router = APIRouter(prefix="/showcase", tags=["showcase"])


@router.get("/excellent", response_model=List[schemas.ExcellentWorkResponse])
def get_excellent_works(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    submissions = crud.get_excellent_works(db, skip=skip, limit=limit)
    result = []
    for sub in submissions:
        result.append(schemas.ExcellentWorkResponse(
            id=sub.id,
            user_id=sub.user_id,
            task_id=sub.task_id,
            image_path=sub.image_path,
            description=sub.description,
            likes_count=sub.likes_count,
            created_at=sub.created_at,
            username=sub.user.username,
            nickname=sub.user.nickname,
            task_title=sub.task.title,
            task_content=sub.task.content
        ))
    return result
