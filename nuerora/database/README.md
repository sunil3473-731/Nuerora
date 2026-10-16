# Database setup

This folder contains PostgreSQL setup SQL and local server helper scripts for the Environmental Hotspot Activity Forecast app.

## Files

- `01_regions.sql` creates the `regions` table and inserts three sample regions.
- `02_countries.sql` creates the `countries` reference table, seeds country/economy records, and adds a foreign key from `regions.country` to `countries.country_name`.
- `start-postgres.ps1` and `stop-postgres.ps1` start or stop a local PostgreSQL server. They do not install PostgreSQL or create a database cluster.

Run the SQL files once, in order, against an empty database. For example, after PostgreSQL is running and `psql` is available:

```powershell
createdb -h 127.0.0.1 -p 5433 -U postgres nuerora_env
psql -h 127.0.0.1 -p 5433 -U postgres -d nuerora_env -v ON_ERROR_STOP=1 -f .\database\01_regions.sql
psql -h 127.0.0.1 -p 5433 -U postgres -d nuerora_env -v ON_ERROR_STOP=1 -f .\database\02_countries.sql
```

These files are initial setup scripts, not repeatable migrations. Running them again in the same database will fail because the tables already exist.

## Local server helpers

The helper scripts bind PostgreSQL to `127.0.0.1` and use port `5433` by default. They assume a PostgreSQL installation and an initialized data directory already exist. Defaults match the local development setup used for this project:

- Binaries: `%LOCALAPPDATA%\Programs\PostgreSQL\18.6\pgsql\bin`
- Data directory: `%LOCALAPPDATA%\PostgreSQL\data\nuerora`

Override these paths when needed by setting `NUERORA_PG_BIN`, `NUERORA_PGDATA`, or `NUERORA_PGPORT` before running the scripts. The database cluster is local machine state and is not stored in this repository. Initialize a cluster once with `initdb` before using `start-postgres.ps1`.

If PowerShell's execution policy blocks the helper scripts, run them in a process with an explicit policy, for example:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\database\start-postgres.ps1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\database\stop-postgres.ps1
```

The local development cluster uses password-free trust authentication and listens only on loopback. Do not use that authentication setup for a server exposed to a network.

## Country seed data and attribution

`02_countries.sql` contains 217 World Bank country/economy records retrieved on 2026-10-16 from the [World Bank Country API](https://api.worldbank.org/v2/country?format=json&per_page=400). Aggregate entries were filtered out; territories and economies are included as represented by the World Bank. Missing capital or coordinate values are stored as `NULL`.

Attribution: The World Bank, Country API. The World Bank's open data is generally made available under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); this seed was transformed by filtering aggregate entries and preserving unavailable values as `NULL`. Check the source's applicable terms if redistributing a different World Bank dataset.
