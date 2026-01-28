@echo off
echo ========================================
echo Vite Migration Script
echo ========================================
echo.

echo Step 1: Removing old dependencies...
call npm uninstall react-scripts cross-env
if %errorlevel% neq 0 goto error

echo.
echo Step 2: Installing Vite and dependencies...
call npm install --save-dev vite @vitejs/plugin-react vitest jsdom @vitest/ui
if %errorlevel% neq 0 goto error

echo.
echo Step 3: Installing updated TypeScript...
call npm install --save-dev typescript@^5.2.2
if %errorlevel% neq 0 goto error

echo.
echo Step 4: Cleaning up old files...
if exist "public\index.html" del "public\index.html"
if exist "src\react-app-env.d.ts" del "src\react-app-env.d.ts"

echo.
echo ========================================
echo Migration completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Run 'npm start' to test the dev server
echo 2. Run 'npm test' to run tests with Vitest
echo 3. Run 'npm run test:ui' for interactive test UI
echo 4. Run 'npm run build' to create a production build
echo.
goto end

:error
echo.
echo ========================================
echo ERROR: Migration failed!
echo ========================================
echo Please check the error messages above.
pause
exit /b 1

:end
pause
