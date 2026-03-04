@echo off
TITLE THY-English Baslatici
echo Proje baslatiliyor...
cd /d "%~dp0"
start http://localhost:5173
npm run dev
pause
