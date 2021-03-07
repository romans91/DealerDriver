import express from "express";
import VehicleManufacturers from "../models/vehicle-manufacturers.js";

const router = express.Router();

/**
 * @swagger
 * /vehicle_manufacturers:
 *  get:
 *      summary: Get all vehicle manufacturers.
 *      tags:
 *        - Vehicle Manufacturers
 *      responses:
 *          200:
 *              description: Successfully retrieved all vehicle manufacturers.
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/VehicleManufacturer'
 */
router.get("/", async (req, res) => {
    res.json(await VehicleManufacturers.getAll());
});

/**
 * @swagger
 * /vehicle_manufacturers/{name}:
 *  get:
 *      summary: Get a vehicle manufacturer.
 *      tags:
 *        - Vehicle Manufacturers
 *      parameters:
 *        - in: path
 *          name: Vehicle manufacturer name
 *          description: Identifying name of the vehicle manufacturer to retrieve.
 *          schema:
 *              type: string(64)
 *              example: Honda 
 *      responses:
 *          200:
 *              description: Successfully retrieved vehicle manufacturer.
 *              schema:
 *                  $ref: '#/definitions/VehicleManufacturer'
 */
router.get("/:name", async (req, res) => {
    const { name } = req.params;
    res.json(await VehicleManufacturers.getById(name));
});

/**
 * @swagger
 * /vehicle_manufacturers:
 *  post:
 *      summary: Create a vehicle manufacturer.
 *      tags:
 *        - Vehicle Manufacturers
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: Vehicle Manufacturer
 *          description: Properties of the new vehicle manufacturer. 
 *          schema:
 *              type: object
 *              required:
 *                - name
 *                - country_of_origin
 *              properties:
 *                  name:
 *                      type: string(64)
 *                      example: "TVR"
 *                  country_of_origin: 
 *                      type: string(64)
 *                      example: "UK"
 *      responses:
 *          200:
 *              description: Successfully created vehicle manufacturer.
 *              schema:
 *                  $ref: '#/definitions/VehicleManufacturer'
 */
router.post("/", async (req, res) => {
    const { name, country_of_origin } = req.body;
    res.json(await VehicleManufacturers.register(name, country_of_origin));
});

export default router;