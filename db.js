import postgres from "pg";
const Pool = postgres.Pool;

const pool = new Pool({
    user: "",
    password: "",
    database: "",
    host: "",
    port: 0
});

export default pool;