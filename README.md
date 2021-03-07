# DealerDriver

This REST API encapsulates all the day-to-day operations of a car dealership. Functions include vehicle creation with VIN number verification and parsing, tracking of finances, management of branches and stock, dealership employees and roles, active and expired vehicle listings, and customer details.

## Installation
* Visual Studio Code:
    * https://code.visualstudio.com/Download
* Node.js:
    * https://nodejs.org/en/download/
* PostgreSQL:
    * https://www.postgresql.org/download/

## Setup

* Log in to PostgreSQL via command prompt using the following command. In the following example, the user name being supplied is "postgres":


    psql -U postgres

* While logged in to PostgreSQL, run the following command via the command prompt to create a database that this API will operate in:


    CREATE DATABASE dealerDriver;
    
* Open the main folder of this repository with Visual Studio Code.
* Supply the PostgreSQL login details, as well as the database name into the connection pool object that is being created in "db.js". The object should look something like this:


    const pool = new Pool({
        user: "postgres",
        password: "myPassword",
        database: "dealerDriver",
        host: "localhost",
        port: 5432
    });

* Run the following command from the Visual Studio Code terminal:


    npm install

## Running

* Before running the application, we need to ensure that our database contains all the tables that the API operates on.
* Run the following command in the Visual Studio Code terminal to generate all of the tables:


    npm run-script buildtables

* (Optional) Run the following command to fill the tables with sample data:


    npm run-script use-sample-data

* Run the application using the following command:


    nodemon app.js

* Interact with the API methods and view their documentation:
    * http://localhost:5000/api-docs/

## Testing

* Ensure that the database that the application's connection pool is connected to is empty. Run the following command to drop every table:
    * Alternatively, we can connect to a different empty database before running unit tests.


    npm run-script droptables

* Run all unit tests using the following command:


    npm test