import app from "../../index.js";
import supertest from "supertest";
import pool from "../../db.js";
import formatting from '../../helpers/formatting.js';

export const maintenanceTests = () => {

    beforeEach(async () => {
        await pool.query(
            `INSERT INTO vehicles(vin, year, make, model, colour, mileage, body_style, transmission, engine, acquisition_price_cents)
            VALUES ('3C6JD7AT0CG237427', 2015, 'Honda', 'Fit', 'White', 123445, '5 Door', 'Automatic', 'ICE', 1599999), 
            ('SAJAV134XGC444054', 2013, 'Mercedes-Benz', 'C200', 'White', 21290,'Estate', 'Automatic', 'ICE', 3177599),
            ('5TDKK3DC8FS542719', 2010, 'Nissan', 'X-Trail', 'Black', 53099,'SUV', 'Automatic', 'ICE', 1250000)`);

        await pool.query(
            `INSERT INTO maintenance(vin, description, commencement_date_time, completion_date_time, quote_cents)
            VALUES('5TDKK3DC8FS542719', 'Service', '2021-06-22 15:30:00', '2021-06-24 11:00:00', 65678)`);

    });

    afterEach(async () => {
        await pool.query(
            `TRUNCATE maintenance RESTART IDENTITY CASCADE`);

        await pool.query(
            `TRUNCATE vehicles RESTART IDENTITY CASCADE`);
    });

    test("GET /maintenance", async () => {
        await supertest(app).get("/maintenance")
            .expect(200)
            .then((response) => {
                expect(response.body[0]["vin"]).toBe("5TDKK3DC8FS542719");
                expect(response.body[0]["description"]).toBe("Service");
                expect(formatting.formatDate(response.body[0]["commencement_date_time"], "yyyy-mm-dd HH:MM:ss")).toBe("2021-06-22 15:30:00");
                expect(formatting.formatDate(response.body[0]["completion_date_time"], "yyyy-mm-dd HH:MM:ss")).toBe("2021-06-24 11:00:00");
                expect(response.body[0]["quote"]).toBe(656.78);
            });
    });

    test("GET /maintenance/:maintenance_id", async () => {
        await supertest(app).get("/maintenance/1")
            .expect(200)
            .then((response) => {
                expect(response.body["maintenance_id"]).toBe(1);
                expect(response.body["vin"]).toBe("5TDKK3DC8FS542719");
                expect(response.body["description"]).toBe("Service");
                expect(formatting.formatDate(response.body["commencement_date_time"], "yyyy-mm-dd HH:MM:ss")).toBe("2021-06-22 15:30:00");
                expect(formatting.formatDate(response.body["completion_date_time"], "yyyy-mm-dd HH:MM:ss")).toBe("2021-06-24 11:00:00");
                expect(response.body["quote"]).toBe(656.78);
            });
    });

    test("POST /maintenance/", async () => {
        const newMaintenance = {
            "vin": "SAJAV134XGC444054",
            "description": "Tyre Replacement",
            "commencement_date_time": "2021-07-12 11:30:00",
            "completion_date_time": "2021-07-14 17:00:00",
            "quote": 215.25
        }

        await supertest(app).post("/maintenance")
            .send(newMaintenance)
            .expect(200)
            .then((response) => {
                expect(response.body["maintenance_id"]).toBe(2);
                expect(response.body["vin"]).toBe(newMaintenance["vin"]);
                expect(response.body["description"]).toBe(newMaintenance["description"]);
                expect(formatting.formatDate(response.body["commencement_date_time"], "yyyy-mm-dd HH:MM:ss")).toBe(newMaintenance["commencement_date_time"]);
                expect(formatting.formatDate(response.body["completion_date_time"], "yyyy-mm-dd HH:MM:ss")).toBe(newMaintenance["completion_date_time"]);
                expect(response.body["quote"]).toBe(newMaintenance["quote"]);
            });
    });

    test("PATCH /maintenance/:maintenance_id", async () => {
        const newMaintenanceDetails = {
            "vin": "SAJAV134XGC444054",
            "description": "Tyre Replacement",
            "commencement_date_time": "2021-06-22 09:20:00",
            "completion_date_time": "2021-06-25 11:00:00",
            "quote": 366.99   
        }

        await supertest(app).patch("/maintenance/1")
            .send(newMaintenanceDetails)
            .expect(200)
            .then((response) => {
                expect(response.body["maintenance_id"]).toBe(1);
                expect(response.body["vin"]).toBe(newMaintenanceDetails["vin"]);
                expect(response.body["description"]).toBe(newMaintenanceDetails["description"]);
                expect(formatting.formatDate(response.body["commencement_date_time"], "yyyy-mm-dd HH:MM:ss")).toBe(newMaintenanceDetails["commencement_date_time"]);
                expect(formatting.formatDate(response.body["completion_date_time"], "yyyy-mm-dd HH:MM:ss")).toBe(newMaintenanceDetails["completion_date_time"]);
                expect(response.body["quote"]).toBe(newMaintenanceDetails["quote"]);
            });
    });

    test("DELETE /maintenance/:maintenance_id", async () => {
        const maintenance_id = 1;
        const maintenanceToDelete = await pool.query(
            `SELECT * FROM maintenance 
            WHERE maintenance_id = ${maintenance_id}`);

        await supertest(app).delete(`/maintenance/${maintenance_id}`)
            .expect(200)
            .then((response) => {
                expect(response.body["maintenance_id"]).toBe(1);
                expect(response.body["vin"]).toBe(maintenanceToDelete.rows[0]["vin"]);
                expect(response.body["description"]).toBe(maintenanceToDelete.rows[0]["description"]);
                expect(formatting.formatDate(response.body["commencement_date_time"], "yyyy-mm-dd HH:MM:ss"))
                .toBe(formatting.formatDate(maintenanceToDelete.rows[0]["commencement_date_time"], "yyyy-mm-dd HH:MM:ss"));
                expect(formatting.formatDate(response.body["completion_date_time"], "yyyy-mm-dd HH:MM:ss"))
                .toBe(formatting.formatDate(maintenanceToDelete.rows[0]["completion_date_time"], "yyyy-mm-dd HH:MM:ss"));
                expect(response.body["quote"]).toBe(maintenanceToDelete.rows[0]["quote_cents"] / 100);
            });
    });
}