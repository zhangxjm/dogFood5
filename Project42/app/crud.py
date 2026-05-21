from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract
from datetime import date, timedelta
from typing import List, Optional
from app import models, schemas
from app.security import get_password_hash


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        nickname=user.nickname or user.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if db_user:
        for var, value in vars(user_update).items():
            if value is not None:
                setattr(db_user, var, value)
        db.commit()
        db.refresh(db_user)
    return db_user


def update_user_checkin_stats(db: Session, user_id: int, submission_date: date):
    db_user = get_user(db, user_id)
    if db_user:
        db_user.total_checkins += 1
        if db_user.last_checkin_date:
            if (submission_date - db_user.last_checkin_date).days == 1:
                db_user.streak_days += 1
            elif (submission_date - db_user.last_checkin_date).days > 1:
                db_user.streak_days = 1
        else:
            db_user.streak_days = 1
        db_user.last_checkin_date = submission_date
        db.commit()
        db.refresh(db_user)
    return db_user


def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def get_tasks(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True):
    query = db.query(models.Task)
    if active_only:
        query = query.filter(models.Task.is_active == True)
    return query.order_by(models.Task.start_date.desc()).offset(skip).limit(limit).all()


def get_task_by_date(db: Session, task_date: date):
    return db.query(models.Task).filter(
        and_(
            models.Task.start_date <= task_date,
            models.Task.end_date >= task_date,
            models.Task.is_active == True
        )
    ).first()


def create_task(db: Session, task: schemas.TaskCreate, created_by: int):
    db_task = models.Task(
        **task.model_dump(),
        created_by=created_by
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate):
    db_task = get_task(db, task_id)
    if db_task:
        for var, value in vars(task_update).items():
            if value is not None:
                setattr(db_task, var, value)
        db.commit()
        db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task


def get_submission(db: Session, submission_id: int):
    return db.query(models.Submission).filter(models.Submission.id == submission_id).first()


def get_submissions(db: Session, skip: int = 0, limit: int = 100, user_id: Optional[int] = None, task_id: Optional[int] = None):
    query = db.query(models.Submission)
    if user_id:
        query = query.filter(models.Submission.user_id == user_id)
    if task_id:
        query = query.filter(models.Submission.task_id == task_id)
    return query.order_by(models.Submission.created_at.desc()).offset(skip).limit(limit).all()


def get_user_submission_by_date(db: Session, user_id: int, submission_date: date):
    return db.query(models.Submission).filter(
        and_(
            models.Submission.user_id == user_id,
            models.Submission.submission_date == submission_date
        )
    ).first()


def create_submission(db: Session, submission: schemas.SubmissionCreate, user_id: int, image_path: str, submission_date: date):
    db_submission = models.Submission(
        user_id=user_id,
        task_id=submission.task_id,
        image_path=image_path,
        description=submission.description,
        submission_date=submission_date
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission


def update_submission(db: Session, submission_id: int, submission_update: schemas.SubmissionUpdate):
    db_submission = get_submission(db, submission_id)
    if db_submission:
        for var, value in vars(submission_update).items():
            if value is not None:
                setattr(db_submission, var, value)
        db.commit()
        db.refresh(db_submission)
    return db_submission


def delete_submission(db: Session, submission_id: int):
    db_submission = get_submission(db, submission_id)
    if db_submission:
        db.delete(db_submission)
        db.commit()
    return db_submission


def get_excellent_works(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Submission).filter(
        models.Submission.is_excellent == True
    ).order_by(models.Submission.likes_count.desc(), models.Submission.created_at.desc()).offset(skip).limit(limit).all()


def mark_as_excellent(db: Session, submission_id: int):
    db_submission = get_submission(db, submission_id)
    if db_submission:
        db_submission.is_excellent = True
        db.commit()
        db.refresh(db_submission)
    return db_submission


def get_like(db: Session, user_id: int, submission_id: int):
    return db.query(models.Like).filter(
        and_(
            models.Like.user_id == user_id,
            models.Like.submission_id == submission_id
        )
    ).first()


def create_like(db: Session, user_id: int, submission_id: int):
    existing_like = get_like(db, user_id, submission_id)
    if existing_like:
        return existing_like
    db_like = models.Like(user_id=user_id, submission_id=submission_id)
    db.add(db_like)
    db_submission = get_submission(db, submission_id)
    if db_submission:
        db_submission.likes_count += 1
    db.commit()
    db.refresh(db_like)
    return db_like


def delete_like(db: Session, user_id: int, submission_id: int):
    db_like = get_like(db, user_id, submission_id)
    if db_like:
        db_submission = get_submission(db, submission_id)
        if db_submission and db_submission.likes_count > 0:
            db_submission.likes_count -= 1
        db.delete(db_like)
        db.commit()
    return db_like


def get_user_stats(db: Session, user_id: int):
    total_submissions = db.query(models.Submission).filter(models.Submission.user_id == user_id).count()
    excellent_count = db.query(models.Submission).filter(
        and_(
            models.Submission.user_id == user_id,
            models.Submission.is_excellent == True
        )
    ).count()
    user = get_user(db, user_id)
    return schemas.UserStats(
        total_checkins=user.total_checkins if user else 0,
        streak_days=user.streak_days if user else 0,
        total_submissions=total_submissions,
        excellent_count=excellent_count
    )


def get_daily_checkin_stats(db: Session, days: int = 30):
    end_date = date.today()
    start_date = end_date - timedelta(days=days - 1)
    results = db.query(
        models.Submission.submission_date,
        func.count(models.Submission.id)
    ).filter(
        models.Submission.submission_date >= start_date
    ).group_by(
        models.Submission.submission_date
    ).all()
    stats_dict = {r[0]: r[1] for r in results}
    stats = []
    for i in range(days):
        current_date = start_date + timedelta(days=i)
        stats.append(schemas.CheckinStats(
            date=current_date,
            count=stats_dict.get(current_date, 0)
        ))
    return stats


def get_monthly_checkin_stats(db: Session, year: int):
    results = db.query(
        extract('month', models.Submission.submission_date),
        func.count(models.Submission.id)
    ).filter(
        extract('year', models.Submission.submission_date) == year
    ).group_by(
        extract('month', models.Submission.submission_date)
    ).all()
    stats_dict = {int(r[0]): r[1] for r in results}
    stats = []
    for month in range(1, 13):
        stats.append(schemas.MonthlyStats(
            month=f"{year}-{month:02d}",
            checkins=stats_dict.get(month, 0)
        ))
    return stats


def get_ranking(db: Session, limit: int = 10):
    return db.query(models.User).order_by(
        models.User.total_checkins.desc(),
        models.User.streak_days.desc()
    ).limit(limit).all()
