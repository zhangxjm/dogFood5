from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CourseBase(BaseModel):
    name: str = Field(..., max_length=100, description="课程名称")
    instrument: str = Field(..., max_length=50, description="乐器类型")
    description: Optional[str] = Field(None, description="课程描述")
    teacher_name: str = Field(..., max_length=50, description="教师姓名")
    duration_minutes: int = Field(60, gt=0, description="课程时长（分钟）")
    price: float = Field(..., gt=0, description="课程价格")
    max_students: int = Field(1, ge=1, description="最大学生数")
    is_active: int = Field(1, description="是否启用")


class CourseCreate(CourseBase):
    pass


class Course(CourseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class StudentBase(BaseModel):
    name: str = Field(..., max_length=50, description="学员姓名")
    phone: str = Field(..., max_length=20, description="联系电话")
    email: Optional[str] = Field(None, max_length=100, description="电子邮箱")


class StudentCreate(StudentBase):
    pass


class Student(StudentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class BookingBase(BaseModel):
    course_id: int = Field(..., description="课程ID")
    student_id: int = Field(..., description="学员ID")
    booking_date: str = Field(..., description="预约日期 YYYY-MM-DD")
    start_time: str = Field(..., description="开始时间 HH:MM")
    end_time: str = Field(..., description="结束时间 HH:MM")
    notes: Optional[str] = Field(None, description="备注")


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    status: str = Field(..., description="预约状态")
    notes: Optional[str] = Field(None, description="备注")


class Booking(BookingBase):
    id: int
    status: str
    created_at: datetime
    course: Course
    student: Student

    class Config:
        from_attributes = True


class LessonRecordBase(BaseModel):
    booking_id: int = Field(..., description="预约ID")
    content_summary: Optional[str] = Field(None, description="课程内容摘要")
    homework: Optional[str] = Field(None, description="课后作业")
    teacher_notes: Optional[str] = Field(None, description="教师备注")
    student_feedback: Optional[str] = Field(None, description="学员反馈")


class LessonRecordCreate(LessonRecordBase):
    pass


class LessonRecordUpdate(BaseModel):
    actual_start_time: Optional[datetime] = Field(None, description="实际开始时间")
    actual_end_time: Optional[datetime] = Field(None, description="实际结束时间")
    duration_minutes: Optional[int] = Field(None, description="实际授课时长")
    content_summary: Optional[str] = Field(None, description="课程内容摘要")
    homework: Optional[str] = Field(None, description="课后作业")
    teacher_notes: Optional[str] = Field(None, description="教师备注")
    student_feedback: Optional[str] = Field(None, description="学员反馈")


class LessonRecord(LessonRecordBase):
    id: int
    actual_start_time: Optional[datetime]
    actual_end_time: Optional[datetime]
    duration_minutes: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total_courses: int
    total_bookings: int
    total_completed_lessons: int
    total_duration_minutes: int
    total_revenue: float
