import fs from 'fs';
import pool from "../db.js";

const dbSchema = fs.readFileSync('database/data/sample_data.sql').toString();
await pool.query(dbSchema)
    .then(pool.end());