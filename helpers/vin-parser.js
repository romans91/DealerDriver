import pool from "../db.js";

const vinParser = {};

vinParser.getCheckDigit = (vin) => {
    const map = '0123456789X';
    const weights = '8765432X098765432';
    let sum = 0;
    for (let i = 0; i < 17; ++i) {
        sum += ('0123456789.ABCDEFGH..JKLMN.P.R..STUVWXYZ'.indexOf(vin.charAt(i)) % 10) * map.indexOf(weights.charAt(i));
    }

    return map.charAt(sum % 11);
};

vinParser.getYear = (vin) => {
    const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let indexOfYearCode = 0;
    if (isNaN(vin.charAt(6))) {
        indexOfYearCode = values.lastIndexOf(vin.charAt(9));
    } else {
        indexOfYearCode = values.indexOf(vin.charAt(9));
    }

    return 1980 + indexOfYearCode;
};

vinParser.getManufacturer = async (vin) => {
    const wmi = vin.substring(0, 3);

    const manufacturer = await pool.query(
        `SELECT manufacturer_name FROM wmi_codes 
        WHERE code = '${wmi}'`);

    return manufacturer.rows[0]["manufacturer_name"];
};

vinParser.getModelCode = (vin) => {
    return vin.substring(3, 8);
}; 

export default vinParser;