import express from "express";
import Branches from "../models/branches.js"

const router = express.Router();

/**
 * @swagger
 * /branches:
 *  get:
 *      summary: Get all branches.
 *      tags:
 *        - Branches
 *      responses:
 *          200:
 *              description: Successfully retrieved all branches.
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/Branch'
 */
router.get("/", async (req, res) => {
    res.json(await Branches.getAll());
});

/**
 * @swagger
 * /branches/{branch_id}:
 *  get:
 *      summary: Get a single branch.
 *      tags:
 *        - Branches
 *      parameters:
 *        - in: path
 *          name: branch_id
 *          description: Numeric ID of the branch to retrieve.
 *          schema:
 *              type: integer
 *              example: 1 
 *      responses:
 *          200:
 *              description: Successfully retrieved branch.
 *              schema:
 *                  $ref: '#/definitions/Branch'
 */
router.get("/:branch_id", async (req, res) => {
    const { branch_id } = req.params;
    res.json(await Branches.getById(branch_id));
});

/**
 * @swagger
 * /branches:
 *  post:
 *      summary: Add a new branch to this dealership.
 *      tags:
 *        - Branches
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: Branch
 *          description: Properties of the new branch. 
 *          schema:
 *              type: object
 *              required:
 *                - branch_name
 *                - phone
 *                - address
 *              properties:
 *                  branch_name:
 *                      type: string
 *                      example: "Portland"
 *                  phone: 
 *                      type: string
 *                      example: "361-643-7052"
 *                  address:
 *                      type: string
 *                      example: "2632 White Avenue, Portland, TX"
 *                  vehicle_capacity:
 *                      type: integer
 *                      example: 35
 *      responses:
 *          200:
 *              description: Successfully created branch.
 *              schema:
 *                  $ref: '#/definitions/Branch'
 */
router.post("/", async (req, res) => {
    const { branch_name, phone, address, vehicle_capacity } = req.body;
    res.json(await Branches.create(branch_name, phone, address, vehicle_capacity));
});

/**
 * @swagger
 * /branches/{branch_id}:
 *  patch:
 *      summary: Update the details of an existing branch.
 *      tags:
 *        - Branches
 *      parameters:
 *        - in: path
 *          name: branch_id
 *          description: Numeric ID of the branch to edit.
 *          schema:
 *              type: integer
 *              example: 1 
 *        - in: body
 *          name: Branch
 *          description: Provides any of the columns that we wish to edit. Columns must exist in the "Branch" model.
 *          schema:
 *              type: object
 *              properties:
 *                  branch_name:
 *                      type: string(20)
 *                      example: "Onalaska"
 *                  phone: 
 *                      type: string(16)
 *                      example: "308-525-4197"
 *                  address:
 *                      type: string(255)
 *                      example: "2094 Kyle Street, Onalaska, TX"
 *                  vehicle_capacity:
 *                      type: integer
 *                      example: 45
 *      responses:
 *          200:
 *              description: Successsfully edited branch.
 *              schema:
 *                  $ref: '#/definitions/Branch'
 */
router.patch("/:branch_id", async (req, res) => {
    const { branch_id } = req.params;

    res.json(await Branches.update(branch_id, req.body));
});

/**
 * @swagger
 * /branches/{branch_id}:
 *  delete:
 *      summary: Delete a single branch.
 *      description: Branch must not contain any vehicles in its inventory.
 *      tags:
 *        - Branches
 *      parameters:
 *        - in: path
 *          name: branch_id
 *          description: Numeric ID of the branch to delete.
 *          schema:
 *              type: integer
 *              example: 3 
 *      responses:
 *          200:
 *              description: Successfully deleted branch.
 *              schema:
 *                  $ref: '#/definitions/Branch'
 */
router.delete("/:branch_id", async (req, res) => {
    const { branch_id } = req.params;
    res.json(await Branches.delete(branch_id));
});

export default router;