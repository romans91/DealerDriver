import pool from "../db.js";
import queryBuilder from "../helpers/query-builder.js";

const Maintenance = {};

Maintenance.getAll = async () => {
    try {
        const maintenance = await pool.query(
            `SELECT vin, description, commencement_date_time, completion_date_time, CAST(quote_cents * 1.0 / 100 AS float) as quote FROM Maintenance`);

        return maintenance.rows;
    } catch (err) {
        console.error(err.stack);
    }
}

Maintenance.getById = async (maintenance_id) => {
    try {
        const maintenance = await pool.query(
            `SELECT maintenance_id, vin, description, commencement_date_time, completion_date_time, CAST(quote_cents * 1.0 / 100 AS float) as quote FROM Maintenance 
            WHERE maintenance_id = ${maintenance_id}`);

        return maintenance.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Maintenance.create = async (vin, description, commencement_date_time, completion_date_time, quote) => {
    try {
        const newMaintenance = await pool.query(
            `INSERT INTO Maintenance(vin, description, commencement_date_time, completion_date_time, quote_cents) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING maintenance_id, vin, description, commencement_date_time, completion_date_time, CAST(quote_cents * 1.0 / 100 AS float) as quote`,
            [vin, description, commencement_date_time, completion_date_time, Math.floor(quote * 100)]);

        return newMaintenance.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Maintenance.update = async (maintenance_id, newValues) => {
    try {
        let columnsToConvertToCents = [`quote`];
        const columnsToReturn = [`maintenance_id`, `vin`, `description`, `commencement_date_time`, `completion_date_time`, `quote`];

        const maintenanceAfterUpdate = await pool.query(
            queryBuilder.buildMultipleColumnUpdateQuery(newValues, columnsToConvertToCents, columnsToReturn, `maintenance`, `maintenance_id`, maintenance_id));

        return maintenanceAfterUpdate.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Maintenance.delete = async (maintenance_id) => {
    try {
        const deletedMaintenance = await pool.query(
            `DELETE FROM Maintenance 
            WHERE maintenance_id = '${maintenance_id}' 
            RETURNING maintenance_id, vin, description, commencement_date_time, completion_date_time, CAST(quote_cents * 1.0 / 100 AS float) as quote`);

        return deletedMaintenance.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

export default Maintenance;