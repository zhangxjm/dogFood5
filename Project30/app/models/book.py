from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class BookStatus(str, enum.Enum):
    AVAILABLE = "available"
    EXCHANGED = "exchanged"
    RESERVED = "reserved"


class BookCategory(str, enum.Enum):
    TEXTBOOK = "textbook"
    NOVEL = "novel"
    PROFESSIONAL = "professional"
    SCIENCE = "science"
    ART = "art"
    OTHER = "other"


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    author = Column(String(100), nullable=False)
    isbn = Column(String(20))
    category = Column(Enum(BookCategory), nullable=False)
    description = Column(Text)
    condition = Column(String(50))
    publisher = Column(String(100))
    publish_year = Column(Integer)
    owner_name = Column(String(100), nullable=False)
    owner_contact = Column(String(100), nullable=False)
    campus = Column(String(100))
    status = Column(Enum(BookStatus), default=BookStatus.AVAILABLE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    messages = relationship("Message", back_populates="book", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    sender_name = Column(String(100), nullable=False)
    sender_contact = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    book = relationship("Book", back_populates="messages")
