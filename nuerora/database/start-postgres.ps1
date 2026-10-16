$ErrorActionPreference = 'Stop'
$pgBin = if ($env:NUERORA_PG_BIN) { $env:NUERORA_PG_BIN } else { Join-Path $env:LOCALAPPDATA 'Programs\PostgreSQL\18.6\pgsql\bin' }
$dataDir = if ($env:NUERORA_PGDATA) { $env:NUERORA_PGDATA } else { Join-Path $env:LOCALAPPDATA 'PostgreSQL\data\nuerora' }
$port = if ($env:NUERORA_PGPORT) { [int]$env:NUERORA_PGPORT } else { 5433 }
$pgCtl = Join-Path $pgBin 'pg_ctl.exe'

if (-not (Test-Path $pgCtl)) { throw "PostgreSQL was not found at $pgBin" }
if (-not (Test-Path $dataDir)) { throw "PostgreSQL data directory was not found at $dataDir. Initialize it with initdb first." }
& $pgCtl status -D $dataDir 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Output "PostgreSQL is already running on 127.0.0.1:$port."
    exit 0
}
& $pgCtl -D $dataDir -l (Join-Path $dataDir 'server.log') -o "-p $port -h 127.0.0.1" -w start
if ($LASTEXITCODE -ne 0) { throw 'PostgreSQL failed to start.' }
