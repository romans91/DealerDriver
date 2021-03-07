import pool from "../db.js";
import queryBuilder from "../helpers/query-builder.js";

const Customers = {};

Customers.getAll = async () => {
    try {
        const customers = await pool.query(
            `SELECT * FROM customers`);

        return customers.rows;
    } catch (err) {
        console.error(err.stack);
    }
}

Customers.getById = async (customer_id) => {
    try {
        const customers = await pool.query(
            `SELECT * FROM customers 
            WHERE customer_id = ${customer_id}`);

        return customers.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Customers.create = async (fullname) => {
    try {
        const newcustomer = await pool.query(
            `INSERT INTO customers(fullname) 
            VALUES ($1) 
            RETURNING *`,
            [fullname]);

        return newcustomer.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Customers.update = async (customer_id, newValues) => {
    try {
        const columnsToReturn = [`customer_id`, `fullname`, `phone`, `email`, `address`, `city`, `postal_code`];

        const customerAfterUpdate = await pool.query(
            queryBuilder.buildMultipleColumnUpdateQuery(newValues, [], columnsToReturn, `customers`, `customer_id`, customer_id));

        return customerAfterUpdate.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Customers.delete = async (customer_id) => {
    try {
        const deletedcustomer = await pool.query(
            `DELETE FROM customers 
            WHERE customer_id = '${customer_id}' 
            RETURNING *`);

        return deletedcustomer.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

export default Customers;