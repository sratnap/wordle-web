cd /d "%~dp0"
call .venv\Scripts\activate.bat
fastapi dev server.py
pause