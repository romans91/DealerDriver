import app from "../../index.js";
import supertest from "supertest";
import pool from "../../db.js";

export const vehiclesTests = () => {

    beforeEach(async () => {
        await pool.query(
            `INSERT INTO vehicles(vin, year, make, model, model_specifics, colour, mileage, body_style, transmission, engine, acquisition_price_cents)
            VALUES ('3C6JD7AT0CG237427', 2015, 'Honda', 'Fit', 'Modified', 'White', 123445, '5 Door', 'Automatic', 'ICE', 1599999), 
            ('SAJAV134XGC444054', 2013, 'Mercedes-Benz', 'C200', '', 'White', 21290, 'Estate', 'Automatic', 'ICE', 3177599),
            ('5TDKK3DC8FS542719', 2010, 'Nissan', 'X-Trail', 'Sound System', 'Black', 53099,'SUV', 'Automatic', 'ICE', 1250000)`);
    });

    afterEach(async () => {
        await pool.query(
            `TRUNCATE vehicles RESTART IDENTITY CASCADE`);
    });

    test("GET /vehicles", async () => {
        await supertest(app).get("/vehicles")
            .expect(200)
            .then((response) => {
                expect(response.body[0]["vin"]).toBe("3C6JD7AT0CG237427");
                expect(response.body[0]["year"]).toBe(2015);
                expect(response.body[0]["make"]).toBe("Honda");
                expect(response.body[0]["model"]).toBe("Fit");
                expect(response.body[0]["model_specifics"]).toBe("Modified");
                expect(response.body[0]["colour"]).toBe("White");
                expect(response.body[0]["mileage"]).toBe(123445);
                expect(response.body[0]["body_style"]).toBe("5 Door");
                expect(response.body[0]["transmission"]).toBe("Automatic");
                expect(response.body[0]["engine"]).toBe("ICE");
                expect(response.body[0]["acquisition_price"]).toBe(15999.99);

                expect(response.body[1]["vin"]).toBe("SAJAV134XGC444054");
                expect(response.body[1]["year"]).toBe(2013);
                expect(response.body[1]["make"]).toBe("Mercedes-Benz");
                expect(response.body[1]["model"]).toBe("C200");
                expect(response.body[1]["model_specifics"]).toBe("");
                expect(response.body[1]["colour"]).toBe("White");
                expect(response.body[1]["mileage"]).toBe(21290);
                expect(response.body[1]["body_style"]).toBe("Estate");
                expect(response.body[1]["transmission"]).toBe("Automatic");
                expect(response.body[1]["engine"]).toBe("ICE");
                expect(response.body[1]["acquisition_price"]).toBe(31775.99);

                expect(response.body[2]["vin"]).toBe("5TDKK3DC8FS542719");
                expect(response.body[2]["year"]).toBe(2010);
                expect(response.body[2]["make"]).toBe("Nissan");
                expect(response.body[2]["model"]).toBe("X-Trail");
                expect(response.body[2]["model_specifics"]).toBe("Sound System");
                expect(response.body[2]["colour"]).toBe("Black");
                expect(response.body[2]["mileage"]).toBe(53099);
                expect(response.body[2]["body_style"]).toBe("SUV");
                expect(response.body[2]["transmission"]).toBe("Automatic");
                expect(response.body[2]["engine"]).toBe("ICE");
                expect(response.body[2]["acquisition_price"]).toBe(12500.00);
            });
    });

    test("GET /vehicles/:vin", async () => {
        await supertest(app).get("/vehicles/5TDKK3DC8FS542719")
            .expect(200)
            .then((response) => {
                expect(response.body["vin"]).toBe("5TDKK3DC8FS542719");
                expect(response.body["year"]).toBe(2010);
                expect(response.body["make"]).toBe("Nissan");
                expect(response.body["model"]).toBe("X-Trail");
                expect(response.body["model_specifics"]).toBe("Sound System");
                expect(response.body["colour"]).toBe("Black");
                expect(response.body["mileage"]).toBe(53099);
                expect(response.body["body_style"]).toBe("SUV");
                expect(response.body["transmission"]).toBe("Automatic");
                expect(response.body["engine"]).toBe("ICE");
                expect(response.body["acquisition_price"]).toBe(12500.00);
            });
    });

    test("POST /vehicles/", async () => {
        const newvehicle = {
            "vin": "5N1AR18U45C720748",
            "year": 2005,
            "make": "Nissan",
            "model": "Pathfinder",
            "model_specifics": "Towbar",
            "colour": "Blue",
            "mileage": 111111,
            "body_style": "Compact SUV",
            "transmission": "Automatic",
            "engine": "4.0L Petrol",
            "acquisition_price": 10000.00
        }

        await supertest(app).post("/vehicles")
            .send(newvehicle)
            .expect(200)
            .then((response) => {
                expect(response.body["vin"]).toBe(newvehicle["vin"]);
                expect(response.body["year"]).toBe(newvehicle["year"]);
                expect(response.body["make"]).toBe(newvehicle["make"]);
                expect(response.body["model"]).toBe(newvehicle["model"]);
                expect(response.body["model_specifics"]).toBe(newvehicle["model_specifics"]);
                expect(response.body["colour"]).toBe(newvehicle["colour"]);
                expect(response.body["mileage"]).toBe(newvehicle["mileage"]);
                expect(response.body["body_style"]).toBe(newvehicle["body_style"]);
                expect(response.body["transmission"]).toBe(newvehicle["transmission"]);
                expect(response.body["engine"]).toBe(newvehicle["engine"]);
                expect(response.body["acquisition_price"])
                .toBe(newvehicle["acquisition_price"]);
            });
    });

    test("POST /vehicles/:vin", async () => {
        await supertest(app).post("/vehicles/2HGES25782H522876")
        .expect(200)
        .then((response) => {
            expect(response.body["vin"]).toBe("2HGES25782H522876");
            expect(response.body["year"]).toBe(2002);
            expect(response.body["make"]).toBe("Honda");
            expect(response.body["model"]).toBe("ES257");
            expect(response.body["model_specifics"]).toBe(null);
            expect(response.body["colour"]).toBe(null);
            expect(response.body["mileage"]).toBe(null);
            expect(response.body["body_style"]).toBe(null);
            expect(response.body["transmission"]).toBe(null);
            expect(response.body["engine"]).toBe(null);
            expect(response.body["acquisition_price"]).toBe(null);
        });
    });

    test("PATCH /vehicles/:vin", async () => {
        const newvehicleDetails = {
            "vin": "SAJAV134XGC444054",
            "year": 2011,
            "make": "BMW",
            "model": "320i",
            "model_specifics": "Turbo",
            "colour": "Red",
            "mileage": 43222,
            "body_style": "Sedan",
            "transmission": "Automatic",
            "engine": "2.0L Petrol",
            "acquisition_price": 16000.00
        }

        await supertest(app).patch("/vehicles/SAJAV134XGC444054")
            .send(newvehicleDetails)
            .expect(200)
            .then((response) => {
                expect(response.body["vin"]).toBe(newvehicleDetails["vin"]);
                expect(response.body["year"]).toBe(newvehicleDetails["year"]);
                expect(response.body["make"]).toBe(newvehicleDetails["make"]);
                expect(response.body["model"]).toBe(newvehicleDetails["model"]);
                expect(response.body["model_specifics"]).toBe(newvehicleDetails["model_specifics"]);
                expect(response.body["colour"]).toBe(newvehicleDetails["colour"]);
                expect(response.body["mileage"]).toBe(newvehicleDetails["mileage"]);
                expect(response.body["body_style"]).toBe(newvehicleDetails["body_style"]);
                expect(response.body["transmission"]).toBe(newvehicleDetails["transmission"]);
                expect(response.body["engine"]).toBe(newvehicleDetails["engine"]);
                expect(response.body["acquisition_price"])
                .toBe(newvehicleDetails["acquisition_price"]);
            });
    });

    test("DELETE /vehicles/:vin", async () => {
        const vin = "3C6JD7AT0CG237427";
        const vehicleToDelete = await pool.query(
            `SELECT * FROM vehicles 
            WHERE vin = '${vin}'`);

        await supertest(app).delete(`/vehicles/${vin}`)
            .expect(200)
            .then((response) => {
                expect(response.body["vin"]).toBe(vehicleToDelete.rows[0]["vin"]);
                expect(response.body["year"]).toBe(vehicleToDelete.rows[0]["year"]);
                expect(response.body["make"]).toBe(vehicleToDelete.rows[0]["make"]);
                expect(response.body["model"]).toBe(vehicleToDelete.rows[0]["model"]);
                expect(response.body["model_specifics"]).toBe(vehicleToDelete.rows[0]["model_specifics"]);
                expect(response.body["colour"]).toBe(vehicleToDelete.rows[0]["colour"]);
                expect(response.body["mileage"]).toBe(vehicleToDelete.rows[0]["mileage"]);
                expect(response.body["body_style"]).toBe(vehicleToDelete.rows[0]["body_style"]);
                expect(response.body["transmission"]).toBe(vehicleToDelete.rows[0]["transmission"]);
                expect(response.body["engine"]).toBe(vehicleToDelete.rows[0]["engine"]);
                expect(response.body["acquisition_price"]).toBe(vehicleToDelete.rows[0]["acquisition_price_cents"] / 100);
            });
    });
}
