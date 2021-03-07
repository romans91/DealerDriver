import express from "express";
import Staff from "../models/Staff.js"

const router = express.Router();

/**
 * @swagger
 * /staff:
 *  get:
 *      summary: Get all staff members.
 *      tags: 
 *        - Staff
 *      responses:
 *          200:
 *              description: Successfully retrieved all staff.
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/Staff'
 */
router.get("/", async (req, res) => {
    res.json(await Staff.getAll());
});

/**
 * @swagger
 * /staff/{staff_id}:
 *  get:
 *      summary: Get a staff member.
 *      tags: 
 *        - Staff
 *      parameters:
 *        - in: path
 *          name: staff_id
 *          description: Numeric ID of the staff to retrieve.
 *          schema:
 *              type: integer
 *              example: 1 
 *      responses:
 *          200:
 *              description: Successfully retrieved staff.
 *              schema:
 *                  $ref: '#/definitions/Staff'
 */
router.get("/:staff_id", async (req, res) => {
    const { staff_id } = req.params;
    res.json(await Staff.getById(staff_id));
});

/**
 * @swagger
 * /staff:
 *  post:
 *      summary: Create a staff member.
 *      tags: 
 *        - Staff
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: Staff
 *          description: Properties of the new staff member. 
 *          schema:
 *              type: object
 *              required:
 *                - fullname
 *                - phone
 *                - email
 *                - address
 *                - city
 *                - postal_code
 *              properties:
 *                  role_id:
 *                      type: integer
 *                      example: 2
 *                  branch_id:
 *                      type: integer
 *                      example: 2
 *                  fullname:
 *                      type: string(32)
 *                      example: "Charmaine Alvarez"
 *                  phone:
 *                      type: string(16)
 *                      example: "401-261-6488"
 *                  email:
 *                      type: string(32)
 *                      example: "calvarez@gmail.com"
 *                  address:
 *                      type: string(64)
 *                      example: "33 Melm Street"
 *                  city:
 *                      type: string(16)
 *                      example: "Lubbock"
 *                  postal_code:
 *                      type: string(2)
 *                      example: "TX"
 *      responses:
 *          200:
 *              description: Successfully created staff.
 *              schema:
 *                  $ref: '#/definitions/Staff'
 */
router.post("/", async (req, res) => {
    const { role_id, branch_id, fullname, phone, email, address, city, postal_code } = req.body;
    res.json(await Staff.create(role_id, branch_id, fullname, phone, email, address, city, postal_code));
});

/**
 * @swagger
 * /staff/{staff_id}:
 *  patch:
 *      summary: Update the details of a staff member.
 *      tags: 
 *        - Staff
 *      parameters:
 *        - in: path
 *          name: staff_id
 *          description: Numeric ID of the staff member to edit.
 *          schema:
 *              type: integer
 *              example: 1 
 *        - in: body
 *          name: Staff
 *          description: Optional columns of the staff, which we intend to edit. 
 *          schema:
 *              type: object
 *              properties:
 *                  role_id:
 *                      type: integer
 *                      example: 1
 *                  branch_id:
 *                      type: integer
 *                      example: 1
 *                  fullname:
 *                      type: string(32)
 *                      example: "Charmaine Robinson"
 *                  phone:
 *                      type: string(16)
 *                      example: "786-499-6046"
 *                  email:
 *                      type: string(32)
 *                      example: "CRobertson@live.com"
 *                  address:
 *                      type: string(64)
 *                      example: "182 Rinehart Road"
 *                  city:
 *                      type: string(16)
 *                      example: "Austin"
 *                  postal_code:
 *                      type: string(2)
 *                      example: "TX"
 *      responses:
 *          200:
 *              description: Successsfully edited staff.
 *              schema:
 *                  $ref: '#/definitions/Staff'
 */
router.patch("/:staff_id", async (req, res) => {
    const { staff_id } = req.params;
    res.json(await Staff.update(staff_id, req.body));
});

/**
 * @swagger
 * /staff/{staff_id}:
 *  delete:
 *      summary: Delete a single staff member.
 *      tags: 
 *        - Staff
 *      parameters:
 *        - in: path
 *          name: staff_id
 *          description: Numeric ID of the staff to delete.
 *          schema:
 *              type: integer
 *              example: 1 
 *      responses:
 *          200:
 *              description: Successfully deleted staff.
 *              schema:
 *                  $ref: '#/definitions/Staff'
 */
router.delete("/:staff_id", async (req, res) => {
    const { staff_id } = req.params;
    res.json(await Staff.delete(staff_id));
});

export default router;