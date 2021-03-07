import pool from "../db.js";
import queryBuilder from "../helpers/query-builder.js";

const Sales = {};

Sales.getAll = async () => {
    try {
        const sales = await pool.query(
            `SELECT sale_id, vin, CAST(sticker_price_cents * 1.0 / 100 AS float) as sticker_price, listing_date, sold_date, staff_id, CAST(commission_cents * 1.0 / 100 AS float) as commission 
            FROM Sales`);

        return sales.rows;
    } catch (err) {
        console.error(err.stack);
    }
}

Sales.getById = async (sale_id) => {
    try {
        const sales = await pool.query(
            `SELECT sale_id, vin, CAST(sticker_price_cents * 1.0 / 100 AS float) as sticker_price, listing_date, sold_date, staff_id, CAST(commission_cents * 1.0 / 100 AS float) as commission 
            FROM Sales 
            WHERE sale_id = ${sale_id}`);

        return sales.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Sales.create = async (vin, sticker_price, listing_date, sold_date, staff_id, commission) => {
    try {
        const newSale = await pool.query(
            `INSERT INTO Sales(vin, sticker_price_cents, listing_date, sold_date, staff_id, commission_cents) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING sale_id, vin, CAST(sticker_price_cents * 1.0 / 100 AS float) as sticker_price, listing_date, sold_date, staff_id, CAST(commission_cents * 1.0 / 100 AS float) as commission`,
            [vin, Math.floor(sticker_price * 100), listing_date, sold_date, staff_id, Math.floor(commission * 100)]);

        return newSale.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Sales.update = async (sale_id, newValues) => {
    try {
        let columnsToConvertToCents = [`sticker_price`, `commission`];
        const columnsToReturn = [`sale_id`, `vin`, `sticker_price`, `listing_date`, `sold_date`, `staff_id`, `commission`];

        const saleAfterUpdate = await pool.query(
            queryBuilder.buildMultipleColumnUpdateQuery(newValues, columnsToConvertToCents, columnsToReturn, `sales`, `sale_id`, sale_id));

        return saleAfterUpdate.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Sales.delete = async (sale_id) => {
    try {
        const deletedSale = await pool.query(
            `DELETE FROM Sales 
            WHERE sale_id = '${sale_id}' 
            RETURNING sale_id, vin, CAST(sticker_price_cents * 1.0 / 100 AS float) as sticker_price, listing_date, sold_date, staff_id, CAST(commission_cents * 1.0 / 100 AS float) as commission`);

        return deletedSale.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

export default Sales;