@echo off
cd /d "%~dp0backend"
python -m uvicorn main:app --reload
pause
