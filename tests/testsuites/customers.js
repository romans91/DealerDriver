import app from "../../index.js";
import supertest from "supertest";
import pool from "../../db.js";

export const customersTests = () => { 
    beforeEach(async () => {
        await pool.query(
            `INSERT INTO customers(fullname, phone, email, address, city, postal_code)
            VALUES ('Ernest Winter', '7273211922', 'ernestW@gmail.com', '4886 Ashford Drive', 'Alexandria', 'VA'), 
            ('Betty Lilly', '9256254897', 'bettyL@live.com', '3975 Alexander Avenue', 'Oakley', 'CA'), 
            ('Alana Knott', '9708127586', 'alanaK@hotmail.com', '1645 Stark Hollow Road', 'Denver', 'CO'), 
            ('Robert Mui', '4797885430', 'robertM@gmail.com', '1477 Cambridge Court', 'Fort Smith', 'AR'), 
            ('Diana Carder', '7327314729', 'dianaC@gmail.com', '3669 Duke Lane', 'Bellevile', 'NJ')`);
    });

    afterEach(async () => {
        await pool.query(
            `TRUNCATE customers RESTART IDENTITY CASCADE;`);
    });

    test("GET /customers", async () => {
        await supertest(app).get("/customers")
            .expect(200)
            .then((response) => {
                expect(response.body[0]["fullname"]).toBe("Ernest Winter");
                expect(response.body[0]["phone"]).toBe("7273211922");
                expect(response.body[0]["email"]).toBe("ernestW@gmail.com");
                expect(response.body[0]["address"]).toBe("4886 Ashford Drive");
                expect(response.body[0]["city"]).toBe("Alexandria");
                expect(response.body[0]["postal_code"]).toBe("VA");

                expect(response.body[1]["fullname"]).toBe("Betty Lilly");
                expect(response.body[1]["phone"]).toBe("9256254897");
                expect(response.body[1]["email"]).toBe("bettyL@live.com");
                expect(response.body[1]["address"]).toBe("3975 Alexander Avenue");
                expect(response.body[1]["city"]).toBe("Oakley");
                expect(response.body[1]["postal_code"]).toBe("CA");
            });
    });

    test("GET /customers/:customer_id", async () => {
        await supertest(app).get("/customers/1")
            .expect(200)
            .then((response) => {
                expect(response.body["fullname"]).toBe("Ernest Winter");
                expect(response.body["phone"]).toBe("7273211922");
                expect(response.body["email"]).toBe("ernestW@gmail.com");
                expect(response.body["address"]).toBe("4886 Ashford Drive");
                expect(response.body["city"]).toBe("Alexandria");
                expect(response.body["postal_code"]).toBe("VA");
            });
    });

    test("POST /customers/", async () => {
        const newCustomer = {
            "fullname": "John Doe"
        }

        await supertest(app).post("/customers")
            .send(newCustomer)
            .expect(200)
            .then((response) => {
                expect(response.body["fullname"]).toBe(newCustomer["fullname"]);
                expect(response.body["phone"]).toBe(null);
                expect(response.body["email"]).toBe(null);
                expect(response.body["address"]).toBe(null);
                expect(response.body["city"]).toBe(null);
                expect(response.body["postal_code"]).toBe(null);
        });
    });

    test("PATCH /customers/:customer_id", async () => {
        const newCustomerDetails = {
            "fullname": "John Doe",
            "phone": "123456",
            "email": "newEmail@gmail.com",
            "address": "123 New Street",
            "city": "Casper",
            "postal_code": "WY"
        }

        await supertest(app).patch("/customers/1")
            .send(newCustomerDetails)
            .expect(200)
            .then((response) => {
                expect(response.body["fullname"]).toBe(newCustomerDetails["fullname"]);
                expect(response.body["phone"]).toBe(newCustomerDetails["phone"]);
                expect(response.body["email"]).toBe(newCustomerDetails["email"]);
                expect(response.body["address"]).toBe(newCustomerDetails["address"]);
                expect(response.body["city"]).toBe(newCustomerDetails["city"]);
                expect(response.body["postal_code"]).toBe(newCustomerDetails["postal_code"]);
            });
    });

    test("DELETE /customers/:customer_id", async () => {
        const customerId = 1;
        const customerToDelete = await pool.query(
            `SELECT * FROM customers 
            WHERE customer_id = ${customerId}`);

        await supertest(app).delete(`/customers/${customerId}`)
            .expect(200)
            .then((response) => {
                expect(response.body["fullname"]).toBe(customerToDelete.rows[0]["fullname"]);
                expect(response.body["phone"]).toBe(customerToDelete.rows[0]["phone"]);
                expect(response.body["email"]).toBe(customerToDelete.rows[0]["email"]);
                expect(response.body["address"]).toBe(customerToDelete.rows[0]["address"]);
                expect(response.body["city"]).toBe(customerToDelete.rows[0]["city"]);
                expect(response.body["postal_code"]).toBe(customerToDelete.rows[0]["postal_code"]);
            });
    });
}