@echo off
title AI Study Assistant
color 0B

echo ====================================================================
echo             AI STUDY ASSISTANT (AGENTIC AI PLATFORM)
echo ====================================================================
echo.

:: Automatically schedule browser open in 3 seconds
start "" cmd /c "ping 127.0.0.1 -n 3 >nul && start http://localhost:8000"

:: Run python server
python run.py

if %ERRORLEVEL% neq 0 (
    echo.
    echo ====================================================================
    echo [ERROR] Python failed to start.
    echo Please make sure Python 3.10+ is installed from https://python.org
    echo with 'Add python.exe to PATH' checked.
    echo ====================================================================
    echo.
    pause
)
