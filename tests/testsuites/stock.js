import app from "../../index.js";
import supertest from "supertest";
import pool from "../../db.js";

export const stockTests = () => {

    beforeEach(async () => {
        await pool.query(
            `INSERT INTO branches(branch_name, phone, address, vehicle_capacity) 
            VALUES('Colorado', '12345666', '365 Orange Ave. Pueblo, CO 81001', 50), 
            ('Camden', '7644333', '805 Sugar Lane Camden, NJ 08105', 50)`);

        await pool.query(
            `INSERT INTO vehicles(vin, year, make, model, colour, mileage, body_style, transmission, engine, acquisition_price_cents)
            VALUES ('3C6JD7AT0CG237427', 2015, 'Honda', 'Fit', 'White', 123445, '5 Door', 'Automatic', 'ICE', 1599999), 
            ('SAJAV134XGC444054', 2013, 'Mercedes-Benz', 'C200', 'White', 21290,'Estate', 'Automatic', 'ICE', 3177599),
            ('5TDKK3DC8FS542719', 2010, 'Nissan', 'X-Trail', 'Black', 53099,'SUV', 'Automatic', 'ICE', 1250000)`);
    });

    afterEach(async () => {
        await pool.query(
            `TRUNCATE branches RESTART IDENTITY CASCADE;`);

        await pool.query(
            `TRUNCATE vehicles RESTART IDENTITY CASCADE;`);
    });

    test("PUT /stock/", async () => {
        const vehicleMovement = { 
            "vin": "5TDKK3DC8FS542719",
            "branch_id": "1"
        }

        await supertest(app).put("/stock").
        send(vehicleMovement).
        expect(200);
    });

    test("PUT /stock/ (over stock capacity error)", async () => {
        const newBranch = await pool.query(
            `INSERT INTO branches(branch_name, phone, address, vehicle_capacity) 
            VALUES('N.Y.', '009988776', '123 Main Street', 1)
            RETURNING *`);

        let vehicleMovement = { 
            "vin": "5TDKK3DC8FS542719",
            "branch_id": newBranch.rows[0]["branch_id"]
        }

        await supertest(app)
            .put("/stock")
            .send(vehicleMovement)
            .expect(200)
            .then((response) => {
                expect(response.body["vin"]).toBe(vehicleMovement["vin"]);
                expect(response.body["branch_id"]).toBe(vehicleMovement["branch_id"]);
            });;

        vehicleMovement = { 
            "vin": "SAJAV134XGC444054",
            "branch_id": newBranch.rows[0]["branch_id"]
        }

        await supertest(app)
            .put("/stock")
            .send(vehicleMovement)
            .expect(422)
            .then((response) => {
                expect(response.body["message"])
                .toBe(`Cannot move vehicle to ${newBranch.rows[0]["branch_name"]} since it is already at maximum capacity (${newBranch.rows[0]["vehicle_capacity"]} vehicles).`);
            });
    });
}