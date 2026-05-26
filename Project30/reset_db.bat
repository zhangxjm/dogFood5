@echo off
setlocal
cd /d "%~dp0"

if exist "venv" (
    echo [INFO] Removing existing database...
    if exist "campus_book_exchange.db" del /f /q campus_book_exchange.db
    echo [INFO] Database removed. Next start will re-create and re-seed data.
) else (
    echo [INFO] No virtual environment detected, nothing to reset.
)
endlocal
pause
