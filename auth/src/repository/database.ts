import createConnectionPool, { sql, SQLQuery } from "@databases/pg";

export { sql, SQLQuery };

const DB_HOSTNAME = process.env.PGHOST || "localhost";
const DB_PASSWORD = process.env.PGPASSWORD || "spacecraft";
const DB_USER = process.env.PGUSER || "auth";
const db = createConnectionPool({
    connectionString: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOSTNAME}:5432/spacecraft`,
    bigIntMode: "bigint"
});
export default db;
