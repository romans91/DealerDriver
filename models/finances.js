import pool from "../db.js";
import queryBuilder from "../helpers/query-builder.js";
import financialFunctions from "../helpers/financial-functions.js"

const Finances = {};

Finances.getAll = async () => {
    try {
        const finances = await pool.query(
            `SELECT sale_id, customer_id, CAST(down_payment_cents * 1.0 / 100 AS float) as down_payment, CAST(loan_cents * 1.0 / 100 AS float) as loan, annual_interest_rate, payments_per_year, number_of_years, commencement_date, CAST(paid_to_date_cents * 1.0 / 100 AS float) as paid_to_date 
            FROM Finances`);

        return finances.rows;
    } catch (err) {
        console.error(err.stack);
    }
}

Finances.getOverdue = async (current_date) => {
    try {
        const finances = await pool.query(
            `SELECT * FROM Finances 
            INNER JOIN customers ON (customers.customer_id = finances.customer_id) 
            WHERE loan_cents > paid_to_date_cents`);

        let overdueFinances = [];
        finances.rows.forEach(finance => {
            const expectedPaidAmount = financialFunctions.getAmountExpectedBy(
                finance["commencement_date"], current_date, finance["loan_cents"], finance["annual_interest_rate"], finance["payments_per_year"], finance["number_of_years"]);

            let arrears = Math.round(expectedPaidAmount - finance["paid_to_date_cents"]);
            arrears = Math.min(arrears, (finance["loan_cents"] - finance["paid_to_date_cents"]));

            if (arrears > 0) {
                overdueFinances.push({
                    customer_id: finance["customer_id"],
                    fullname: finance["fullname"],
                    phone: finance["phone"],
                    email: finance["email"],
                    loan: finance["loan_cents"] / 100,
                    paid_to_date: finance["paid_to_date_cents"] / 100,
                    arrears: arrears / 100
                });
            }
        });

        return overdueFinances;
    } catch (err) {
        console.error(err.stack);
    }
}

Finances.getById = async (sale_id) => {
    try {
        const finances = await pool.query(
            `SELECT sale_id, customer_id, CAST(down_payment_cents * 1.0 / 100 AS float) as down_payment, CAST(loan_cents * 1.0 / 100 AS float) as loan, annual_interest_rate, payments_per_year, number_of_years, commencement_date, CAST(paid_to_date_cents * 1.0 / 100 AS float) as paid_to_date 
            FROM Finances 
            WHERE sale_id = ${sale_id}`);

        return finances.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Finances.create = async (sale_id, customer_id, down_payment, loan, annual_interest_rate, payments_per_year, number_of_years, commencement_date, paid_to_date) => {
    try {
        const newFinance = await pool.query(
            `INSERT INTO Finances(sale_id, customer_id, down_payment_cents, loan_cents, annual_interest_rate, payments_per_year, number_of_years, commencement_date, paid_to_date_cents) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING sale_id, customer_id, CAST(down_payment_cents * 1.0 / 100 AS float) as down_payment, CAST(loan_cents * 1.0 / 100 AS float) as loan, annual_interest_rate, payments_per_year, number_of_years, commencement_date, CAST(paid_to_date_cents * 1.0 / 100 AS float) as paid_to_date`,
            [sale_id, customer_id, Math.floor(down_payment * 100), Math.floor(loan * 100), annual_interest_rate, payments_per_year, number_of_years, commencement_date, Math.floor(paid_to_date * 100)]);

        return newFinance.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Finances.update = async (sale_id, newValues) => {
    try {
        let columnsToConvertToCents = ['down_payment', 'loan', 'paid_to_date'];
        const columnsToReturn = [`sale_id`, `customer_id`, `down_payment`, `loan`, `annual_interest_rate`, `payments_per_year`, `number_of_years`, `commencement_date`, `paid_to_date`];


        const financeAfterUpdate = await pool.query(
            queryBuilder.buildMultipleColumnUpdateQuery(newValues, columnsToConvertToCents, columnsToReturn, `finances`, `sale_id`, sale_id));

        return financeAfterUpdate.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Finances.delete = async (sale_id) => {
    try {
        const deletedFinance = await pool.query(
            `DELETE FROM Finances 
            WHERE sale_id = '${sale_id}' 
            RETURNING *`);

        return deletedFinance.rows[0];
    } catch (err) {
        console.error(err.stack);
    }
}

Finances.periodicRate = async (sale_id) => {
    try {
        const finance = await pool.query(
            `SELECT loan_cents, annual_interest_rate, payments_per_year, number_of_years FROM Finances 
            WHERE sale_id = '${sale_id}'`);

        const rateInCents = financialFunctions.getPeriodicPayment(finance.rows[0]["loan_cents"], finance.rows[0]["annual_interest_rate"], finance.rows[0]["payments_per_year"], finance.rows[0]["number_of_years"]);
        const rate = parseFloat((rateInCents / 100).toFixed(2));

        return {
            "rate": rate
        };
    } catch (err) {
        console.error(err.stack);
    }
}

Finances.amountExpectedBy = async (sale_id, date) => {
    try {
        const finance = await pool.query(
            `SELECT loan_cents, annual_interest_rate, payments_per_year, number_of_years, commencement_date FROM Finances 
            WHERE sale_id = '${sale_id}'`);

        const expectedAmountInCentsPaidByDate = financialFunctions.getAmountExpectedBy(finance.rows[0]["commencement_date"], date, finance.rows[0]["loan_cents"], finance.rows[0]["annual_interest_rate"], finance.rows[0]["payments_per_year"], finance.rows[0]["number_of_years"]);
        return {
            "amount": parseFloat((expectedAmountInCentsPaidByDate / 100).toFixed(2))
        };
    } catch (err) {
        console.error(err.stack);
    }
}

export default Finances;