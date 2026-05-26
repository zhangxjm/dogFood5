from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import os
from .database import engine, Base
from .routers import courses, bookings, records

Base.metadata.create_all(bind=engine)

app = FastAPI(title="线上乐器教学预约系统", description="乐器课程管理、学员预约、授课记录统计系统")

current_dir = os.path.dirname(os.path.abspath(__file__))
templates_dir = os.path.join(current_dir, "templates")
static_dir = os.path.join(current_dir, "static")

if not os.path.exists(static_dir):
    os.makedirs(static_dir)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(courses.router)
app.include_router(bookings.router)
app.include_router(records.router)


def render_template(template_name: str) -> HTMLResponse:
    template_path = os.path.join(templates_dir, template_name)
    with open(template_path, "r", encoding="utf-8") as f:
        content = f.read()
    return HTMLResponse(content=content)


@app.get("/", response_class=HTMLResponse)
async def root():
    return render_template("index.html")


@app.get("/courses", response_class=HTMLResponse)
async def courses_page():
    return render_template("courses.html")


@app.get("/bookings", response_class=HTMLResponse)
async def bookings_page():
    return render_template("bookings.html")


@app.get("/records", response_class=HTMLResponse)
async def records_page():
    return render_template("records.html")


@app.get("/stats", response_class=HTMLResponse)
async def stats_page():
    return render_template("stats.html")


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "系统运行正常"}
