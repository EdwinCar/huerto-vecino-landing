# Copia el APK más reciente generado por huerto_vecino (dist\app-release.apk)
# a landing\download\ y recalcula el SHA-1 que muestra la página.
# Uso:  .\sync-apk.ps1            (desde la carpeta landing)
#       .\sync-apk.ps1 -Source "D:\otra\ruta\app-release.apk"
param(
  [string]$Source = (Join-Path $PSScriptRoot "..\huerto_vecino\dist\app-release.apk")
)

$ErrorActionPreference = "Stop"
$dest = Join-Path $PSScriptRoot "download"
if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }

if (-not (Test-Path $Source)) {
  Write-Host "No se encontró el APK en: $Source" -ForegroundColor Yellow
  Write-Host "Compila primero con  ..\huerto_vecino\build_apk.ps1" -ForegroundColor Yellow
  exit 1
}

$target = Join-Path $dest "app-release.apk"
Copy-Item -Path $Source -Destination $target -Force
$hash = (Get-FileHash -Path $target -Algorithm SHA1).Hash.ToLower()
"$hash  app-release.apk" | Out-File -FilePath (Join-Path $dest "app-release.apk.sha1") -Encoding ascii -NoNewline

$mb = [math]::Round((Get-Item $target).Length / 1MB, 1)
Write-Host "APK copiado a download\app-release.apk ($mb MB)" -ForegroundColor Green
Write-Host "SHA-1: $hash"
