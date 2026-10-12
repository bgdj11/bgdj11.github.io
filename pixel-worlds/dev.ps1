$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$taskNodeCommand = Get-Command node -ErrorAction SilentlyContinue
if (-not $taskNodeCommand) {
    $taskTools = Join-Path (Split-Path -Parent $PSScriptRoot) '.tools'
    $taskRuntime = Get-ChildItem -LiteralPath $taskTools -Directory -Filter 'node-*-win-x64' -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $taskRuntime) { throw 'Install Node.js 22.12+ or 24 LTS, then run npm install and npm run dev.' }
    $env:PATH = $taskRuntime.FullName + ';' + $env:PATH
}
node node_modules/vite/bin/vite.js --host 127.0.0.1
