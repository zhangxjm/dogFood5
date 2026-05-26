from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.auth import get_current_user

router = APIRouter(prefix="/api/books", tags=["Books"])


@router.get("", response_model=list[schemas.BookOut])
def list_books(
    keyword: Optional[str] = Query(None, description="Search in title or author"),
    category_id: Optional[int] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db),
):
    query = db.query(models.Book)
    if keyword:
        like = f"%{keyword}%"
        query = query.filter((models.Book.title.ilike(like)) | (models.Book.author.ilike(like)))
    if category_id:
        query = query.filter(models.Book.category_id == category_id)
    if status:
        query = query.filter(models.Book.status == status)
    return query.order_by(models.Book.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/my", response_model=list[schemas.BookOut])
def list_my_books(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Book)
        .filter(models.Book.owner_id == current_user.id)
        .order_by(models.Book.created_at.desc())
        .all()
    )


@router.get("/{book_id}", response_model=schemas.BookOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.post("", response_model=schemas.BookOut, status_code=201)
def create_book(
    book_in: schemas.BookCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    category = db.query(models.Category).filter(models.Category.id == book_in.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category_id")
    book = models.Book(
        title=book_in.title,
        author=book_in.author,
        isbn=book_in.isbn or "",
        publisher=book_in.publisher or "",
        publish_year=book_in.publish_year,
        condition=book_in.condition or "Good",
        description=book_in.description or "",
        cover_url=book_in.cover_url or "",
        status=book_in.status or "available",
        category_id=book_in.category_id,
        owner_id=current_user.id,
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@router.put("/{book_id}", response_model=schemas.BookOut)
def update_book(
    book_id: int,
    book_in: schemas.BookUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to modify this book")
    update_data = book_in.model_dump(exclude_unset=True)
    if "category_id" in update_data:
        category = db.query(models.Category).filter(models.Category.id == update_data["category_id"]).first()
        if not category:
            raise HTTPException(status_code=400, detail="Invalid category_id")
    for key, value in update_data.items():
        setattr(book, key, value)
    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}", status_code=204)
def delete_book(
    book_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this book")
    db.delete(book)
    db.commit()
    return None
