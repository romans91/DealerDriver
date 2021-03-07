import express from "express";
import Roles from "../models/roles.js"

const router = express.Router();

/**
 * @swagger
 * /roles:
 *  get:
 *      summary: Get all roles.
 *      tags: 
 *        - Roles
 *      responses:
 *          200:
 *              description: Successfully retrieved all roles.
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/Role'
 */
router.get("/", async (req, res) => {
    res.json(await Roles.getAll());
});

/**
 * @swagger
 * /roles/{role_id}:
 *  get:
 *      summary: Get a role.
 *      tags: 
 *        - Roles
 *      parameters:
 *        - in: path
 *          name: role_id
 *          description: Numeric ID of the role to retrieve.
 *          schema:
 *              type: integer
 *              example: 1 
 *      responses:
 *          200:
 *              description: Successfully retrieved role.
 *              schema:
 *                  $ref: '#/definitions/Role'
 */
router.get("/:role_id", async (req, res) => {
    const { role_id } = req.params;
    res.json(await Roles.getById(role_id));
});

/**
 * @swagger
 * /roles:
 *  post:
 *      summary: Create a role.
 *      tags: 
 *        - Roles
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: Role
 *          description: Properties of the new role. 
 *          schema:
 *              type: object
 *              required:
 *                - title
 *                - base_hourly_rate
 *              properties:
 *                  title:
 *                      type: string(15)
 *                      example: "Sales Manager"
 *                  base_hourly_rate:
 *                      type: decimal
 *                      example: 17.25
 *      responses:
 *          200:
 *              description: Successfully created role.
 *              schema:
 *                  $ref: '#/definitions/Role'
 */
router.post("/", async (req, res) => {
    const { title, base_hourly_rate } = req.body;
    res.json(await Roles.create(title, base_hourly_rate));
});

/**
 * @swagger
 * /roles/{role_id}:
 *  patch:
 *      summary: Update the details of a role.
 *      tags: 
 *        - Roles
 *      parameters:
 *        - in: path
 *          name: role_id
 *          description: Numeric ID of the role to edit.
 *          schema:
 *              type: integer
 *              example: 1 
 *        - in: body
 *          name: Role
 *          description: Optional columns of the role, which we intend to edit. Columns must exist in the "Roles" model.
 *          schema:
 *                  type: object
 *                  properties:
 *                      title:
 *                          type: string(15)
 *                          example: "Parts Manager"
 *                      base_hourly_rate:
 *                          type: decimal
 *                          example: 18.25
 *      responses:
 *          200:
 *              description: Successsfully edited role.
 *              schema:
 *                  $ref: '#/definitions/Role'
 */
router.patch("/:role_id", async (req, res) => {
    const { role_id } = req.params;
    res.json(await Roles.update(role_id, req.body));
});

/**
 * @swagger
 * /roles/{role_id}:
 *  delete:
 *      summary: Delete a single role.
 *      description: This role may not have any staff currently employed under it.
 *      tags: 
 *        - Roles
 *      parameters:
 *        - in: path
 *          name: role_id
 *          description: Numeric ID of the role to delete.
 *          schema:
 *              type: integer
 *              example: 3 
 *      responses:
 *          200:
 *              description: Successfully deleted role.
 *              schema:
 *                  $ref: '#/definitions/Role'
 */
router.delete("/:role_id", async (req, res) => {
    const { role_id } = req.params;
    res.json(await Roles.delete(role_id));
});

export default router;