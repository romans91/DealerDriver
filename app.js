import app from './index.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Dealer API',
            version: '21.3.0'
        }
    },
    apis: [
        'app.js', 
        './routes/branches.js', 
        './routes/customers.js', 
        './routes/finances.js', 
        './routes/maintenance.js', 
        './routes/roles.js', 
        './routes/sales.js', 
        './routes/staff.js', 
        './routes/stock.js', 
        './routes/vehicle-manufacturers.js', 
        './routes/vehicles.js', 
        './routes/vin-parse.js'],
};

const swaggerDocs = await swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const port = 5000;

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

/**
 * @swagger
 * tags:
 *   - name: Branches
 *     description: Locations that this dealership operates from.
 *   - name: Customers
 *     description: Details of all prospective and existing customers of this dealership.
 *   - name: Finances
 *     description: Ongoing and finalized payment schedules for vehicle sales.
 *   - name: Maintenance
 *     description: Planned/commenced/finalized vehicle maintenance appointments.
 *   - name: Roles
 *     description: Roles of staff employed by this dealership.
 *   - name: Sales
 *     description: Active and archived vehicle listings.
 *   - name: Staff
 *     description: Current employees of the dealership.
 *   - name: Stock
 *     description: This dealership's vehicle inventory.
 *   - name: Vehicles
 *     description: Details of all imported/listed/sold vehicles, incliding the specs, original purchase price, and mileage.
 *   - name: Vin Parsing
 *     description: Extracting vehicle specs from VIN numbers.
 *   - name: Vehicle Manufacturers
 *     description: Registered vehicle manufacturers that are referenced in vehicle details.
 * 
 * definitions:
 *  Branch:
 *      type: object
 *      properties:
 *          branch_id:
 *              type: integer
 *              example: 1
 *          branch_name:
 *              type: string(20)
 *              example: "Dallas"
 *          phone: 
 *              type: string(16)
 *              example: "817-887-5434"
 *          address:
 *              type: string(255)
 *              example: "1366 Baker Avenue, Dallas, TX"
 *          vehicle_capacity:
 *              type: integer
 *              example: 50
 * 
 *  Customer:
 *      type: object
 *      properties:
 *          customer_id:
 *              type: integer
 *              example: 1
 *          fullname:
 *              type: string(32)
 *              example: "Alana Knott"
 *          phone:
 *              type: string(16)
 *              example: "515-222-8483"
 *          email:
 *              type: string(32)
 *              example: "aknott1@hotmail.com"
 *          address:
 *              type: string(64)
 *              example: "1645 Stark Hollow Road"
 *          city:
 *              type: string(16)
 *              example: "San Antonio"
 *          postal_code:
 *              type: string(2)
 *              example: "TX"
 * 
 *  Finance:
 *      type: object
 *      properties: 
 *          sale_id:
 *              type: integer
 *              example: 4
 *          customer_id:
 *              type: integer
 *              example: 5
 *          down_payment:
 *              type: decimal
 *              example: 1000
 *          loan:
 *              type: decimal
 *              example: 2995
 *          annual_interest_rate:
 *              type: decimal
 *              example: "0.03"
 *          payments_per_year:
 *              type: integer
 *              example: 12
 *          number_of_years:
 *              type: integer
 *              example: 1
 *          commencement_date:
 *              type: date
 *              example: "2021-07-05T12:00:00.000Z"
 *          paid_to_date:
 *              type: decimal
 *              example: 100      
 * 
 *  Maintenance:
 *      type: object
 *      properties:
 *          maintenance_id:
 *              type: integer
 *              example: 1
 *          vin:
 *              type: string(17)
 *              example: "1VWAP7A37EC006656"
 *          description:
 *              type: string(255)
 *              example: "Service"
 *          commencement_date_time:
 *              type: datetime
 *              example: "2021-06-22T03:30:00.000Z"
 *          completion_date_time:
 *              type: datetime
 *              example: "2021-06-23T23:00:00.000Z"
 *          quote:
 *              type: decimal
 *              example: 656.78
 * 
 *  Role:
 *      type: object
 *      properties:
 *          role_id:
 *              type: integer
 *              example: 1
 *          title:
 *              type: string(15)
 *              example: "Manager"
 *          base_hourly_rate:
 *              type: decimal
 *              example: 25.00
 * 
 *  Sale:
 *      type: object
 *      properties:
 *          sale_id:
 *              type: integer
 *              example: 1
 *          vin:
 *              type: string(17)
 *              example: "4T1BG22K11U780417"
 *          sticker_price:
 *              type: decimal
 *              example: 3995
 *          listing_date:
 *              type: date
 *              example: "2021-06-05T12:00:00.000Z"
 *          sold_date:
 *              type: date
 *              example: "2021-07-05T12:00:00.000Z"
 *          staff_id:
 *              type: integer
 *              example: 2
 *          commission:
 *              type: decimal
 *              example: 125.25
 * 
 *  Staff:
 *      type: object
 *      properties:
 *          staff_id:
 *              type: integer
 *              example: 1
 *          role_id:
 *              type: integer
 *              example: 1
 *          branch_id:
 *              type: integer
 *              example: 1
 *          fullname:
 *              type: string(32)
 *              example: "Catherine Warner"
 *          phone:
 *              type: string(16)
 *              example: "808-841-5031"
 *          email:
 *              type: string(32)
 *              example: "cWarner@gmail.com"
 *          address:
 *              type: string(64)
 *              example: "4388 Randall Drive"
 *          city:
 *              type: string(16)
 *              example: "Lubbock"
 *          postal_code:
 *              type: string(2)
 *              example: "TX"
 * 
 *  Stock:
 *      type: object
 *      properties:
 *          vin:
 *              type: string(17)
 *              example: "1FDKF37G6VEB89402"
 *          maintenance_id:
 *              type: integer
 *              example: 1
 * 
 *  VehicleManufacturer:
 *      type: object
 *      properties:
 *          name:
 *              type: string(64)
 *              example: "Honda"
 *          country_of_origin: 
 *              type: string(64)
 *              example: "Japan"
 * 
 *  Vehicle:
 *      type: object
 *      properties:
 *          vin:
 *              type: string(17)
 *              example: "2G1WB58K469268340"     
 *          year:  
 *              type: integer
 *              example: 2006
 *          make:
 *              type: string(64)
 *              example: "Chevrolet"
 *          model:
 *              type: string(32)
 *              example: "Impala"
 *          model_specifics:
 *              type: string(64)
 *              example: "BOSE Sound System"
 *          colour:
 *              type: string(16)
 *              example: "White"
 *          mileage:
 *              type: integer
 *              example: 131747
 *          body_style:
 *              type: string(16)
 *              example: "Sedan"
 *          transmission:
 *              type: string(32)
 *              example: "Automatic"
 *          engine:
 *              type: string(16)
 *              example: "3.5L Gasoline"    
 *          acquisition_price:
 *              type: decimal
 *              example: 5119.87
 */ 