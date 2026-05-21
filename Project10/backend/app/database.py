from sqlalchemy import create_engine, Column, Integer, String, DateTime, Date, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./playground.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    duration_minutes = Column(Integer, default=30)
    max_people_per_session = Column(Integer, default=10)
    is_active = Column(Boolean, default=True)

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    date = Column(Date)
    start_time = Column(String)
    end_time = Column(String)
    available_slots = Column(Integer)
    
    project = relationship("Project")

class Child(Base):
    __tablename__ = "children"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    gender = Column(String)
    birth_date = Column(Date)
    guardian_name = Column(String)
    guardian_phone = Column(String)

class Reservation(Base):
    __tablename__ = "reservations"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    child_id = Column(Integer, ForeignKey("children.id"))
    status = Column(String, default="reserved")
    created_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)
    
    session = relationship("Session")
    child = relationship("Child")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
