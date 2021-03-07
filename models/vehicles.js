import pool from "../db.js";
import VinParse from "../models/vin-parse.js"
import queryBuilder from "../helpers/query-builder.js";

const Vehicles = {};

Vehicles.getAll = async () => {
    try {
        const vehicles = await pool.query(
            `SELECT vin, year, make, model, model_specifics, colour, mileage, body_style, transmission, engine, CAST(acquisition_price_cents * 1.0 / 100 AS float) as acquisition_price FROM Vehicles`);

        return vehicles.rows;
    } catch (err) {
        console.error(err.stack);
    }
}

Vehicles.getByVin = async (vin) => {
    try {
        const vehicles = await pool.query(
            `SELECT vin, year, make, model, model_specifics, colour, mileage, body_style, transmission, engine, CAST(acquisition_price_cents * 1.0 / 100 AS float) as acquisition_price FROM vehicles 
            WHERE vin = '${vin}'`);

        return vehicles.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Vehicles.createByVin = async (vin) => {
    try {
        const vinIsAValidVinNumber = await VinParse.validate(vin);
        const wmiIsRegistered = await VinParse.wmiIsRegistered(vin);

        if (vinIsAValidVinNumber && wmiIsRegistered) {
            const vehicle_details = await VinParse.get(vin);
            const newVehicle = await pool.query(
                `INSERT INTO Vehicles(vin, year, make, model) 
            VALUES ($1, $2, $3, $4) 
            RETURNING vin, year, make, model, model_specifics, colour, mileage, body_style, transmission, engine, CAST(acquisition_price_cents * 1.0 / 100 AS float) as acquisition_price`,
                [vin, vehicle_details["year"], vehicle_details["manufacturer"], vehicle_details["model_details"]]);

            return newVehicle.rows[0];
        } else {
            throw(new Error(`No vahicle manufacturer registered for WMI code '${vin.substring(0, 3)}'. ` + 
            `Find out the manufacturer that corresponds to this code. If the manufacturer exists in the "vehicle_manufacturers" database, register it to the WMI code. ` + 
            `If it does not exist, then add it to the "vehicle_manufacturers" database, and then register it to the WMI code.`));
        }
    } catch (err) {
        console.error(err.stack);
    }
}

Vehicles.create = async (vin, year, make, model, model_specifics, colour, mileage, body_style, transmission, engine, acquisition_price) => {
    try {
        const newVehicle = await pool.query(
            `INSERT INTO Vehicles(vin, year, make, model, model_specifics, colour, mileage, body_style, transmission, engine, acquisition_price_cents) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING vin, year, make, model, model_specifics, colour, mileage, body_style, transmission, engine, CAST(acquisition_price_cents * 1.0 / 100 AS float) as acquisition_price`,
            [vin, year, make, model, model_specifics, colour, mileage, body_style, transmission, engine, Math.floor(acquisition_price * 100)]);

        return newVehicle.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Vehicles.update = async (vin, newValues) => {
    try {
        let columnsToConvertToCents = [ `acquisition_price` ];
        const columnsToReturn = [`vin`, `year`, `make`, `model`, `model_specifics`, `colour`, `mileage`, `body_style`, `transmission`, `engine`, `acquisition_price`];

        const vehicleAfterUpdate = await pool.query(queryBuilder.buildMultipleColumnUpdateQuery(newValues, columnsToConvertToCents, columnsToReturn, `vehicles`, `vin`, vin));

        return vehicleAfterUpdate.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Vehicles.delete = async (vin) => {
    try {
        const deletedVehicle = await pool.query(
            `DELETE FROM Vehicles 
            WHERE vin = '${vin}' 
            RETURNING vin, year, make, model, model_specifics, colour, mileage, body_style, transmission, engine, CAST(acquisition_price_cents * 1.0 / 100 AS float) as acquisition_price`);

        return deletedVehicle.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

export default Vehicles;