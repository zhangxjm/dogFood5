from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.auth import get_current_user

router = APIRouter(prefix="/api/messages", tags=["Messages"])


@router.post("", response_model=schemas.MessageOut, status_code=201)
def create_message(
    message_in: schemas.MessageCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book = db.query(models.Book).filter(models.Book.id == message_in.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot send message for your own book")
    message = models.Message(
        content=message_in.content,
        intent=message_in.intent or "exchange",
        sender_id=current_user.id,
        receiver_id=book.owner_id,
        book_id=message_in.book_id,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("/inbox", response_model=list[schemas.MessageOut])
def list_inbox(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Message)
        .filter(models.Message.receiver_id == current_user.id)
        .order_by(models.Message.created_at.desc())
        .all()
    )


@router.get("/sent", response_model=list[schemas.MessageOut])
def list_sent(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Message)
        .filter(models.Message.sender_id == current_user.id)
        .order_by(models.Message.created_at.desc())
        .all()
    )


@router.get("/book/{book_id}", response_model=list[schemas.MessageOut])
def list_messages_for_book(
    book_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to view these messages")
    return (
        db.query(models.Message)
        .filter(models.Message.book_id == book_id)
        .order_by(models.Message.created_at.desc())
        .all()
    )


@router.post("/{message_id}/read", response_model=schemas.MessageOut)
def mark_as_read(
    message_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    message = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    if message.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    message.is_read = True
    db.commit()
    db.refresh(message)
    return message
