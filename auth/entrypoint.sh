PGUSER=auth \
PGHOST=${PG_HOSTNAME} \
PGPASSWORD=${DB_PASSWORD} \
PGDATABASE=spacecraft \
PGPORT=5432 \
nodemon src/index.ts
