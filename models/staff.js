import pool from "../db.js";
import queryBuilder from "../helpers/query-builder.js";
import branches from "./branches.js";

const Staff = {};

Staff.getAll = async () => {
    try {
        const staff = await pool.query(
            `SELECT * FROM staff`);

        return staff.rows;
    } catch (err) {
        console.error(err.stack);
    }
}

Staff.getById = async (staff_id) => {
    try {
        const staffMember = await pool.query(
            `SELECT * FROM staff 
            WHERE staff_id = ${staff_id}`);

        return staffMember.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Staff.create = async (role_id, branch_id, fullname, phone, email, address, city, postal_code) => {
    try {
        const newStaffMember = await pool.query(
            `INSERT INTO staff(role_id, branch_id, fullname, phone, email, address, city, postal_code) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`,
            [role_id, branch_id, fullname, phone, email, address, city, postal_code]);

        return newStaffMember.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Staff.update = async (staff_id, newValues) => {
    try {
        const columnsToReturn = [`staff_id`, `role_id`, `branch_id`, `fullname`, `phone`, `email`, `address`, `city`, `postal_code`];

        const staffMemberAfterUpdate = await pool.query(
            queryBuilder.buildMultipleColumnUpdateQuery(newValues, [], columnsToReturn, `staff`, `staff_id`, staff_id));

        return staffMemberAfterUpdate.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Staff.delete = async (staff_id) => {
    try {
        const deletedStaffMember = await pool.query(
            `DELETE FROM staff 
            WHERE staff_id = '${staff_id}' 
            RETURNING *`);

        return deletedStaffMember.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

export default Staff;