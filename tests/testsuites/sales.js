import app from "../../index.js";
import supertest from "supertest";
import pool from "../../db.js";
import formatting from '../../helpers/formatting.js';

export const salesTests = () => {

    beforeEach(async () => {
        await pool.query(
            `INSERT INTO vehicles(vin, year, make, model, colour, mileage, body_style, transmission, engine, acquisition_price_cents)
            VALUES ('3C6JD7AT0CG237427', 2015, 'Honda', 'Fit', 'White', 123445, '5 Door', 'Automatic', 'ICE', 1599999), 
            ('SAJAV134XGC444054', 2013, 'Mercedes-Benz', 'C200', 'White', 21290,'Estate', 'Automatic', 'ICE', 3177599),
            ('5TDKK3DC8FS542719', 2010, 'Nissan', 'X-Trail', 'Black', 53099,'SUV', 'Automatic', 'ICE', 1250000)`);

        await pool.query(
            `INSERT INTO roles(title, base_hourly_rate_cents)
            VALUES ('Manager', 25.00), ('Sales Agent', 2125)`);

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
            ('SAJAV134XGC444054', 2300000, TO_DATE('22/11/2021', 'DD/MM/YYYY'), TO_DATE('11/04/2022', 'DD/MM/YYYY'), 2, 17525)`);
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
    });

    test("GET /sales", async () => {
        await supertest(app).get("/sales")
            .expect(200)
            .then((response) => {
                expect(response.body[0]["sale_id"]).toBe(1);
                expect(response.body[0]["vin"]).toBe("3C6JD7AT0CG237427");
                expect(response.body[0]["sticker_price"]).toBe(17500.00);
                expect(formatting.formatDate(response.body[0]["listing_date"], "yyyy-mm-dd")).toBe("2021-12-17");
                expect(formatting.formatDate(response.body[0]["sold_date"], "yyyy-mm-dd")).toBe("2022-01-11");
                expect(response.body[0]["staff_id"]).toBe(1);
                expect(response.body[0]["commission"]).toBe(200.00);

                expect(response.body[1]["sale_id"]).toBe(2);
                expect(response.body[1]["vin"]).toBe("SAJAV134XGC444054");
                expect(response.body[1]["sticker_price"]).toBe(23000.00);
                expect(formatting.formatDate(response.body[1]["listing_date"], "yyyy-mm-dd")).toBe("2021-11-22");
                expect(formatting.formatDate(response.body[1]["sold_date"], "yyyy-mm-dd")).toBe("2022-04-11");
                expect(response.body[1]["staff_id"]).toBe(2);
                expect(response.body[1]["commission"]).toBe(175.25);
            });
    });

    test("GET /sales/:sale_id", async () => {
        await supertest(app).get("/sales/1")
            .expect(200)
            .then((response) => {
                expect(response.body["sale_id"]).toBe(1);
                expect(response.body["vin"]).toBe("3C6JD7AT0CG237427");
                expect(response.body["sticker_price"]).toBe(17500.00);
                expect(formatting.formatDate(response.body["listing_date"], "yyyy-mm-dd")).toBe("2021-12-17");
                expect(formatting.formatDate(response.body["sold_date"], "yyyy-mm-dd")).toBe("2022-01-11");
                expect(response.body["staff_id"]).toBe(1);
                expect(response.body["commission"]).toBe(200.00);
            });
    });

    test("POST /sales/", async () => {
        const newsale = {
            "vin": "5TDKK3DC8FS542719",
            "sticker_price": 20000.00,
            "listing_date": "2021-11-15",
            "sold_date": "2022-02-09",
            "staff_id": 2,
            "commission": 300.00
        }

        await supertest(app).post("/sales")
            .send(newsale)
            .expect(200)
            .then((response) => {
                expect(response.body["sale_id"]).toBe(3);
                expect(response.body["vin"]).toBe(newsale["vin"]);
                expect(response.body["sticker_price"]).toBe(newsale["sticker_price"]);
                expect(formatting.formatDate(response.body["listing_date"], "yyyy-mm-dd")).toBe(newsale["listing_date"]);
                expect(formatting.formatDate(response.body["sold_date"], "yyyy-mm-dd")).toBe(newsale["sold_date"]);
                expect(response.body["staff_id"]).toBe(newsale["staff_id"]);
                expect(response.body["commission"]).toBe(newsale["commission"]);
            });
    });

    test("PATCH /sales/:sale_id", async () => {
        const newsaleDetails = {
            "vin": "3C6JD7AT0CG237427",
            "sticker_price": 17123.45,
            "listing_date": "2021-09-19",
            "sold_date": "2022-01-31",
            "staff_id": 1,
            "commission": 151.35        
        }

        await supertest(app).patch("/sales/1")
            .send(newsaleDetails)
            .expect(200)
            .then((response) => {
                expect(response.body["sale_id"]).toBe(1);
                expect(response.body["vin"]).toBe(newsaleDetails["vin"]);
                expect(response.body["sticker_price"]).toBe(newsaleDetails["sticker_price"]);
                expect(formatting.formatDate(response.body["listing_date"], "yyyy-mm-dd")).toBe(newsaleDetails["listing_date"]);
                expect(formatting.formatDate(response.body["sold_date"], "yyyy-mm-dd")).toBe(newsaleDetails["sold_date"]);
                expect(response.body["staff_id"]).toBe(newsaleDetails["staff_id"]);
                expect(response.body["commission"]).toBe(newsaleDetails["commission"]);
            });
    });

    test("DELETE /sales/:sale_id", async () => {
        const sale_id = 1;
        const saleToDelete = await pool.query(
            `SELECT * FROM sales 
            WHERE sale_id = ${sale_id}`);

        await supertest(app).delete(`/sales/${sale_id}`)
            .expect(200)
            .then((response) => {
                expect(response.body["sale_id"]).toBe(1);
                expect(response.body["vin"]).toBe(saleToDelete.rows[0]["vin"]);
                expect(response.body["sticker_price"]).toBe(saleToDelete.rows[0]["sticker_price_cents"] / 100);
                expect(formatting.formatDate(response.body["listing_date"], "yyyy-mm-dd")).toBe(formatting.formatDate(saleToDelete.rows[0]["listing_date"], "yyyy-mm-dd"));
                expect(formatting.formatDate(response.body["sold_date"], "yyyy-mm-dd")).toBe(formatting.formatDate(saleToDelete.rows[0]["sold_date"], "yyyy-mm-dd"));
                expect(response.body["staff_id"]).toBe(saleToDelete.rows[0]["staff_id"]);
                expect(response.body["commission"]).toBe(saleToDelete.rows[0]["commission_cents"] / 100);
            });
    });
}