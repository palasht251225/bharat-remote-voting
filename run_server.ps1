# Local HTTP Server for Bharat Remote AI & Blockchain Voting System
$port = 8080
$url = "http://localhost:$port/"
$folder = $PSScriptRoot

Write-Host "=======================================================================" -ForegroundColor Yellow
Write-Host " Rashtriya Matdaan Network (RMN) - Bharat Remote AI & Blockchain Voting" -ForegroundColor Cyan
Write-Host "=======================================================================" -ForegroundColor Yellow
Write-Host "Starting local HTTP server at $url..." -ForegroundColor Green
Write-Host "Serving files from: $folder" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor DarkGray
Write-Host "=======================================================================" -ForegroundColor Yellow

# Launch browser
Start-Process $url

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($path)) {
      $path = "index.html"
    }

    $filePath = Join-Path $folder $path

    if (Test-Path $filePath -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      
      $contentType = "text/plain"
      switch ($ext) {
        ".html" { $contentType = "text/html; charset=utf-8" }
        ".css"  { $contentType = "text/css; charset=utf-8" }
        ".js"   { $contentType = "application/javascript; charset=utf-8" }
        ".json" { $contentType = "application/json; charset=utf-8" }
        ".svg"  { $contentType = "image/svg+xml" }
        ".png"  { $contentType = "image/png" }
        ".jpg"  { $contentType = "image/jpeg" }
      }

      $response.ContentType = $contentType
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $response.Close()
  }
} finally {
  $listener.Stop()
}
