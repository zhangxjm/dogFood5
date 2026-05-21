from pydantic import BaseModel
from datetime import date, time
from typing import Optional


class StudentBase(BaseModel):
    name: str
    age: Optional[int] = None
    parent_name: Optional[str] = None
    phone: Optional[str] = None
    total_hours: int = 0


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    parent_name: Optional[str] = None
    phone: Optional[str] = None
    total_hours: Optional[int] = None


class Student(StudentBase):
    id: int
    used_hours: int
    remaining_hours: int

    class Config:
        from_attributes = True


class CourseBase(BaseModel):
    name: str
    description: Optional[str] = None
    hours_per_class: int = 1


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    hours_per_class: Optional[int] = None


class Course(CourseBase):
    id: int

    class Config:
        from_attributes = True


class ClassRecordBase(BaseModel):
    student_id: int
    course_id: int
    date: date
    hours_used: int = 1
    notes: Optional[str] = None


class ClassRecordCreate(ClassRecordBase):
    pass


class ClassRecord(ClassRecordBase):
    id: int
    student_name: Optional[str] = None
    course_name: Optional[str] = None

    class Config:
        from_attributes = True


class ScheduleBase(BaseModel):
    student_id: int
    course_id: int
    date: date
    start_time: time
    end_time: time
    status: str = "scheduled"
    notes: Optional[str] = None


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(BaseModel):
    student_id: Optional[int] = None
    course_id: Optional[int] = None
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class Schedule(ScheduleBase):
    id: int
    student_name: Optional[str] = None
    course_name: Optional[str] = None

    class Config:
        from_attributes = True
