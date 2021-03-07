import pool from "../db.js";
import queryBuilder from "../helpers/query-builder.js";

const branches = {};

branches.getAll = async () => {
    try {
        const branches = await pool.query(
            `SELECT * FROM branches`);

        return branches.rows;
    } catch (err) {
        console.error(err.stack);
    }
}

branches.getById = async (branch_id) => {
    try {
        const branches = await pool.query(
            `SELECT * FROM branches 
            WHERE branch_id = ${branch_id}`);

        return branches.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

branches.create = async (branch_name, phone, address, vehicle_capacity) => {
    try {
        const newBranch = await pool.query(
            `INSERT INTO branches(branch_name, phone, address, vehicle_capacity) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [branch_name, phone, address, vehicle_capacity]);

        return newBranch.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

branches.update = async (branch_id, newValues) => {
    try {

        const columnsToReturn = [`branch_id`, `branch_name`, `phone`, `address`, `vehicle_capacity`];

        const branchAfterUpdate = await pool.query(
            queryBuilder.buildMultipleColumnUpdateQuery(newValues, [], columnsToReturn, `branches`, `branch_id`, branch_id));

        return branchAfterUpdate.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

branches.delete = async (branch_id) => {
    try {
        const deletedBranch = await pool.query(
            `DELETE FROM branches 
            WHERE branch_id = '${branch_id}' 
            RETURNING *`);

        return deletedBranch.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

export default branches;