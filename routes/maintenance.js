import express from "express";
import Maintenance from "../models/maintenance.js"

const router = express.Router();

/**
 * @swagger
 * /maintenance:
 *  get:
 *      summary: Get all vehicle maintenance appointments.
 *      tags: 
 *        - Maintenance
 *      responses:
 *          200:
 *              description: Successfully retrieved all maintenance appointments.
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/Maintenance'
 */
router.get("/", async (req, res) => {
    res.json(await Maintenance.getAll());
});

/**
 * @swagger
 * /maintenance/{maintenance_id}:
 *  get:
 *      summary: Get a single vehicle maintenance appointment.
 *      tags: 
 *        - Maintenance
 *      parameters:
 *        - in: path
 *          name: maintenance_id
 *          description: Numeric ID of the maintenance appointment to retrieve.
 *          schema:
 *              type: integer
 *              example: 1 
 *      responses:
 *          200:
 *              description: Successfully retrieved maintenance.
 *              schema:
 *                  $ref: '#/definitions/Maintenance'
 */
router.get("/:maintenance_id", async (req, res) => {
    const { maintenance_id } = req.params;
    res.json(await Maintenance.getById(maintenance_id));
});

/**
 * @swagger
 * /maintenance:
 *  post:
 *      summary: Create a maintenance appointment.
 *      tags: 
 *        - Maintenance
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: Maintenance
 *          description: Properties of the new maintenance appointment. 
 *          schema:
 *              type: object
 *              properties:
 *                 vin:
 *                     type: string(17)
 *                     example: "3C63D3EL4CG137066"
 *                 description:
 *                     type: string(255)
 *                     example: "Transmission service"
 *                 commencement_date_time:
 *                     type: datetime
 *                     example: "2021-07-11T09:55:00.000Z"
 *                 completion_date_time:
 *                     type: datetime
 *                     example: "2021-07-11T15:00:00.000Z"
 *                 quote:
 *                    type: decimal
 *                    example: 625.15
 *      responses:
 *          200:
 *              description: Successfully created maintenance.
 *              schema:
 *                  $ref: '#/definitions/Maintenance'
 */
router.post("/", async (req, res) => {
    const { vin, description, commencement_date_time, completion_date_time, quote } = req.body;
    res.json(await Maintenance.create(vin, description, commencement_date_time, completion_date_time, quote));
});

/**
 * @swagger
 * /maintenance/{maintenance_id}:
 *  patch:
 *      summary: Update the details of an existing maintenance appointment.
 *      tags: 
 *        - Maintenance
 *      parameters:
 *        - in: path
 *          name: maintenance_id
 *          description: Numeric ID of the maintenance to edit.
 *          schema:
 *              type: integer
 *              example: 1 
 *        - in: body
 *          name: Maintenance
 *          description: Optional columns of the vehicle maintenance appointment, which we intend to edit. Columns must exist in the "Maintenance" model.
 *          schema:
 *              type: object
 *              properties:
 *                  vin:
 *                      type: string(17)
 *                      example: "1VWAP7A37EC006656"
 *                  description:
 *                      type: string(255)
 *                      example: "Service + Timing belt"
 *                  commencement_date_time:
 *                      type: datetime
 *                      example: "2021-06-22T03:30:00.000Z"
 *                  completion_date_time:
 *                      type: datetime
 *                      example: "2021-06-25T15:30:00.000Z"
 *                  quote:
 *                      type: decimal
 *                      example: 910.01
 *      responses:
 *          200:
 *              description: Successsfully edited maintenance.
 *              schema:
 *                  $ref: '#/definitions/Maintenance'
 */
router.patch("/:maintenance_id", async (req, res) => {
    const { maintenance_id } = req.params;
    res.json(await Maintenance.update(maintenance_id, req.body));
});

/**
 * @swagger
 * /maintenance/{maintenance_id}:
 *  delete:
 *      summary: Delete a vehicle maintenance appointment.
 *      tags: 
 *        - Maintenance
 *      parameters:
 *        - in: path
 *          name: maintenance_id
 *          description: Numeric ID of the maintenance to delete.
 *          schema:
 *              type: integer
 *              example: 1 
 *      responses:
 *          200:
 *              description: Successfully deleted maintenance.
 *              schema:
 *                  $ref: '#/definitions/Maintenance'
 */
router.delete("/:maintenance_id", async (req, res) => {
    const { maintenance_id } = req.params;
    res.json(await Maintenance.delete(maintenance_id));
});

export default router;