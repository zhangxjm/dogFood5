from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    instrument = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    teacher_name = Column(String(50), nullable=False)
    duration_minutes = Column(Integer, nullable=False, default=60)
    price = Column(Float, nullable=False)
    max_students = Column(Integer, nullable=False, default=1)
    is_active = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, default=datetime.now)

    bookings = relationship("Booking", back_populates="course")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    phone = Column(String(20), nullable=False, unique=True)
    email = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.now)

    bookings = relationship("Booking", back_populates="student")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    booking_date = Column(String(20), nullable=False)
    start_time = Column(String(10), nullable=False)
    end_time = Column(String(10), nullable=False)
    status = Column(String(20), nullable=False, default="pending")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now)

    course = relationship("Course", back_populates="bookings")
    student = relationship("Student", back_populates="bookings")
    lesson_record = relationship("LessonRecord", back_populates="booking", uselist=False)


class LessonRecord(Base):
    __tablename__ = "lesson_records"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False, unique=True)
    actual_start_time = Column(DateTime, nullable=True)
    actual_end_time = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    content_summary = Column(Text, nullable=True)
    homework = Column(Text, nullable=True)
    teacher_notes = Column(Text, nullable=True)
    student_feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now)

    booking = relationship("Booking", back_populates="lesson_record")
