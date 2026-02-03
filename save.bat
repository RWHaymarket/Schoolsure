@echo off
cd /d "%~dp0"

if "%~1"=="" (
    set MSG=SchoolSure update — %date% %time:~0,5%
) else (
    set MSG=%~1
)

echo Working directory: %cd%
echo Staging changes...
git add .

echo.
echo Status:
git status --short

echo.
echo Committing: %MSG%
git commit -m "%MSG%"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo Done. Check: https://github.com/RWHaymarket/Schoolsure
pause
