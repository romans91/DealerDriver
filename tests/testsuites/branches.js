import app from "../../index.js";
import supertest from "supertest";
import pool from "../../db.js";

export const branchesTests = () => {
    
    beforeEach(async () => {
        await pool.query(
            `INSERT INTO branches(branch_name, phone, address, vehicle_capacity) 
            VALUES('Colorado', '12345666', '365 Orange Ave. Pueblo, CO 81001', 50), 
            ('Camden', '7644333', '805 Sugar Lane Camden, NJ 08105', 50)`);
    });

    afterEach(async () => {
        await pool.query(
            `TRUNCATE branches RESTART IDENTITY CASCADE;`);
    });

    test("GET /branches", async () => {
        await supertest(app).get("/branches")
            .expect(200)
            .then((response) => {
                expect(response.body[0]["branch_id"]).toBe(1);
                expect(response.body[0]["branch_name"]).toBe("Colorado");
                expect(response.body[0]["phone"]).toBe("12345666");
                expect(response.body[0]["address"]).toBe("365 Orange Ave. Pueblo, CO 81001");
                expect(response.body[0]["vehicle_capacity"]).toBe(50);

                expect(response.body[1]["branch_id"]).toBe(2);
                expect(response.body[1]["branch_name"]).toBe("Camden");
                expect(response.body[1]["phone"]).toBe("7644333");
                expect(response.body[1]["address"]).toBe("805 Sugar Lane Camden, NJ 08105");
                expect(response.body[1]["vehicle_capacity"]).toBe(50);
            });
    });

    test("GET /branches/:branch_id", async () => {
        await supertest(app).get("/branches/1")
            .expect(200)
            .then((response) => {
                expect(response.body["branch_id"]).toBe(1);
                expect(response.body["branch_name"]).toBe("Colorado");
                expect(response.body["phone"]).toBe("12345666");
                expect(response.body["address"]).toBe("365 Orange Ave. Pueblo, CO 81001");
                expect(response.body["vehicle_capacity"]).toBe(50);
            });
    });

    test("POST /branches/", async () => {
        const newBranch = {
            "branch_name": "Alabama",
            "phone": "1234567",
            "address": "123 abc",
            "vehicle_capacity": 25
        }

        await supertest(app).post("/branches")
            .send(newBranch).
            expect(200)
            .then((response) => {
                expect(response.body["branch_id"]).toBe(3);
                expect(response.body["branch_name"]).toBe(newBranch["branch_name"]);
                expect(response.body["phone"]).toBe(newBranch["phone"]);
                expect(response.body["address"]).toBe(newBranch["address"]);
                expect(response.body["vehicle_capacity"]).toBe(newBranch["vehicle_capacity"]);
            });
    });

    test("PATCH /branches/:branch_id", async () => {
        const newBranchDetails = {
            "branch_name": "NY"
        }

        await supertest(app).patch("/branches/1")
            .send(newBranchDetails)
            .expect(200)
            .then((response) => {
                expect(response.body["branch_id"]).toBe(1);
                expect(response.body["branch_name"]).toBe(newBranchDetails["branch_name"]);
            });
    });

    test("DELETE /branches/:branch_id", async () => {
        const branchId = 1;
        const branchToDelete = await pool.query(
            `SELECT * FROM branches 
            WHERE branch_id = ${branchId}`);

        await supertest(app).delete(`/branches/${branchId}`)
            .expect(200)
            .then((response) => {
                expect(response.body["branch_id"]).toBe(branchToDelete.rows[0]["branch_id"]);
                expect(response.body["branch_name"]).toBe(branchToDelete.rows[0]["branch_name"]);
            });
    });
}