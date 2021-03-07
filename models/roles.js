import pool from "../db.js";
import queryBuilder from "../helpers/query-builder.js";

const Roles = {};

Roles.getAll = async () => {
    try {
        const roles = await pool.query(
            `SELECT role_id, title, CAST(base_hourly_rate_cents * 1.0 / 100 AS float) as base_hourly_rate FROM Roles`);

        return roles.rows;
    } catch (err) {
        console.error(err.stack);
    }
}

Roles.getById = async (role_id) => {
    try {
        const roles = await pool.query(
            `SELECT role_id, title, CAST(base_hourly_rate_cents * 1.0 / 100 AS float) as base_hourly_rate FROM Roles 
            WHERE role_id = ${role_id}`);

        return roles.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Roles.create = async (title, base_hourly_rate) => {
    try {
        const newrole = await pool.query(
            `INSERT INTO Roles(title, base_hourly_rate_cents) 
            VALUES ($1, $2) 
            RETURNING role_id, title, CAST(base_hourly_rate_cents * 1.0 / 100 AS float) as base_hourly_rate`,
            [title, Math.floor(base_hourly_rate * 100)]);

        return newrole.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Roles.update = async (role_id, newValues) => {
    try {
        let columnsToConvertToCents = [`base_hourly_rate`];
        const columnsToReturn = [`role_id`, `title`, `base_hourly_rate`];

        const roleAfterUpdate = await pool.query(
            queryBuilder.buildMultipleColumnUpdateQuery(newValues, columnsToConvertToCents, columnsToReturn, `roles`, `role_id`, role_id));

        return roleAfterUpdate.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Roles.delete = async (role_id) => {
    try {
        const deletedrole = await pool.query(
            `DELETE FROM Roles 
            WHERE role_id = '${role_id}' 
            RETURNING role_id, title, CAST(base_hourly_rate_cents * 1.0 / 100 AS float) as base_hourly_rate`);

        return deletedrole.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

export default Roles;