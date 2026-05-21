from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import books, messages

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="校园闲置书籍互换平台",
    description="支持书籍信息发布、互换意向留言、书籍分类检索的校园书籍互换平台",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router)
app.include_router(messages.router)


@app.get("/")
def root():
    return {
        "message": "欢迎使用校园闲置书籍互换平台",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
