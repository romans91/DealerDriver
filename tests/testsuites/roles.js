import app from "../../index.js";
import supertest from "supertest";
import pool from "../../db.js";

export const rolesTests = () => {

    beforeEach(async () => {
        await pool.query(
            `INSERT INTO roles(title, base_hourly_rate_cents)
            VALUES ('Manager', 2500), ('Sales Agent', 2125)`);
    });

    afterEach(async () => {
        await pool.query(
            `TRUNCATE roles RESTART IDENTITY CASCADE`);
    });

    test("GET /roles", async () => {
        await supertest(app).get("/roles")
            .expect(200)
            .then((response) => {
                expect(response.body[0]["role_id"]).toBe(1);
                expect(response.body[0]["title"]).toBe("Manager");
                expect(response.body[0]["base_hourly_rate"]).toBe(25.00);

                expect(response.body[1]["role_id"]).toBe(2);
                expect(response.body[1]["title"]).toBe("Sales Agent");
                expect(response.body[1]["base_hourly_rate"]).toBe(21.25);
            });
    });

    test("GET /roles/:role_id", async () => {
        await supertest(app).get("/roles/1")
            .expect(200)
            .then((response) => {
                expect(response.body["role_id"]).toBe(1);
                expect(response.body["title"]).toBe("Manager");
                expect(response.body["base_hourly_rate"]).toBe(25.00);
            });
    });

    test("POST /roles/", async () => {
        const newRole = {
            "title": "Parts Manager",
            "base_hourly_rate": 23.00
        }

        await supertest(app).post("/roles")
            .send(newRole)
            .expect(200)
            .then((response) => {
                expect(response.body["role_id"]).toBe(3);
                expect(response.body["title"]).toBe("Parts Manager");
                expect(response.body["base_hourly_rate"]).toBe(23.00);
            });
    });

    test("PATCH /roles/:role_id", async () => {
        const newRoleDetails = {
            "title": "Reg. Manager"
        }

        await supertest(app).patch("/roles/1")
            .send(newRoleDetails)
            .expect(200)
            .then((response) => {
                expect(response.body["role_id"]).toBe(1);
                expect(response.body["title"]).toBe("Reg. Manager");
                expect(response.body["base_hourly_rate"]).toBe(25.00);
            });
    });

    test("DELETE /roles/:role_id", async () => {
        const role_id = 1;
        const roleToDelete = await pool.query(
            `SELECT * FROM roles 
            WHERE role_id = ${role_id}`);

        await supertest(app).delete(`/roles/${role_id}`)
            .expect(200)
            .then((response) => {
                expect(response.body["role_id"]).toBe(roleToDelete.rows[0]["role_id"]);
                expect(response.body["title"]).toBe(roleToDelete.rows[0]["title"]);
                expect(response.body["base_hourly_rate"]).toBe(roleToDelete.rows[0]["base_hourly_rate_cents"] / 100);
            });
    });
}