@echo off
echo Building SEVORA for production...
"C:\Program Files\nodejs\node.exe" node_modules\vite\bin\vite.js build

echo.
echo Build complete. Zipping dist folder...
powershell -Command "Compress-Archive -Path 'dist\*' -DestinationPath 'sevora-dist.zip' -Force"

echo.
echo Opening Netlify Drop...
start https://app.netlify.com/drop

echo.
echo Drag sevora-dist.zip from this folder onto the Netlify Drop page.
echo File is at: %cd%\sevora-dist.zip
pause
