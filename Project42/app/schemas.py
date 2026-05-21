from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional, List


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserBase(BaseModel):
    username: str
    email: EmailStr
    nickname: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserUpdate(BaseModel):
    nickname: Optional[str] = None
    avatar: Optional[str] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    total_checkins: int
    streak_days: int
    last_checkin_date: Optional[date] = None

    class Config:
        from_attributes = True


class UserStats(BaseModel):
    total_checkins: int
    streak_days: int
    total_submissions: int
    excellent_count: int


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    content: str
    example_image: Optional[str] = None
    start_date: date
    end_date: date


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    example_image: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = None


class TaskResponse(TaskBase):
    id: int
    is_active: bool
    created_by: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SubmissionBase(BaseModel):
    task_id: int
    description: Optional[str] = None


class SubmissionCreate(SubmissionBase):
    pass


class SubmissionUpdate(BaseModel):
    description: Optional[str] = None
    is_excellent: Optional[bool] = None


class SubmissionResponse(BaseModel):
    id: int
    user_id: int
    task_id: int
    image_path: str
    description: Optional[str] = None
    is_excellent: bool
    likes_count: int
    created_at: datetime
    submission_date: date
    user: UserResponse
    task: TaskResponse

    class Config:
        from_attributes = True


class SubmissionListResponse(BaseModel):
    id: int
    user_id: int
    task_id: int
    image_path: str
    description: Optional[str] = None
    is_excellent: bool
    likes_count: int
    created_at: datetime
    submission_date: date
    username: str
    nickname: Optional[str] = None
    task_title: str

    class Config:
        from_attributes = True


class LikeCreate(BaseModel):
    submission_id: int


class LikeResponse(BaseModel):
    id: int
    user_id: int
    submission_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class CheckinStats(BaseModel):
    date: date
    count: int


class MonthlyStats(BaseModel):
    month: str
    checkins: int


class ExcellentWorkResponse(BaseModel):
    id: int
    user_id: int
    task_id: int
    image_path: str
    description: Optional[str] = None
    likes_count: int
    created_at: datetime
    username: str
    nickname: Optional[str] = None
    task_title: str
    task_content: str

    class Config:
        from_attributes = True
