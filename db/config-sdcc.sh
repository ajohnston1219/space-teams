#!/bin/bash
export PGPASSWORD=$1;

pg_ctl -D /usr/local/pgsql/data -l /usr/local/pgsql/data/serverlog start;

set_password_cmd() {
    echo "ALTER ROLE ${1} WITH PASSWORD '${2}'";
}

# DB Migrations
cd /home/db/migrations/sdcc
psql -f /home/db/migrations/sdcc/db.sql
echo "flyway.password = ${1}" >> flyway.conf;
flyway migrate;
psql -f /home/db/migrations/sdcc/dev-setup.sql

# Set db password
psql -c "$(set_password_cmd spacecraft ${2})";

# Set app password
users="auth sims competitions messages resources billing";
for u in $users
do
    psql -c "$(set_password_cmd $u ${3})";
done

# DB Shutdown
pg_ctl -D /usr/local/pgsql/data stop;

unset PGPASSWORD;
