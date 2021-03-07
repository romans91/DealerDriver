import express from "express";
import Vehicles from "../models/vehicles.js"

const router = express.Router();

/**
 * @swagger
 * /vehicles:
 *  get:
 *      summary: Get all vehicles.
 *      tags: 
 *        - Vehicles
 *      responses:
 *              200:
 *                  description: Successfully retrieved all vehicles.
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/definitions/Vehicle'
 */
router.get("/", async (req, res) => {
    res.json(await Vehicles.getAll());
});

/**
 * @swagger
 * /vehicles/{vin}:
 *  get:
 *      summary: Get single vehicle.
 *      description: Vehicles are identified by their unique VIN number.
 *      tags: 
 *        - Vehicles
 *      parameters:
 *        - in: path
 *          name: vin
 *          description: Numeric ID of the vehicle to retrieve.
 *          schema:
 *              type: string(17)
 *              example: SAJDA03N42FM40889
 *      responses:
 *          200:
 *              description: Successfully retrieved vehicle.
 *              schema:
 *                  $ref: '#/definitions/Vehicle'
 */
router.get("/:vin", async (req, res) => {
    const { vin } = req.params;
    res.json(await Vehicles.getByVin(vin));
});

/**
 * @swagger
 * /vehicles:
 *  post:
 *      summary: Create a vehicle.
 *      description: Create a vehicle with the given details without verifying the VIN number. The "make" field must contain a vehicle manufacturer that exists in the vehicle manufacturers table.
 *      tags: 
 *        - Vehicles
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: Vehicle
 *          description: Properties of the new vehicle. 
 *          schema:
 *              type: object
 *              required:
 *                - vin
 *                - year
 *                - make
 *                - model
 *              properties:
 *                  vin:
 *                      type: string(17)
 *                      example: "1FDKF37G6VEB89402"     
 *                  year:  
 *                      type: integer
 *                      example: 2022
 *                  make:
 *                      type: string(64)
 *                      example: "Honda"
 *                  model:
 *                      type: string(32)
 *                      example: "Civic"
 *                  model_specifics:
 *                      type: string(64)
 *                      example: "Type R"
 *                  colour:
 *                      type: string(16)
 *                      example: "Black"
 *                  mileage:
 *                      type: integer
 *                      example: 123456
 *                  body_style:
 *                      type: string(16)
 *                      example: "Hatchback"
 *                  transmission:
 *                      type: string(32)
 *                      example: "Manual"
 *                  engine:
 *                      type: string(16)
 *                      example: "2.0L Gasoline"    
 *                  acquisition_price:
 *                      type: decimal
 *                      example: 21999.95
 *      responses:
 *          200:
 *              description: Successfully created vehicle.
 *              schema:
 *                  $ref: '#/definitions/Vehicle'
 */
router.post("/", async (req, res) => {
    const { vin, year, make, model, model_specifics, colour, mileage, body_style, transmission, engine, acquisition_price } = req.body;
    res.json(await Vehicles.create(vin, year, make, model, model_specifics, colour, mileage, body_style, transmission, engine, acquisition_price));
});

/**
 * @swagger
 * /vehicles/{vin}:
 *  post:
 *      summary: Create a vehicle using a VIN number.
 *      description: Create a vehicle with basic details from a VIN number. Validate the VIN number via "/vin_parse/:vin" first. VIN numbers for vehicles from 1979 or earlier are invalid. Other vehicle details will need to be manually edited afterwards.
 *      tags: 
 *        - Vehicles
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: vin
 *          description: VIN number of the vehicle to create.
 *          schema:
 *              type: string(17)
 *              example: 1FADP3E21EL168167
 *      responses:
 *          200:
 *              description: Successfully created vehicle.
 *              schema:
 *                  $ref: '#/definitions/Vehicle'
 */
router.post("/:vin", async (req, res) => {
    const { vin } = req.params;
    res.json(await Vehicles.createByVin(vin));
});

/**
 * @swagger
 * /vehicles/{vin}:
 *  patch:
 *      summary: Apply new values to columns of a vehicle.
 *      tags: 
 *        - Vehicles
 *      parameters:
 *        - in: path
 *          name: vin
 *          description: Numeric ID of the vehicle to edit.
 *          schema:
 *              type: string(17)
 *              example: SAJDA03N42FM40889
 *        - in: body
 *          name: Vehicle
 *          description: Optional columns of the vehicle, which we intend to edit. 
 *          schema:
 *              type: object
 *              properties:
 *                  year:  
 *                      type: integer
 *                      example: 2006
 *                  make:
 *                      type: string(64)
 *                      example: "Chevrolet"
 *                  model:
 *                      type: string(32)
 *                      example: "Impala"
 *                  model_specifics:
 *                      type: string(64)
 *                      example: "BOSE Sound System, manual conversion"
 *                  colour:
 *                      type: string(16)
 *                      example: "Purple Metallic"
 *                  mileage:
 *                      type: integer
 *                      example: 139528
 *                  body_style:
 *                      type: string(16)
 *                      example: "Sedan"
 *                  transmission:
 *                      type: string(32)
 *                      example: "Manual"
 *                  engine:
 *                      type: string(16)
 *                      example: "2.0L Gasoline"    
 *                  acquisition_price:
 *                      type: decimal
 *                      example: 5119.87
 *      responses:
 *          200:
 *              description: Successsfully edited vehicle.
 *              schema:
 *                  $ref: '#/definitions/Vehicle'
 */
router.patch("/:vin", async (req, res) => {
    const { vin } = req.params;
    res.json(await Vehicles.update(vin, req.body));
});

/**
 * @swagger
 * /vehicles/{vin}:
 *  delete:
 *      summary: Delete a vehicle.
 *      description: Vehicle must not be in stock, have any registered maintenance, and must never have listed.
 *      tags: 
 *        - Vehicles
 *      parameters:
 *        - in: path
 *          name: vin
 *          description: Numeric ID of the vehicle to delete.
 *          schema:
 *              type: string(17)
 *              example: 1HGCD7135TA022837
 *      responses:
 *          200:
 *              description: Successfully deleted vehicle.
 *              schema:
 *                  $ref: '#/definitions/Vehicle'
 */
router.delete("/:vin", async (req, res) => {
    const { vin } = req.params;
    res.json(await Vehicles.delete(vin));
});

export default router;