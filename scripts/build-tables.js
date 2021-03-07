import fs from 'fs';
import pool from "../db.js";
import fastcsv from "fast-csv";

const dbSchema = fs.readFileSync('database/schema.sql').toString();
await pool.query(dbSchema);

await runInsertQuery(`INSERT INTO vehicle_manufacturers(name, country_of_origin) VALUES`, "database/data/manufacturers.csv", false);
await runInsertQuery(`INSERT INTO wmi_codes(code, manufacturer_name) VALUES`, "database/data/wmi_codes.csv", true);

async function runInsertQuery(query, dataLocation, closeConnectionAfterwards) {
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
            await pool.query(query)
                .then(async () => {
                    if (closeConnectionAfterwards)
                        await pool.end();
                });;
        });

    stream.pipe(csvStream);
}