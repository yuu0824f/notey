param (
  [string]$RepoPath = (Get-Location).Path
)

$sourceTreePath = "$env:LOCALAPPDATA\SourceTree\SourceTree.exe"

if (Test-Path $sourceTreePath) {
  Start-Process -FilePath $sourceTreePath -ArgumentList $RepoPath
  Write-Output "SourceTree launched for repository: $RepoPath"
} else {
  Write-Error "SourceTree executable not found at: $sourceTreePath"
}
