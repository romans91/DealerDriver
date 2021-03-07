import express from "express";
import Finances from "../models/finances.js"

const router = express.Router();

/**
 * @swagger
 * /finances:
 *  get:
 *      summary: Get all finances.
 *      tags: 
 *        - Finances
 *      responses:
 *          200:
 *              description: Successfully retrieved all finances.
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/Finance'
 */
router.get("/", async (req, res) => {
    res.json(await Finances.getAll());
});

/**
 * @swagger
 * /finances/{sale_id}:
 *  get:
 *      summary: Get single finance.
 *      tags: 
 *        - Finances
 *      parameters:
 *        - in: path
 *          name: sale_id
 *          description: Numeric ID of the sale that the finance is registered to.
 *          schema:
 *              type: integer
 *              example: 4 
 *      responses:
 *          200:
 *              description: Successfully retrieved finance.
 *              schema:
 *                  $ref: '#/definitions/Finance'
 */
router.get("/:sale_id", async (req, res) => {
    const { sale_id } = req.params;
    res.json(await Finances.getById(sale_id));
});

/**
 * @swagger
 * /finances/periodic_payment/{sale_id}:
 *  get:
 *      summary: Get the periodic payment for a finance.
 *      description: This amount is expected to be paid a number of times per year specified by the value of the finance's "payments_per_year" column.
 *      tags: 
 *        - Finances
 *      parameters:
 *        - in: path
 *          name: sale_id
 *          description: Numeric ID of the sale that the finance is registered to.
 *          schema:
 *              type: integer
 *              example: 5 
 *      responses:
 *          200:
 *              description: Successfully retrieved periodic payment.
 *              schema:
 *                  type: object
 *                  properties:
 *                      rate: 
 *                          type: decimal
 *                          example: 158.5
 */
router.get("/periodic_payment/:sale_id", async (req, res) => {
    const { sale_id } = req.params;
    res.json(await Finances.periodicRate(sale_id));
});

/**
 * @swagger
 * /finances/expected_paid_amount/{sale_id}:
 *  post:
 *      summary: Get the amount that's expected to be paid in periodic payments by a specified date.
 *      description: If the amount that the customer has paid (excluding the down payment) is lower than the value of the "amount" key returned by their object, then this finance has overdue payments that the customer is responsible for. 
 *      tags: 
 *        - Finances
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: sale_id
 *          description: Numeric ID of the sale that the finance is registered to.
 *          schema:
 *              type: integer
 *              example: 5 
 *        - in: body
 *          name: Date
 *          description: Date by which to test overdue status of the finance. 
 *          schema:
 *              type: object
 *              required:
 *                - date
 *              properties:
 *                  date:
 *                      type: date
 *                      example: "2022-01-01"
 *      responses:
 *          200:
 *              description: Successfully retrieved expected paid amount.
 *              schema:
 *                  type: object
 *                  properties:
 *                      amount: 
 *                          type: decimal
 *                          example: 1584.97
 */
router.post("/expected_paid_amount/:sale_id", async (req, res) => {
    const { sale_id } = req.params;
    const { date } = req.body;
    res.json(await Finances.amountExpectedBy(sale_id, date));
});

/**
 * @swagger
 * /finances/overdue:
 *  post:
 *      summary: Get all overdue finances.
 *      tags: 
 *        - Finances
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: Due date
 *          description: Date by which to test overdue status of all finances. 
 *          schema:
 *              type: object
 *              required:
 *                - current_date
 *              properties:
 *                  current_date:
 *                      type: date
 *                      example: "2022-01-01"
 * 
 *      responses:
 *          200:
 *              description: Successfully retrieved all overdue finances.
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          customer_id: 
 *                              type: integer
 *                              example: 5
 *                          fullname:
 *                              type: string(32)
 *                              example: "Diana Carder"
 *                          phone:
 *                              type: string(16)
 *                              example: "330-210-0146"
 *                          email:
 *                              type: string(32)
 *                              example: "dianacarder@gmail.com"
 *                          loan:
 *                              type: decimal
 *                              example: 2995
 *                          paid_to_date:
 *                              type: decimal
 *                              example: 1150
 *                          arrears:
 *                              type: decimal
 *                              example: 371.95
 */
router.post("/overdue", async (req, res) => {
    const { current_date } = req.body;
    res.json(await Finances.getOverdue(current_date));
});

/**
 * @swagger
 * /finances:
 *  post:
 *      summary: Create a finance.
 *      tags: 
 *        - Finances
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: Finance
 *          description: Properties of the new finance. The "payments_per_year" model is limited to three values. "12" for monthly payments, "26" for fortnightly payments, and "52" for weekly payments.
 *          schema:
 *              type: object
 *              required:
 *                - sale_id
 *                - customer_id
 *                - down_payment
 *                - loan
 *                - annual_interest_rate
 *                - payments_per_year
 *                - number_of_years
 *                - commencement_date
 *                - paid_to_date
 *              properties:
 *                  sale_id:
 *                      type: integer
 *                      example: 3
 *                  customer_id:
 *                      type: integer
 *                      example: 6
 *                  down_payment:
 *                      type: decimal
 *                      example: 2000
 *                  loan:
 *                      type: decimal
 *                      example: 7995
 *                  annual_interest_rate:
 *                      type: decimal
 *                      example: 0.03
 *                  payments_per_year:
 *                      type: integer
 *                      example: 12
 *                  number_of_years:
 *                      type: integer
 *                      example: 2
 *                  commencement_date:
 *                      type: date
 *                      example: "2022-12-25"
 *                  paid_to_date:
 *                      type: decimal
 *                      example: 325.25
 *      responses:
 *          200:
 *              description: Successfully created finance.
 *              schema:
 *                  $ref: '#/definitions/Finance'
 */
router.post("/", async (req, res) => {
    const { sale_id, customer_id, down_payment, loan, annual_interest_rate, payments_per_year, number_of_years, commencement_date, paid_to_date } = req.body;
    res.json(await Finances.create(sale_id, customer_id, down_payment, loan, annual_interest_rate, payments_per_year, number_of_years, commencement_date, paid_to_date));
});

/**
 * @swagger
 * /finances/{sale_id}:
 *  patch:
 *      summary: Apply new values to columns of a finance.
 *      tags: 
 *        - Finances
 *      parameters:
 *        - in: path
 *          name: sale_id
 *          description: Numeric ID of the sale that the finance is registered to.
 *          schema:
 *              type: integer
 *              example: 4 
 *        - in: body
 *          name: Finance details
 *          description: Optional columns of the finance, which we intend to edit. Columns must exist in the "Finance" model. The "payments_per_year" model is limited to three values. "12" for monthly payments, "26" for fortnightly payments, and "52" for weekly payments.
 *          schema:
 *              type: object
 *              properties:
 *                  customer_id:
 *                      type: integer
 *                      example: 1
 *                  down_payment:
 *                      type: decimal
 *                      example: 5000.00
 *                  loan:
 *                      type: decimal
 *                      example: 1500.00
 *                  annual_interest_rate:
 *                      type: decimal
 *                      example: 0.03
 *                  payments_per_year:
 *                      type: integer
 *                      example: 52
 *                  number_of_years:
 *                      type: integer
 *                      example: 2
 *                  commencement_date:
 *                      type: date
 *                      example: "2021-12-25"
 *                  paid_to_date:
 *                      type: decimal
 *                      example: 325.25
 *      responses:
 *          200:
 *              description: Successsfully edited finance.
 *              schema:
 *                  $ref: '#/definitions/Finance'
 */
router.patch("/:sale_id", async (req, res) => {
    const { sale_id } = req.params;

    res.json(await Finances.update(sale_id, req.body));
});

/**
 * @swagger
 * /finances/{sale_id}:
 *  delete:
 *      summary: Delete a single finance.
 *      tags: 
 *        - Finances
 *      parameters:
 *        - in: path
 *          name: sale_id
 *          description: Numeric ID of the sale that the finance is registered to.
 *          schema:
 *              type: integer
 *              example: 4
 *      responses:
 *          200:
 *              description: Successfully deleted finance.
 *              schema:
 *                  $ref: '#/definitions/Finance'
 */
router.delete("/:sale_id", async (req, res) => {
    const { sale_id } = req.params;
    res.json(await Finances.delete(sale_id));
});

export default router;