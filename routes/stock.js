import express from "express";
import Stock from "../models/stock.js"

const router = express.Router();

/**
 * @swagger
 * /stock:
 *  put:
 *      summary: Move a vehicle to a branch.
 *      description: The branch must not already be at maximum vehicle capacity.
 *      tags:
 *        - Stock
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: Stock movement
 *          description: VIN of the vehicle and the "branch_id" of the destination branch. 
 *          schema:
 *              type: object
 *              required:
 *                - vin
 *                - branch_id
 *              properties:
 *                  vin:
 *                      type: string(17)
 *                      example: "SAJDA03N42FM40889"
 *                  branch_id: 
 *                      type: integer
 *                      example: 1
 *      responses:
 *          200:
 *              description: Successfully moved vehicle to stock.
 *              schema:
 *                  $ref: '#/definitions/Stock'
 *          422:
 *              description: Stock already at maximum capacity.
 */
router.put("/", async (req, res) => {
    try {
        const { vin, branch_id } = req.body;
        res.json(await Stock.put(vin, branch_id));
    } catch (err) {
        res.status(422);
        res.json({ "message": err.message });
    }
});

export default router;