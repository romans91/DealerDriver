import pool from "../../db.js";

export const teardown = () => {
    it("Dropping all tables", async () => {
        await pool.query(
            `DROP TABLE customers, maintenance, roles, sales, staff, vehicle_manufacturers, vehicles, branches, finances, stock, wmi_codes;`);         
    });

    it("Closing db connection", async () => { 
        await pool.end();
    });
}