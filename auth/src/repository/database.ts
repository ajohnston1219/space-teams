import createConnectionPool, { sql, SQLQuery } from "@databases/pg";

export { sql, SQLQuery };

// TODO(adam): env variables
const db = createConnectionPool({
    connectionString: "postgres://auth:spacecraft@localhost:5432/spacecraft",
    bigIntMode: "bigint"
});
export default db;
