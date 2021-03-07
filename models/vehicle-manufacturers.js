import pool from "../db.js";

const VehicleManufacturers = {};

VehicleManufacturers.getAll = async () => {
    try {
        const vehicleManufacturers = await pool.query(
            `SELECT * FROM vehicle_manufacturers`);

        return vehicleManufacturers.rows;
    } catch (err) {
        console.error(err.stack);
    }
}

VehicleManufacturers.getById = async (name) => {
    try {
        const vehicleManufacturers = await pool.query(
            `SELECT * FROM vehicle_manufacturers 
            WHERE name = '${name}'`);

        return vehicleManufacturers.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

VehicleManufacturers.register = async (name, country_of_origin) => {
    try {
        const vehicleManufacturer = await pool.query(
            `INSERT INTO vehicle_manufacturers(name, country_of_origin) 
            VALUES('${name}', '${country_of_origin}')
            RETURNING *`);

        return vehicleManufacturer.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

export default VehicleManufacturers;