from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, FileResponse
import os
import sys

from backend.app.database import engine, Base
from backend.app.routers import users, tasks, works, stats, checkins
from backend.app.init_data import init_database

Base.metadata.create_all(bind=engine)

app = FastAPI(title="硬笔书法打卡系统", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.abspath(os.getenv("UPLOAD_DIR", os.path.join(os.getcwd(), "uploads")))
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

def find_frontend_dir():
    cwd = os.getcwd()
    candidates = [
        os.path.join(cwd, "frontend"),
        os.path.join(os.path.dirname(__file__), "..", "..", "..", "frontend"),
    ]
    for path in candidates:
        abs_path = os.path.abspath(path)
        if os.path.exists(abs_path):
            return abs_path
    return None

frontend_dir = find_frontend_dir()
if frontend_dir:
    @app.get("/frontend")
    async def frontend_index():
        return FileResponse(os.path.join(frontend_dir, "index.html"))
    
    @app.get("/frontend/")
    async def frontend_index_slash():
        return FileResponse(os.path.join(frontend_dir, "index.html"))
    
    app.mount("/frontend", StaticFiles(directory=frontend_dir), name="frontend")

app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(works.router)
app.include_router(stats.router)
app.include_router(checkins.router)


@app.on_event("startup")
async def startup_event():
    init_database()


@app.get("/")
async def root():
    return {
        "message": "硬笔书法打卡系统 API",
        "version": "1.0.0",
        "endpoints": {
            "users": "/api/users",
            "tasks": "/api/tasks",
            "works": "/api/works",
            "stats": "/api/stats",
            "checkins": "/api/checkins"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "ok"}
