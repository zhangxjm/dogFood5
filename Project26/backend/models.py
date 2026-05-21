from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer)
    parent_name = Column(String(100))
    phone = Column(String(20))
    total_hours = Column(Integer, default=0)
    used_hours = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    records = relationship("ClassRecord", back_populates="student")
    schedules = relationship("Schedule", back_populates="student")

    @property
    def remaining_hours(self):
        return self.total_hours - self.used_hours


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    hours_per_class = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    records = relationship("ClassRecord", back_populates="course")
    schedules = relationship("Schedule", back_populates="course")


class ClassRecord(Base):
    __tablename__ = "class_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    date = Column(Date, nullable=False)
    hours_used = Column(Integer, default=1)
    notes = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="records")
    course = relationship("Course", back_populates="records")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status = Column(String(20), default="scheduled")
    notes = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="schedules")
    course = relationship("Course", back_populates="schedules")
