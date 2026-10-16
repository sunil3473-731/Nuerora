$ErrorActionPreference = 'Stop'
$pgBin = if ($env:NUERORA_PG_BIN) { $env:NUERORA_PG_BIN } else { Join-Path $env:LOCALAPPDATA 'Programs\PostgreSQL\18.6\pgsql\bin' }
$dataDir = if ($env:NUERORA_PGDATA) { $env:NUERORA_PGDATA } else { Join-Path $env:LOCALAPPDATA 'PostgreSQL\data\nuerora' }
$pgCtl = Join-Path $pgBin 'pg_ctl.exe'

if (-not (Test-Path $pgCtl)) { throw "PostgreSQL was not found at $pgBin" }
if (-not (Test-Path $dataDir)) { throw "PostgreSQL data directory was not found at $dataDir." }
& $pgCtl status -D $dataDir 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Output 'PostgreSQL is already stopped.'
    exit 0
}
& $pgCtl -D $dataDir -m fast -w stop
if ($LASTEXITCODE -ne 0) { throw 'PostgreSQL failed to stop.' }
