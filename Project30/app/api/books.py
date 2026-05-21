from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.book import Book as BookModel, BookCategory, BookStatus
from app.schemas.book import Book, BookCreate, BookUpdate, BookWithMessages

router = APIRouter(prefix="/books", tags=["books"])


@router.post("/", response_model=Book, status_code=201)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    db_book = BookModel(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


@router.get("/", response_model=list[Book])
def get_books(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[BookCategory] = None,
    status: Optional[BookStatus] = None,
    campus: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(BookModel)
    
    if category:
        query = query.filter(BookModel.category == category)
    if status:
        query = query.filter(BookModel.status == status)
    if campus:
        query = query.filter(BookModel.campus.ilike(f"%{campus}%"))
    
    books = query.order_by(BookModel.created_at.desc()).offset(skip).limit(limit).all()
    return books


@router.get("/search", response_model=list[Book])
def search_books(
    keyword: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    books = db.query(BookModel).filter(
        (BookModel.title.ilike(f"%{keyword}%")) |
        (BookModel.author.ilike(f"%{keyword}%")) |
        (BookModel.isbn.ilike(f"%{keyword}%")) |
        (BookModel.description.ilike(f"%{keyword}%"))
    ).order_by(BookModel.created_at.desc()).offset(skip).limit(limit).all()
    return books


@router.get("/categories", response_model=dict)
def get_categories():
    return {
        "categories": [category.value for category in BookCategory],
        "statuses": [status.value for status in BookStatus]
    }


@router.get("/{book_id}", response_model=BookWithMessages)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(BookModel).filter(BookModel.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="书籍未找到")
    return book


@router.put("/{book_id}", response_model=Book)
def update_book(book_id: int, book_update: BookUpdate, db: Session = Depends(get_db)):
    db_book = db.query(BookModel).filter(BookModel.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="书籍未找到")
    
    update_data = book_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)
    
    db.commit()
    db.refresh(db_book)
    return db_book


@router.delete("/{book_id}", status_code=204)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    db_book = db.query(BookModel).filter(BookModel.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="书籍未找到")
    
    db.delete(db_book)
    db.commit()
    return None
