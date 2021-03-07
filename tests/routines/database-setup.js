import pool from '../../db.js';
const fs = require('fs');
const fastcsv = require("fast-csv");

export const setup = () => {
    it("Generating all tables", async () => {
        const dbSchema = fs.readFileSync('database/schema.sql').toString();
        await pool.query(dbSchema);

        await runInsertQuery(`INSERT INTO vehicle_manufacturers(name, country_of_origin) VALUES`, "database/data/manufacturers.csv");
        await runInsertQuery(`INSERT INTO wmi_codes(code, manufacturer_name) VALUES`, "database/data/wmi_codes.csv");
    });

    async function runInsertQuery(query, dataLocation) {
        let stream = fs.createReadStream(dataLocation);
        let csvData = [];
        let csvStream = fastcsv
            .parse()
            .on("data", function (data) {
                csvData.push(data);
            })
            .on("end", async function () {               
                csvData.forEach(row => {
                    query += ` ('${row[0]}', '${row[1]}'),`
                });
                query = query.slice(0, -1) + ';';
                await pool.query(query);              
            });

        stream.pipe(csvStream);
    }
}
