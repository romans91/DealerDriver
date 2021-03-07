import app from "../../index.js";
import supertest from "supertest";

export const vehicleManufacturersTests = () => {
    test("GET /vehicle_manufacturers", async () => {
        await supertest(app).get("/vehicle_manufacturers")
            .expect(200)
            .then((response) => {
                expect(response.body[0]["name"]).toBe("Zero Motorcycles");
                expect(response.body[0]["country_of_origin"]).toBe("USA");

                expect(response.body[1]["name"]).toBe("Bugatti");
                expect(response.body[1]["country_of_origin"]).toBe("France");
            });
    });

    test("GET /vehicle_manufacturers/:name", async () => {
        await supertest(app).get("/vehicle_manufacturers/Toyota")
            .expect(200)
            .then((response) => {
                expect(response.body["name"]).toBe("Toyota");
                expect(response.body["country_of_origin"]).toBe("Japan");
            });
    });

    test("POST /vehicle_manufacturers/", async () => {
        const newManufacturer = {
            "name": "MyCompany",
            "country_of_origin": "Australia"
        }

        await supertest(app).post("/vehicle_manufacturers")
            .send(newManufacturer)
            .expect(200)
            .then((response) => {
                expect(response.body["name"]).toBe(newManufacturer["name"]);
                expect(response.body["country_of_origin"]).toBe(newManufacturer["country_of_origin"]);
            });
    });
}