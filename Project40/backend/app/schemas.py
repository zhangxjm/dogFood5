from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class UserBase(BaseModel):
    username: str
    nickname: Optional[str] = ""


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: int
    avatar: str = ""
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = ""
    reference_image: Optional[str] = ""
    deadline: Optional[datetime] = None


class TaskCreate(TaskBase):
    pass


class TaskResponse(TaskBase):
    id: int
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class WorkBase(BaseModel):
    user_id: int
    task_id: int
    image_path: str
    description: Optional[str] = ""


class WorkCreate(BaseModel):
    user_id: int
    task_id: int
    description: Optional[str] = ""


class WorkUpdate(BaseModel):
    is_excellent: Optional[bool] = None
    likes: Optional[int] = None


class WorkResponse(BaseModel):
    id: int
    user_id: int
    task_id: int
    image_path: str
    description: str = ""
    is_excellent: bool = False
    likes: int = 0
    created_at: Optional[datetime] = None
    username: Optional[str] = None
    nickname: Optional[str] = None
    task_title: Optional[str] = None

    class Config:
        from_attributes = True


class CheckInBase(BaseModel):
    user_id: int


class CheckInCreate(CheckInBase):
    work_id: Optional[int] = None


class CheckInResponse(BaseModel):
    id: int
    user_id: int
    check_date: Optional[datetime] = None
    work_id: Optional[int] = None

    class Config:
        from_attributes = True


class UserStats(BaseModel):
    user_id: int
    username: str
    nickname: str
    total_checkins: int
    total_works: int
    streak_days: int
    rank: int


class TaskStats(BaseModel):
    task_id: int
    title: str
    total_works: int
    excellent_works: int
