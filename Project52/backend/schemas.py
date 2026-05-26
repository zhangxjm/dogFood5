from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = ""
    color: Optional[str] = "#3B82F6"


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(BaseModel):
    id: int
    name: str
    description: str
    color: str
    created_at: datetime
    note_count: int = 0

    class Config:
        from_attributes = True


class NoteBase(BaseModel):
    title: str
    content: str
    tags: Optional[List[str]] = []
    category_id: int


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    category_id: Optional[int] = None


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    tags: List[str]
    category_id: int
    category_name: str
    category_color: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
