import express from "express";
import Customers from "../models/customers.js"

const router = express.Router();

/**
 * @swagger
 * /customers:
 *  get:
 *      summary: Get all customers.
 *      tags: 
 *        - Customers
 *      responses:
 *          200:
 *              description: Successfully retrieved all customers.
 *              schema:
 *                  type: array
 *                  items:
 *                      $ref: '#/definitions/Customer'
 */
router.get("/", async (req, res) => {
    res.json(await Customers.getAll());
});

/**
 * @swagger
 * /customers/{customer_id}:
 *  get:
 *      summary: Get the details of a single customer.
 *      tags: 
 *        - Customers
 *      parameters:
 *        - in: path
 *          name: customer_id
 *          description: Numeric ID of the customer to retrieve.
 *          schema:
 *              type: integer
 *              example: 1 
 *      responses:
 *          200:
 *              description: Successfully retrieved customer.
 *              schema:
 *                  $ref: '#/definitions/Customer'
 */
router.get("/:customer_id", async (req, res) => {
    const { customer_id } = req.params;
    res.json(await Customers.getById(customer_id));
});

/**
 * @swagger
 * /customers:
 *  post:
 *      summary: Create a customer.
 *      description: Creates a customer with only a name at first. Use the PATCH method to add contact details to the customer as they become known.
 *      tags: 
 *        - Customers
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: Customer
 *          description: Properties of the new customer. 
 *          schema:
 *              type: object
 *              required:
 *                - fullname
 *              properties:
 *                  fullname:
 *                      type: string(32)
 *                      example: "John Doe"
 *      responses:
 *          200:
 *              description: Successfully created customer.
 *              schema:
 *                  $ref: '#/definitions/Customer'
 */
router.post("/", async (req, res) => {
    const { fullname } = req.body;
    res.json(await Customers.create(fullname));
});

/**
 * @swagger
 * /customers/{customer_id}:
 *  patch:
 *      summary: Apply new values to columns of a customer.
 *      tags: 
 *        - Customers
 *      parameters:
 *        - in: path
 *          name: customer_id
 *          description: Numeric ID of the customer to edit.
 *          schema:
 *              type: integer
 *              example: 1 
 *        - in: body
 *          name: Customer
 *          description: Optional columns of the customer, which we intend to edit. Columns must exist in the "Customer" model.
 *          schema:
 *              type: object
 *              properties:
 *                  fullname:
 *                      type: string(32)
 *                      example: "John Doe"
 *                  phone:
 *                      type: string(16)
 *                      example: "270-350-9225"
 *                  email:
 *                      type: string(32)
 *                      example: "JohnDoe@gmail.com"
 *                  address:
 *                      type: string(64)
 *                      example: "4840 Glen Street"
 *                  city:
 *                      type: string(16)
 *                      example: "Owensboro"
 *                  postal_code:
 *                      type: string(2)
 *                      example: "KY"
 *      responses:
 *          200:
 *              description: Successsfully edited customer.
 *              schema:
 *                  $ref: '#/definitions/Customer'
 */
router.patch("/:customer_id", async (req, res) => {
    const { customer_id } = req.params;
    res.json(await Customers.update(customer_id, req.body));
});

/**
 * @swagger
 * /customers/{customer_id}:
 *  delete:
 *      summary: Delete a customer.
 *      description: We cannot delete a customer if they have ever commenced a finance.
 *      tags: 
 *        - Customers
 *      parameters:
 *        - in: path
 *          name: customer_id
 *          description: Numeric ID of the customer to delete.
 *          schema:
 *              type: integer
 *              example: 4 
 *      responses:
 *          200:
 *              description: Successfully deleted customer.
 *              schema:
 *                  $ref: '#/definitions/Customer'
 */
router.delete("/:customer_id", async (req, res) => {
    const { customer_id } = req.params;
    res.json(await Customers.delete(customer_id));
});

export default router;