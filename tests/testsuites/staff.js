import app from "../../index.js";
import supertest from "supertest";
import pool from "../../db.js";

export const staffTests = () => {

    beforeEach(async () => {
        await pool.query(
            `INSERT INTO branches(branch_name, phone, address, vehicle_capacity) 
            VALUES('Colorado', '12345666', '365 Orange Ave. Pueblo, CO 81001', 50), 
            ('Camden', '7644333', '805 Sugar Lane Camden, NJ 08105', 50)`);

        await pool.query(
            `INSERT INTO roles(title, base_hourly_rate_cents)
            VALUES ('Manager', 25.00), ('Sales Agent', 21.25)`);

        await pool.query(
            `INSERT INTO staff(role_id, branch_id, fullname, phone, email, address, city, postal_code)
            VALUES (1, 1, 'Yi Chilcott', '001943433', 'yiC@gmail.com', '1589 Davis Place', 'Lehigh Acres', 'FL'), 
            (2, 1, 'Mark McMullen', '001483234', 'markM@live.com', '143 Lawman Avenue', 'Arlington', 'VA'),
            (2, 2, 'James Whitehead', '004392834', 'jamesW@gmail.com', '2939 Clinton Street', 'Philadelphia', 'PA')`);
    });

    afterEach(async () => {
        await pool.query(
            `TRUNCATE branches RESTART IDENTITY CASCADE`);

        await pool.query(
            `TRUNCATE roles RESTART IDENTITY CASCADE`);
    });

    test("GET /staff", async () => {
        await supertest(app).get("/staff")
            .expect(200)
            .then((response) => {
                expect(response.body[0]["staff_id"]).toBe(1);
                expect(response.body[0]["role_id"]).toBe(1);
                expect(response.body[0]["branch_id"]).toBe(1);
                expect(response.body[0]["fullname"]).toBe("Yi Chilcott");
                expect(response.body[0]["phone"]).toBe("001943433");
                expect(response.body[0]["email"]).toBe("yiC@gmail.com");
                expect(response.body[0]["address"]).toBe("1589 Davis Place");
                expect(response.body[0]["city"]).toBe("Lehigh Acres");
                expect(response.body[0]["postal_code"]).toBe("FL");

                expect(response.body[1]["staff_id"]).toBe(2);
                expect(response.body[1]["role_id"]).toBe(2);
                expect(response.body[1]["branch_id"]).toBe(1);
                expect(response.body[1]["fullname"]).toBe("Mark McMullen");
                expect(response.body[1]["phone"]).toBe("001483234");
                expect(response.body[1]["email"]).toBe("markM@live.com");
                expect(response.body[1]["address"]).toBe("143 Lawman Avenue");
                expect(response.body[1]["city"]).toBe("Arlington");
                expect(response.body[1]["postal_code"]).toBe("VA");

                expect(response.body[2]["staff_id"]).toBe(3);
                expect(response.body[2]["role_id"]).toBe(2);
                expect(response.body[2]["branch_id"]).toBe(2);
                expect(response.body[2]["fullname"]).toBe("James Whitehead");
                expect(response.body[2]["phone"]).toBe("004392834");
                expect(response.body[2]["email"]).toBe("jamesW@gmail.com");
                expect(response.body[2]["address"]).toBe("2939 Clinton Street");
                expect(response.body[2]["city"]).toBe("Philadelphia");
                expect(response.body[2]["postal_code"]).toBe("PA");
            });
    });

    test("GET /staff/:staff_id", async () => {
        await supertest(app).get("/staff/1")
            .expect(200)
            .then((response) => {
                expect(response.body["staff_id"]).toBe(1);
                expect(response.body["role_id"]).toBe(1);
                expect(response.body["branch_id"]).toBe(1);
                expect(response.body["fullname"]).toBe("Yi Chilcott");
                expect(response.body["phone"]).toBe("001943433");
                expect(response.body["email"]).toBe("yiC@gmail.com");
                expect(response.body["address"]).toBe("1589 Davis Place");
                expect(response.body["city"]).toBe("Lehigh Acres");
                expect(response.body["postal_code"]).toBe("FL");
            });
    });

    test("POST /staff/", async () => {
        const newStaffMember = {
            "role_id": 2,
            "branch_id": 1,
            "fullname": "John Doe",
            "phone": "012345678",
            "email": "johnD@gmail.com",
            "address": "123 Main Street",
            "city": "New York",
            "postal_code": "NY"
        }

        await supertest(app).post("/staff")
            .send(newStaffMember)
            .expect(200)
            .then((response) => {
                expect(response.body["staff_id"]).toBe(4);
                expect(response.body["role_id"]).toBe(newStaffMember["role_id"]);
                expect(response.body["branch_id"]).toBe(newStaffMember["branch_id"]);
                expect(response.body["fullname"]).toBe(newStaffMember["fullname"]);
                expect(response.body["phone"]).toBe(newStaffMember["phone"]);
                expect(response.body["email"]).toBe(newStaffMember["email"]);
                expect(response.body["address"]).toBe(newStaffMember["address"]);
                expect(response.body["city"]).toBe(newStaffMember["city"]);
                expect(response.body["postal_code"]).toBe(newStaffMember["postal_code"]);
            });
    });

    test("PATCH /staff/:staff_id", async () => {
        const newStaffDetails = {
            "role_id": 2,
            "branch_id": 1,
            "fullname": "John Doe",
            "phone": "012345678",
            "email": "johnD@gmail.com",
            "address": "123 Main Street",
            "city": "New York",
            "postal_code": "NY"        
        }

        await supertest(app).patch("/staff/1")
            .send(newStaffDetails)
            .expect(200)
            .then((response) => {
                expect(response.body["staff_id"]).toBe(1);
                expect(response.body["role_id"]).toBe(newStaffDetails["role_id"]);
                expect(response.body["branch_id"]).toBe(newStaffDetails["branch_id"]);
                expect(response.body["fullname"]).toBe(newStaffDetails["fullname"]);
                expect(response.body["phone"]).toBe(newStaffDetails["phone"]);
                expect(response.body["email"]).toBe(newStaffDetails["email"]);
                expect(response.body["address"]).toBe(newStaffDetails["address"]);
                expect(response.body["city"]).toBe(newStaffDetails["city"]);
                expect(response.body["postal_code"]).toBe(newStaffDetails["postal_code"]);
            });
    });

    test("DELETE /staff/:staff_id", async () => {
        const staff_id = 1;
        const staffToDelete = await pool.query(
            `SELECT * FROM staff 
            WHERE staff_id = ${staff_id}`);

        await supertest(app).delete(`/staff/${staff_id}`)
            .expect(200)
            .then((response) => {
                expect(response.body["staff_id"]).toBe(staff_id);
                expect(response.body["role_id"]).toBe(staffToDelete.rows[0]["role_id"]);
                expect(response.body["branch_id"]).toBe(staffToDelete.rows[0]["branch_id"]);
                expect(response.body["fullname"]).toBe(staffToDelete.rows[0]["fullname"]);
                expect(response.body["phone"]).toBe(staffToDelete.rows[0]["phone"]);
                expect(response.body["email"]).toBe(staffToDelete.rows[0]["email"]);
                expect(response.body["address"]).toBe(staffToDelete.rows[0]["address"]);
                expect(response.body["city"]).toBe(staffToDelete.rows[0]["city"]);
                expect(response.body["postal_code"]).toBe(staffToDelete.rows[0]["postal_code"]);
            });
    });
}