@echo off
echo Searching for process.env.REACT_APP references...
echo.
findstr /s /i /n "process.env.REACT_APP" src\*.ts src\*.tsx src\*.js src\*.jsx 2>nul
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Found references that need updating!
    echo Please replace process.env.REACT_APP_ with import.meta.env.VITE_
    echo ========================================
) else (
    echo No additional references found.
)
echo.
pause
