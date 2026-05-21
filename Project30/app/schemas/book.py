from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.book import BookStatus, BookCategory


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="书籍名称")
    author: str = Field(..., min_length=1, max_length=100, description="作者")
    isbn: Optional[str] = Field(None, max_length=20, description="ISBN号")
    category: BookCategory = Field(..., description="书籍分类")
    description: Optional[str] = Field(None, description="书籍描述")
    condition: Optional[str] = Field(None, max_length=50, description="书籍成色")
    publisher: Optional[str] = Field(None, max_length=100, description="出版社")
    publish_year: Optional[int] = Field(None, ge=1900, le=2100, description="出版年份")
    owner_name: str = Field(..., min_length=1, max_length=100, description="持有者姓名")
    owner_contact: str = Field(..., min_length=1, max_length=100, description="持有者联系方式")
    campus: Optional[str] = Field(None, max_length=100, description="所在校区")
    status: BookStatus = Field(default=BookStatus.AVAILABLE, description="书籍状态")


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    author: Optional[str] = Field(None, min_length=1, max_length=100)
    isbn: Optional[str] = Field(None, max_length=20)
    category: Optional[BookCategory] = None
    description: Optional[str] = None
    condition: Optional[str] = Field(None, max_length=50)
    publisher: Optional[str] = Field(None, max_length=100)
    publish_year: Optional[int] = Field(None, ge=1900, le=2100)
    owner_name: Optional[str] = Field(None, min_length=1, max_length=100)
    owner_contact: Optional[str] = Field(None, min_length=1, max_length=100)
    campus: Optional[str] = Field(None, max_length=100)
    status: Optional[BookStatus] = None


class Book(BookBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class MessageBase(BaseModel):
    sender_name: str = Field(..., min_length=1, max_length=100, description="留言者姓名")
    sender_contact: str = Field(..., min_length=1, max_length=100, description="留言者联系方式")
    content: str = Field(..., min_length=1, description="留言内容")


class MessageCreate(MessageBase):
    book_id: int = Field(..., description="书籍ID")


class Message(MessageBase):
    id: int
    book_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class BookWithMessages(Book):
    messages: list[Message] = []
