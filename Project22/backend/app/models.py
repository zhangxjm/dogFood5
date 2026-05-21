from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class StudyArea(Base):
    __tablename__ = "study_areas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    seats = relationship("Seat", back_populates="area", cascade="all, delete-orphan")


class Seat(Base):
    __tablename__ = "seats"

    id = Column(Integer, primary_key=True, index=True)
    seat_number = Column(String(20), nullable=False)
    area_id = Column(Integer, ForeignKey("study_areas.id"), nullable=False)
    row = Column(Integer, default=0)
    col = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    has_power = Column(Boolean, default=False)
    has_window = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    area = relationship("StudyArea", back_populates="seats")
    reservations = relationship("Reservation", back_populates="seat", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    full_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reservations = relationship("Reservation", back_populates="user")


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    seat_id = Column(Integer, ForeignKey("seats.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), default="confirmed")
    check_in_time = Column(DateTime(timezone=True), nullable=True)
    is_cancelled = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    seat = relationship("Seat", back_populates="reservations")
    user = relationship("User", back_populates="reservations")
