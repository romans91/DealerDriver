import app from "../../index.js";
import supertest from "supertest";
import pool from "../../db.js";
import formatting from '../../helpers/formatting.js';

export const financesTests = () => {
    beforeEach(async () => {
        await pool.query(
            `INSERT INTO vehicles(vin, year, make, model, colour, mileage, body_style, transmission, engine, acquisition_price_cents)
            VALUES ('3C6JD7AT0CG237427', 2015, 'Honda', 'Fit', 'White', 123445, '5 Door', 'Automatic', 'ICE', 1599999), 
            ('SAJAV134XGC444054', 2013, 'Mercedes-Benz', 'C200', 'White', 21290, 'Estate', 'Automatic', 'ICE', 3177599),
            ('WAUZZZ8LZXA010852', 1999, 'Audi', 'A3', 'Silver', 156333, 'Hatchback', 'Automatic', 'ICE', 655267),
            ('5TDKK3DC8FS542719', 2010, 'Nissan', 'X-Trail', 'Black', 53099,'SUV', 'Automatic', 'ICE', 1250000)`);

        await pool.query(
            `INSERT INTO roles(title, base_hourly_rate_cents)
            VALUES ('Manager', 25.00), ('Sales Agent', 21.25)`);

        await pool.query(
            `INSERT INTO staff(role_id, fullname, phone, email, address, city, postal_code)
            VALUES (1, 'Yi Chilcott', '001943433', 'yiC@gmail.com', '1589 Davis Place', 'Lehigh Acres', 'FL'), 
            (2, 'Mark McMullen', '001483234', 'markM@live.com', '143 Lawman Avenue', 'Arlington', 'VA'),
            (2, 'James Whitehead', '004392834', 'jamesW@gmail.com', '2939 Clinton Street', 'Philadelphia', 'PA')`);

        await pool.query(
            `INSERT INTO customers(fullname, phone, email, address, city, postal_code)
            VALUES ('Ernest Winter', '7273211922', 'ernestW@gmail.com', '4886 Ashford Drive', 'Alexandria', 'VA'), 
            ('Betty Lilly', '9256254897', 'bettyL@live.com', '3975 Alexander Avenue', 'Oakley', 'CA'), 
            ('Alana Knott', '9708127586', 'alanaK@hotmail.com', '1645 Stark Hollow Road', 'Denver', 'CO'), 
            ('Robert Mui', '4797885430', 'robertM@gmail.com', '1477 Cambridge Court', 'Fort Smith', 'AR'), 
            ('Diana Carder', '7327314729', 'dianaC@gmail.com', '3669 Duke Lane', 'Bellevile', 'NJ')`);

        await pool.query(
            `INSERT INTO sales(vin, sticker_price_cents, listing_date, sold_date, staff_id, commission_cents)
            VALUES('3C6JD7AT0CG237427', 1750000, TO_DATE('17/12/2021', 'DD/MM/YYYY'), TO_DATE('11/01/2022', 'DD/MM/YYYY'), 1, 20000), 
            ('SAJAV134XGC444054', 2300000, TO_DATE('22/11/2021', 'DD/MM/YYYY'), TO_DATE('11/04/2022', 'DD/MM/YYYY'), 2, 17525),
            ('5TDKK3DC8FS542719', 1500000, TO_DATE('23/12/2021', 'DD/MM/YYYY'), TO_DATE('05/07/2022', 'DD/MM/YYYY'), 1, 20050),
            ('WAUZZZ8LZXA010852', 900000, TO_DATE('16/12/2021', 'DD/MM/YYYY'), TO_DATE('01/03/2022', 'DD/MM/YYYY'), 2, 9000)`);

        await pool.query(
            `INSERT INTO finances(sale_id, customer_id, down_payment_cents, loan_cents, annual_interest_rate, payments_per_year, number_of_years, commencement_date, paid_to_date_cents)
            VALUES(1, 1, 500000, 1500000, 0.03, 12, 2, TO_DATE('01/01/2022', 'DD/MM/YYYY'), 30000),
            (2, 2, 500000, 1500000, 0.03, 26, 2, TO_DATE('01/01/2022', 'DD/MM/YYYY'), 30000),
            (3, 3, 500000, 1500000, 0.03, 52, 2, TO_DATE('01/01/2022', 'DD/MM/YYYY'), 30000)`);
    });

    afterEach(async () => {
        await pool.query(
            `TRUNCATE vehicles RESTART IDENTITY CASCADE`);

        await pool.query(
            `TRUNCATE sales RESTART IDENTITY CASCADE`);

        await pool.query(
            `TRUNCATE customers RESTART IDENTITY CASCADE`);

        await pool.query(
            `TRUNCATE staff RESTART IDENTITY CASCADE`);

        await pool.query(
            `TRUNCATE roles RESTART IDENTITY CASCADE`);

        await pool.query(
            `TRUNCATE finances RESTART IDENTITY CASCADE`);
    });

    test("GET /finances", async () => {
        await supertest(app).get("/finances")
            .expect(200)
            .then((response) => {
                expect(response.body[0]["sale_id"]).toBe(1);
                expect(response.body[0]["customer_id"]).toBe(1);
                expect(response.body[0]["down_payment"]).toBe(5000.00);
                expect(response.body[0]["loan"]).toBe(15000.00);
                expect(response.body[0]["annual_interest_rate"]).toBe("0.03");
                expect(response.body[0]["payments_per_year"]).toBe(12);
                expect(response.body[0]["number_of_years"]).toBe(2);
                expect(formatting.formatDate(response.body[0]["commencement_date"], "yyyy-mm-dd")).toBe("2022-01-01");
                expect(response.body[0]["paid_to_date"]).toBe(300.00);
            });
    });

    test("POST /finances/overdue", async () => {
        const date = {
            "current_date": "2022-03-01",
        }

        await supertest(app).post("/finances/overdue")
            .send(date)
            .expect(200)
            .then((response) => {
                expect(response.body[0]["customer_id"]).toBe(1);
                expect(response.body[0]["fullname"]).toBe("Ernest Winter");
                expect(response.body[0]["phone"]).toBe("7273211922");
                expect(response.body[0]["email"]).toBe("ernestW@gmail.com");
                expect(response.body[0]["loan"]).toBe(15000.00);
                expect(response.body[0]["paid_to_date"]).toBe(300.00);
                expect(response.body[0]["arrears"]).toBe(989.44);
            });
    });

    test("GET /finances/:sale_id", async () => {
        await supertest(app).get("/finances/1")
            .expect(200)
            .then((response) => {
                expect(response.body["sale_id"]).toBe(1);
                expect(response.body["customer_id"]).toBe(1);
                expect(response.body["down_payment"]).toBe(5000.00);
                expect(response.body["loan"]).toBe(15000.00);
                expect(response.body["annual_interest_rate"]).toBe("0.03");
                expect(response.body["payments_per_year"]).toBe(12);
                expect(response.body["number_of_years"]).toBe(2);
                expect(formatting.formatDate(response.body["commencement_date"], "yyyy-mm-dd")).toBe("2022-01-01");
                expect(response.body["paid_to_date"]).toBe(300.00);
            });
    });

    test("GET /finances/periodic_payment/:sale_id", async () => {
        await supertest(app).get("/finances/periodic_payment/1")
            .expect(200)
            .then((response) => {
                expect(response.body["rate"]).toBe(644.72);
            });

        await supertest(app).get("/finances/periodic_payment/2")
            .expect(200)
            .then((response) => {
                expect(response.body["rate"]).toBe(297.37);
            });

        await supertest(app).get("/finances/periodic_payment/3")
            .expect(200)
            .then((response) => {
                expect(response.body["rate"]).toBe(148.64);
            });
    });

    test("POST /finances/expected_paid_amount/:sale_id", async () => {
        
        // On the day of the sale.
        let currentDate = {
            "date": "2022-01-01"
        }

        expect(await amountExpectedBy(1, currentDate)).toBe(0);
        expect(await amountExpectedBy(2, currentDate)).toBe(0);
        expect(await amountExpectedBy(3, currentDate)).toBe(0);

        // One weekly payment after the sale.
        currentDate = {
            "date": "2022-01-09"
        }

        expect(await amountExpectedBy(1, currentDate)).toBe(0);
        expect(await amountExpectedBy(2, currentDate)).toBe(0);
        expect(await amountExpectedBy(3, currentDate)).toBe(148.64);

        // One fortnightly payment after the sale.
        currentDate = {
            "date": "2022-01-17"
        }

        expect(await amountExpectedBy(1, currentDate)).toBe(0);
        expect(await amountExpectedBy(2, currentDate)).toBe(297.37);
        expect(await amountExpectedBy(3, currentDate)).toBe(297.29);

        // One monthly payment after the sale.
        currentDate = {
            "date": "2022-02-02"
        }

        expect(await amountExpectedBy(1, currentDate)).toBe(644.72);
        expect(await amountExpectedBy(2, currentDate)).toBe(594.74);
        expect(await amountExpectedBy(3, currentDate)).toBe(594.57);
    });

    var amountExpectedBy = async function (finance_sale_id, the_date) {
        let i = 0;
        await supertest(app).post(`/finances/expected_paid_amount/${finance_sale_id}`)
            .send(the_date)
            .expect(200)
            .then((response) => {
                i = response.body["amount"];
            });
            return i;
    }
    
    test("POST /finances/", async () => {
        const newfinance = {
            "sale_id": 4,
            "customer_id": 2,
            "down_payment": 3000.00,
            "loan": 7000.00,
            "annual_interest_rate": 0.03,
            "payments_per_year": 24,
            "number_of_years": 2,
            "commencement_date": "2022-11-13",
            "paid_to_date": 0
        }

        await supertest(app).post("/finances")
            .send(newfinance)
            .expect(200)
            .then((response) => {
                expect(response.body["sale_id"]).toBe(newfinance["sale_id"]);
                expect(response.body["customer_id"]).toBe(newfinance["customer_id"]);
                expect(response.body["down_payment"]).toBe(newfinance["down_payment"]);
                expect(response.body["loan"]).toBe(newfinance["loan"]);
                expect(response.body["annual_interest_rate"]).toBe(newfinance["annual_interest_rate"].toString());
                expect(response.body["payments_per_year"]).toBe(newfinance["payments_per_year"]);
                expect(response.body["number_of_years"]).toBe(newfinance["number_of_years"]);
                expect(formatting.formatDate(response.body["commencement_date"], "yyyy-mm-dd")).toBe(formatting.formatDate(newfinance["commencement_date"], "yyyy-mm-dd"));
                expect(response.body["paid_to_date"]).toBe(newfinance["paid_to_date"]);
            });
    });

    test("PATCH /finances/:sale_id", async () => {
        const newfinanceDetails = {
            "sale_id": 1,
            "customer_id": 2,
            "down_payment": 4000.00,
            "loan": 5000.00,
            "annual_interest_rate": 0.04,
            "payments_per_year": 24,
            "number_of_years": 1,
            "commencement_date": "2021-10-30",
            "paid_to_date": 2500.00
        }

        await supertest(app).patch("/finances/1")
            .send(newfinanceDetails)
            .expect(200)
            .then((response) => {
                expect(response.body["sale_id"]).toBe(newfinanceDetails["sale_id"]);
                expect(response.body["customer_id"]).toBe(newfinanceDetails["customer_id"]);
                expect(response.body["down_payment"]).toBe(newfinanceDetails["down_payment"]);
                expect(response.body["loan"]).toBe(newfinanceDetails["loan"]);
                expect(response.body["annual_interest_rate"]).toBe(newfinanceDetails["annual_interest_rate"].toString());
                expect(response.body["payments_per_year"]).toBe(newfinanceDetails["payments_per_year"]);
                expect(response.body["number_of_years"]).toBe(newfinanceDetails["number_of_years"]);
                expect(formatting.formatDate(response.body["commencement_date"], "yyyy-mm-dd")).toBe(formatting.formatDate(newfinanceDetails["commencement_date"], "yyyy-mm-dd"));
                expect(response.body["paid_to_date"]).toBe(newfinanceDetails["paid_to_date"]);
            });
    });

    test("DELETE /finances/:sale_id", async () => {
        const sale_id = 1;
        const financeToDelete = await pool.query(
            `SELECT * FROM finances 
            WHERE sale_id = ${sale_id}`);

        await supertest(app).delete(`/finances/${sale_id}`)
            .expect(200)
            .then((response) => {
                expect(response.body["sale_id"]).toBe(financeToDelete.rows[0]["sale_id"]);
                expect(response.body["customer_id"]).toBe(financeToDelete.rows[0]["customer_id"]);
                expect(response.body["down_payment"]).toBe(financeToDelete.rows[0]["down_payment"]);
                expect(response.body["loan"]).toBe(financeToDelete.rows[0]["loan"]);
                expect(response.body["annual_interest_rate"]).toBe(financeToDelete.rows[0]["annual_interest_rate"].toString());
                expect(response.body["payments_per_year"]).toBe(financeToDelete.rows[0]["payments_per_year"]);
                expect(response.body["number_of_years"]).toBe(financeToDelete.rows[0]["number_of_years"]);
                expect(formatting.formatDate(response.body["commencement_date"], "yyyy-mm-dd")).toBe(formatting.formatDate(financeToDelete.rows[0]["commencement_date"], "yyyy-mm-dd"));
                expect(response.body["paid_to_date"]).toBe(financeToDelete.rows[0]["paid_to_date"]);
            });
    });
}