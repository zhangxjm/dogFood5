from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel

from .database import Base, engine, get_db, Project, Session as DBSession, Child, Reservation

Base.metadata.create_all(bind=engine)

app = FastAPI(title="亲子乐园预约系统")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProjectCreate(BaseModel):
    name: str
    description: str
    duration_minutes: int = 30
    max_people_per_session: int = 10

class SessionCreate(BaseModel):
    project_id: int
    date: date
    start_time: str
    end_time: str
    available_slots: int

class ChildCreate(BaseModel):
    name: str
    gender: str
    birth_date: date
    guardian_name: str
    guardian_phone: str

class ReservationCreate(BaseModel):
    session_id: int
    child_id: int

@app.get("/")
def read_root():
    return {"message": "亲子乐园预约系统API"}

@app.get("/projects")
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.is_active == True).all()

@app.post("/projects")
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/sessions/{project_id}")
def get_sessions(project_id: int, date: Optional[date] = None, db: Session = Depends(get_db)):
    query = db.query(DBSession).filter(DBSession.project_id == project_id)
    if date:
        query = query.filter(DBSession.date == date)
    return query.all()

@app.post("/sessions")
def create_session(session: SessionCreate, db: Session = Depends(get_db)):
    db_session = DBSession(**session.dict())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@app.get("/children")
def get_children(db: Session = Depends(get_db)):
    return db.query(Child).all()

@app.post("/children")
def create_child(child: ChildCreate, db: Session = Depends(get_db)):
    db_child = Child(**child.dict())
    db.add(db_child)
    db.commit()
    db.refresh(db_child)
    return db_child

@app.get("/reservations")
def get_reservations(child_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Reservation)
    if child_id:
        query = query.filter(Reservation.child_id == child_id)
    return query.order_by(Reservation.created_at.desc()).all()

@app.post("/reservations")
def create_reservation(reservation: ReservationCreate, db: Session = Depends(get_db)):
    session = db.query(DBSession).filter(DBSession.id == reservation.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="场次不存在")
    if session.available_slots <= 0:
        raise HTTPException(status_code=400, detail="该场次已满")
    
    db_reservation = Reservation(**reservation.dict())
    session.available_slots -= 1
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

@app.post("/reservations/{reservation_id}/verify")
def verify_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="预约不存在")
    reservation.status = "verified"
    reservation.verified_at = datetime.utcnow()
    db.commit()
    return reservation
