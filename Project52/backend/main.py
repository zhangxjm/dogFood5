from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from database import engine, SessionLocal, Base, get_db
import models
import schemas
from init_data import init_sample_data

Base.metadata.create_all(bind=engine)

app = FastAPI(title="职业技能学习笔记系统")

STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        init_sample_data(db)
    finally:
        db.close()


@app.get("/")
def read_root():
    index_path = os.path.join(STATIC_DIR, "index.html")
    return FileResponse(index_path)


@app.post("/api/categories", response_model=schemas.CategoryResponse)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Category).filter(models.Category.name == category.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="分类名称已存在")
    db_category = models.Category(
        name=category.name,
        description=category.description,
        color=category.color
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return schemas.CategoryResponse(
        id=db_category.id,
        name=db_category.name,
        description=db_category.description or "",
        color=db_category.color,
        created_at=db_category.created_at,
        note_count=0
    )


@app.get("/api/categories", response_model=List[schemas.CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Category).all()
    result = []
    for cat in categories:
        note_count = db.query(models.Note).filter(models.Note.category_id == cat.id).count()
        result.append(schemas.CategoryResponse(
            id=cat.id,
            name=cat.name,
            description=cat.description or "",
            color=cat.color,
            created_at=cat.created_at,
            note_count=note_count
        ))
    return result


@app.put("/api/categories/{category_id}", response_model=schemas.CategoryResponse)
def update_category(category_id: int, category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="分类不存在")
    existing = db.query(models.Category).filter(
        models.Category.name == category.name,
        models.Category.id != category_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="分类名称已存在")
    db_category.name = category.name
    db_category.description = category.description
    db_category.color = category.color
    db.commit()
    db.refresh(db_category)
    note_count = db.query(models.Note).filter(models.Note.category_id == db_category.id).count()
    return schemas.CategoryResponse(
        id=db_category.id,
        name=db_category.name,
        description=db_category.description or "",
        color=db_category.color,
        created_at=db_category.created_at,
        note_count=note_count
    )


@app.delete("/api/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="分类不存在")
    db.delete(db_category)
    db.commit()
    return {"message": "删除成功"}


@app.post("/api/notes", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == note.category_id).first()
    if not db_category:
        raise HTTPException(status_code=400, detail="分类不存在")
    db_note = models.Note(
        title=note.title,
        content=note.content,
        tags=note.tags,
        category_id=note.category_id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return schemas.NoteResponse(
        id=db_note.id,
        title=db_note.title,
        content=db_note.content,
        tags=db_note.tags or [],
        category_id=db_note.category_id,
        category_name=db_note.category.name,
        category_color=db_note.category.color,
        created_at=db_note.created_at,
        updated_at=db_note.updated_at
    )


@app.get("/api/notes", response_model=List[schemas.NoteResponse])
def list_notes(
    keyword: Optional[str] = None,
    category_id: Optional[int] = None,
    tag: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Note)
    if category_id:
        query = query.filter(models.Note.category_id == category_id)
    if keyword:
        search = f"%{keyword}%"
        query = query.filter(
            (models.Note.title.ilike(search)) |
            (models.Note.content.ilike(search))
        )
    if tag:
        query = query.filter(models.Note.tags.contains(tag))
    notes = query.order_by(models.Note.created_at.desc()).all()
    result = []
    for note in notes:
        result.append(schemas.NoteResponse(
            id=note.id,
            title=note.title,
            content=note.content,
            tags=note.tags or [],
            category_id=note.category_id,
            category_name=note.category.name,
            category_color=note.category.color,
            created_at=note.created_at,
            updated_at=note.updated_at
        ))
    return result


@app.get("/api/notes/{note_id}", response_model=schemas.NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="笔记不存在")
    return schemas.NoteResponse(
        id=note.id,
        title=note.title,
        content=note.content,
        tags=note.tags or [],
        category_id=note.category_id,
        category_name=note.category.name,
        category_color=note.category.color,
        created_at=note.created_at,
        updated_at=note.updated_at
    )


@app.put("/api/notes/{note_id}", response_model=schemas.NoteResponse)
def update_note(note_id: int, note: schemas.NoteUpdate, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="笔记不存在")
    if note.title is not None:
        db_note.title = note.title
    if note.content is not None:
        db_note.content = note.content
    if note.tags is not None:
        db_note.tags = note.tags
    if note.category_id is not None:
        db_category = db.query(models.Category).filter(models.Category.id == note.category_id).first()
        if not db_category:
            raise HTTPException(status_code=400, detail="分类不存在")
        db_note.category_id = note.category_id
    db.commit()
    db.refresh(db_note)
    return schemas.NoteResponse(
        id=db_note.id,
        title=db_note.title,
        content=db_note.content,
        tags=db_note.tags or [],
        category_id=db_note.category_id,
        category_name=db_note.category.name,
        category_color=db_note.category.color,
        created_at=db_note.created_at,
        updated_at=db_note.updated_at
    )


@app.delete("/api/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="笔记不存在")
    db.delete(db_note)
    db.commit()
    return {"message": "删除成功"}
