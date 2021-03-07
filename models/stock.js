import pool from "../db.js";

const Stock = {};

Stock.put = async (vin, branch_id) => {
    const vehicleDestinationBranch = await pool.query(
        `SELECT branch_name, vehicle_capacity FROM branches WHERE branch_id = '${branch_id}'`);

    const rowCountInDestinationBranch = await pool.query(
        `SELECT COUNT(*) FROM stock WHERE branch_id = '${branch_id}'`);

    if (vehicleDestinationBranch.rows[0]["vehicle_capacity"] > rowCountInDestinationBranch.rows[0]["count"]) {
        const newstock = await pool.query(
            `INSERT INTO stock(vin, branch_id) 
            VALUES($1, $2) 
            ON CONFLICT (vin) 
            DO UPDATE SET branch_id = $2 RETURNING *`,
            [vin, branch_id]);

        return newstock.rows[0];
    } else {
        throw(new Error(`Cannot move vehicle to ${vehicleDestinationBranch.rows[0]["branch_name"]} since it is already at maximum capacity (${vehicleDestinationBranch.rows[0]["vehicle_capacity"]} vehicles).`));
    }
}

export default Stock;