import createConnectionPool, { sql, SQLQuery } from "@databases/pg";

export { sql, SQLQuery };

const DB_HOSTNAME = process.env.PGHOST || "localhost";
const DB_PASSWORD = process.env.PGPASSWORD || "spacecraft";
const db = createConnectionPool({
    connectionString: `postgres://auth:${DB_PASSWORD}@${DB_HOSTNAME}:5432/spacecraft`,
    bigIntMode: "bigint"
});
export default db;
