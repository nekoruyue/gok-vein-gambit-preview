@echo off
chcp 65001 >nul
setlocal
set "ROOT=%~dp0"
set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" (
  echo 未找到 Microsoft Edge。请安装 Edge 后再运行。
  pause
  exit /b 1
)
set "URL=http://127.0.0.1:4174/?host=1&channel=preview"
set "GOK_CHANNEL=preview"
set "PORT=4174"
if exist "%ROOT%server\node.exe" if exist "%ROOT%server\server.js" (
  start "" /min "%ROOT%server\node.exe" "%ROOT%server\server.js"
  timeout /t 1 >nul
) else (
  set "URL=file:///%ROOT:\=/%public/index.html?channel=preview"
)
start "" "%EDGE%" --app="%URL%" --window-size=1600,900 --user-data-dir="%LOCALAPPDATA%\GokWorld\VeinGambit\Preview\EdgeProfile" --no-first-run
