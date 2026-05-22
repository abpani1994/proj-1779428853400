#!/bin/bash
set -e

# Create the shadow database used by Prisma Migrate
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE "${POSTGRES_DB}_shadow";
    GRANT ALL PRIVILEGES ON DATABASE "${POSTGRES_DB}_shadow" TO "$POSTGRES_USER";
EOSQL
