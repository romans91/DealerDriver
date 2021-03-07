import express from "express";
import Sales from "../models/Sales.js"

const router = express.Router();

/**
 * @swagger
 * /sales:
 *  get:
 *      summary: Get all sales.
 *      tags: 
 *        - Sales
 *      responses:
 *          200:
 *              description: Successfully retrieved all sales.
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/Sale'
 */
router.get("/", async (req, res) => {
    res.json(await Sales.getAll());
});

/**
 * @swagger
 * /sales/{sale_id}:
 *  get:
 *      summary: Get a sale.
 *      tags: 
 *        - Sales
 *      parameters:
 *        - in: path
 *          name: sale_id
 *          description: Numeric ID of the sale to retrieve.
 *          schema:
 *              type: integer
 *              example: 1 
 *      responses:
 *          200:
 *              description: Successfully retrieved sale.
 *              schema:
 *                  $ref: '#/definitions/Sale'
 */
router.get("/:sale_id", async (req, res) => {
    const { sale_id } = req.params;
    res.json(await Sales.getById(sale_id));
});

/**
 * @swagger
 * /sales:
 *  post:
 *      summary: Create a sale.
 *      tags: 
 *        - Sales
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: Sale
 *          description: Properties of the new sale. 
 *          schema:
 *              type: object
 *              properties:
 *                  vin:
 *                      type: string(17)
 *                      example: "SAJDA03N42FM40889"
 *                  sticker_price:
 *                      type: decimal
 *                      example: 10999.99
 *                  listing_date:
 *                      type: date
 *                      example: "2021-12-08"
 *                  sold_date:
 *                      type: date
 *                      example: "2022-01-01"
 *                  staff_id:
 *                      type: integer
 *                      example: 1
 *                  commission:
 *                      type: decimal
 *                      example: 277.84
 *      responses:
 *          200:
 *              description: Successfully created sale.
 *              schema:
 *                  $ref: '#/definitions/Sale'
 */
router.post("/", async (req, res) => {
    const { vin, sticker_price, listing_date, sold_date, staff_id, commission } = req.body;
    res.json(await Sales.create(vin, sticker_price, listing_date, sold_date, staff_id, commission));
});

/**
 * @swagger
 * /sales/{sale_id}:
 *  patch:
 *      summary: Apply new values to columns of a sale.
 *      tags: 
 *        - Sales
 *      parameters:
 *        - in: path
 *          name: sale_id
 *          description: Numeric ID of the sale to edit.
 *          schema:
 *              type: integer
 *              example: 1 
 *        - in: body
 *          name: Sale
 *          description: Optional columns of the sale, which we intend to edit. 
 *          schema:
 *              type: object
 *              properties:
 *                  vin:
 *                      type: string(17)
 *                      example: "SAJDA03N42FM40889"
 *                  sticker_price:
 *                      type: decimal
 *                      example: 7599.99
 *                  listing_date:
 *                      type: date
 *                      example: "2021-11-27"
 *                  sold_date:
 *                      type: date
 *                      example: "2021-12-29"
 *                  staff_id:
 *                      type: integer
 *                      example: 2
 *                  commission:
 *                      type: decimal
 *                      example: 270.00
 *      responses:
 *          200:
 *              description: Successsfully edited sale.
 *              schema:
 *                  $ref: '#/definitions/Sale'
 */
router.patch("/:sale_id", async (req, res) => {
    const { sale_id } = req.params;
    res.json(await Sales.update(sale_id, req.body));
});

/**
 * @swagger
 * /sales/{sale_id}:
 *  delete:
 *      summary: Delete a single sale.
 *      description: Cannot delete a sale if there is a finance for it.
 *      tags: 
 *        - Sales
 *      parameters:
 *        - in: path
 *          name: sale_id
 *          description: Numeric ID of the sale to delete.
 *          schema:
 *              type: integer
 *              example: 1 
 *      responses:
 *          200:
 *              description: Successfully deleted sale.
 *              schema:
 *                  $ref: '#/definitions/Sale'
 */
router.delete("/:sale_id", async (req, res) => {
    const { sale_id } = req.params;
    res.json(await Sales.delete(sale_id));
});

export default router;