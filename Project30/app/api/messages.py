from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.book import Book as BookModel, Message as MessageModel
from app.schemas.book import Message, MessageCreate

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/", response_model=Message, status_code=201)
def create_message(message: MessageCreate, db: Session = Depends(get_db)):
    book = db.query(BookModel).filter(BookModel.id == message.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="书籍未找到")
    
    db_message = MessageModel(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


@router.get("/book/{book_id}", response_model=list[Message])
def get_messages_by_book(
    book_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    book = db.query(BookModel).filter(BookModel.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="书籍未找到")
    
    messages = db.query(MessageModel).filter(
        MessageModel.book_id == book_id
    ).order_by(MessageModel.created_at.desc()).offset(skip).limit(limit).all()
    return messages


@router.get("/{message_id}", response_model=Message)
def get_message(message_id: int, db: Session = Depends(get_db)):
    message = db.query(MessageModel).filter(MessageModel.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="留言未找到")
    return message


@router.delete("/{message_id}", status_code=204)
def delete_message(message_id: int, db: Session = Depends(get_db)):
    message = db.query(MessageModel).filter(MessageModel.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="留言未找到")
    
    db.delete(message)
    db.commit()
    return None
