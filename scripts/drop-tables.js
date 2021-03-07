import pool from "../db.js";

await pool.query(
    `DROP TABLE customers, maintenance, roles, sales, staff, vehicle_manufacturers, vehicles, branches, finances, stock, wmi_codes;`)
    .then(pool.end());