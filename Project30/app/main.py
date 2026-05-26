from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import auth, books, categories, messages
from app.seed import seed_data

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Campus Idle Book Exchange Platform",
    description=(
        "A FastAPI-based platform for college students to exchange idle books. "
        "Features: book publishing, exchange intent messages, category-based search. "
        "No payment flow."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(books.router)
app.include_router(categories.router)
app.include_router(messages.router)


@app.on_event("startup")
def on_startup():
    seed_data()


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to the Campus Idle Book Exchange Platform API",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/api/health", tags=["Health"])
def health():
    return {"status": "ok"}
