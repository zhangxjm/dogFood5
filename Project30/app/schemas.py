from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = ""
    campus: Optional[str] = ""
    contact: Optional[str] = ""


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = ""


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class BookBase(BaseModel):
    title: str
    author: str
    isbn: Optional[str] = ""
    publisher: Optional[str] = ""
    publish_year: Optional[int] = None
    condition: Optional[str] = "Good"
    description: Optional[str] = ""
    cover_url: Optional[str] = ""
    status: Optional[str] = "available"
    category_id: int


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    publisher: Optional[str] = None
    publish_year: Optional[int] = None
    condition: Optional[str] = None
    description: Optional[str] = None
    cover_url: Optional[str] = None
    status: Optional[str] = None
    category_id: Optional[int] = None


class BookOwnerOut(BaseModel):
    id: int
    username: str
    full_name: str
    campus: str

    class Config:
        from_attributes = True


class BookOut(BookBase):
    id: int
    created_at: datetime
    owner: BookOwnerOut
    category: CategoryOut

    class Config:
        from_attributes = True


class MessageBase(BaseModel):
    content: str
    intent: Optional[str] = "exchange"


class MessageCreate(MessageBase):
    book_id: int


class MessageOut(MessageBase):
    id: int
    is_read: bool
    created_at: datetime
    sender_id: int
    receiver_id: int
    book_id: int
    sender: BookOwnerOut

    class Config:
        from_attributes = True
