import express from "express";
import VinParse from "../models/vin-parse.js"

const router = express.Router();

/**
 * @swagger
 * /vin_parse/{vin}:
 *  get:
 *      summary: Get vehicle details for a VIN number.
 *      tags:
 *        - Vin Parsing
 *      parameters:
 *        - in: path
 *          name: vin
 *          description: Numeric ID of the vehicle to retrieve.
 *          schema:
 *              type: string(17)
 *              example: 1FDKF37G6VEB89402
 *      responses:
 *          200:
 *              description: Successfully parsed VIN number.
 *              schema:
 *                  year:
 *                      type: integer
 *                      example: 2001
 *                  manufacturer:
 *                      type: string
 *                      example: "Ford"
 *                  model_details:
 *                      type: string
 *                      example: "ZU67E"
 */
router.get("/:vin", async (req, res) => {
    const { vin } = req.params;
    res.json(await VinParse.get(vin));
});

/**
 * @swagger
 * /vin_parse:
 *  post:
 *      summary: Register a WMI to an vehicle manufacturer.
 *      consumes:
 *        - application/json
 *      tags:
 *        - Vin Parsing
 *      parameters:
 *        - in: body
 *          name: WMI registration
 *          description: A WMI code taken from the first three digits of a VIN number and its corresponding vehicle manufacturer. 
 *          schema:
 *              type: object
 *              required:
 *                - code
 *                - manufacturer_name
 *              properties:
 *                  code: 
 *                      type: string(3)
 *                      example: "JN1"
 *                  manufacturer_name:
 *                      type: string(16)
 *                      example: "Nissan"
 *      responses:
 *          200:
 *              description: Successfully registered WMI to manufacturer.
 *              schema:
 *                  wmi: 
 *                      type: string(3)
 *                      example: "1FD"
 *                  manufacturer_name:
 *                      type: string(16)
 *                      example: "Ford"
 *                  
 */
router.post("/", async (req, res) => {
    const { code, manufacturer_name } = req.body;
    res.json(await VinParse.registerWmi(code, manufacturer_name));
});

export default router;