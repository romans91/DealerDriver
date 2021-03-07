import pool from "../db.js";
import vinParser from "../helpers/vin-parser.js"

const VinParse = {};

VinParse.validate = (vin) => {
    if (vin.length !== 17) return false;
    return vinParser.getCheckDigit(vin) === vin.charAt(8);
};

VinParse.get = async (vin) => {
    const vinDetails = {
        "year": vinParser.getYear(vin),
        "manufacturer": await vinParser.getManufacturer(vin),
        "model_details": vinParser.getModelCode(vin)
    }

    return vinDetails;
};

VinParse.registerWmi = async (code, manufacturer_name) => {
    code = code.substring(0, 3).toUpperCase();

    const newWmi = await pool.query(
        `INSERT INTO wmi_codes(code, manufacturer_name)
        VALUES('${code}', '${manufacturer_name}') 
        RETURNING *`);

    return newWmi.rows[0];
}

VinParse.wmiIsRegistered = async (code) => {
    code = code.substring(0, 3).toUpperCase();

    const wmi = await pool.query(
        `SELECT * FROM wmi_codes WHERE code = '${code}'`);
        
    return (wmi.rowCount > 0);
}

export default VinParse;