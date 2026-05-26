from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime, timedelta

from backend.app.database import get_db
from backend.app import models, schemas

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("/users/{user_id}")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        return {"error": "User not found"}

    total_checkins = db.query(models.CheckIn).filter(
        models.CheckIn.user_id == user_id
    ).count()

    total_works = db.query(models.Work).filter(
        models.Work.user_id == user_id
    ).count()

    checkins = db.query(models.CheckIn).filter(
        models.CheckIn.user_id == user_id
    ).order_by(models.CheckIn.check_date.desc()).all()

    streak_days = 0
    if checkins:
        today = datetime.utcnow().date()
        check_dates = [c.check_date.date() for c in checkins]
        streak = 0
        for i in range(30):
            expected_date = today - timedelta(days=i)
            if expected_date in check_dates:
                streak += 1
            else:
                break
        streak_days = streak

    all_users = db.query(models.User).all()
    user_stats_list = []
    for u in all_users:
        checkin_count = db.query(models.CheckIn).filter(
            models.CheckIn.user_id == u.id
        ).count()
        user_stats_list.append({
            "user_id": u.id,
            "total_checkins": checkin_count
        })

    user_stats_list.sort(key=lambda x: x["total_checkins"], reverse=True)
    rank = next((i + 1 for i, s in enumerate(user_stats_list) if s["user_id"] == user_id), 0)

    return {
        "user_id": user_id,
        "username": user.username,
        "nickname": user.nickname,
        "total_checkins": total_checkins,
        "total_works": total_works,
        "streak_days": streak_days,
        "rank": rank
    }


@router.get("/ranking", response_model=List[dict])
def get_ranking(
    limit: int = 20,
    db: Session = Depends(get_db)
):
    users = db.query(models.User).all()
    ranking = []

    for user in users:
        checkin_count = db.query(models.CheckIn).filter(
            models.CheckIn.user_id == user.id
        ).count()

        work_count = db.query(models.Work).filter(
            models.Work.user_id == user.id
        ).count()

        excellent_count = db.query(models.Work).filter(
            and_(
                models.Work.user_id == user.id,
                models.Work.is_excellent == True
            )
        ).count()

        ranking.append({
            "user_id": user.id,
            "username": user.username,
            "nickname": user.nickname,
            "avatar": user.avatar,
            "total_checkins": checkin_count,
            "total_works": work_count,
            "excellent_works": excellent_count
        })

    ranking.sort(key=lambda x: x["total_checkins"], reverse=True)

    for i, item in enumerate(ranking):
        item["rank"] = i + 1

    return ranking[:limit]


@router.get("/tasks/{task_id}")
def get_task_stats(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        return {"error": "Task not found"}

    total_works = db.query(models.Work).filter(
        models.Work.task_id == task_id
    ).count()

    excellent_works = db.query(models.Work).filter(
        and_(
            models.Work.task_id == task_id,
            models.Work.is_excellent == True
        )
    ).count()

    return {
        "task_id": task_id,
        "title": task.title,
        "total_works": total_works,
        "excellent_works": excellent_works
    }


@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total_users = db.query(models.User).count()
    total_tasks = db.query(models.Task).count()
    total_works = db.query(models.Work).count()
    total_excellent = db.query(models.Work).filter(models.Work.is_excellent == True).count()
    total_checkins = db.query(models.CheckIn).count()

    today = datetime.utcnow().date()
    today_checkins = db.query(models.CheckIn).filter(
        models.CheckIn.check_date >= datetime(today.year, today.month, today.day)
    ).count()

    return {
        "total_users": total_users,
        "total_tasks": total_tasks,
        "total_works": total_works,
        "total_excellent": total_excellent,
        "total_checkins": total_checkins,
        "today_checkins": today_checkins
    }
