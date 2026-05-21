from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.database import engine
from app import models
from app.routers import auth, users, tasks, submissions, showcase, stats

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="硬笔书法打卡系统 API",
    description="一个功能完整的硬笔书法打卡系统，支持发布任务、上传作品、统计打卡、优秀作品展示等功能",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(submissions.router)
app.include_router(showcase.router)
app.include_router(stats.router)


@app.get("/")
def read_root():
    return {
        "message": "欢迎使用硬笔书法打卡系统 API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
