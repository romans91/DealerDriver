import app from "../../index.js";
import supertest from "supertest";

export const vinParseTests = () => {
    test("GET /vin_parse/:vin", async () => {
        await supertest(app).get("/vin_parse/2HGES25782H522876")
        .expect(200)
        .then((response) => {
            expect(response.body["year"]).toBe(2002);
            expect(response.body["manufacturer"]).toBe("Honda");
            expect(response.body["model_details"]).toBe("ES257");
        });
    });

    test("POST /vin_parse/", async () => {
        const newWmi = {
            "code": "1D7",
            "manufacturer_name": "Chrysler"
        }

        await supertest(app).post("/vin_parse")
            .send(newWmi)
            .expect(200)
            .then((response) => {
                expect(response.body["code"]).toBe(newWmi["code"]);
                expect(response.body["manufacturer_name"]).toBe(newWmi["manufacturer_name"]);
            });
    });
}