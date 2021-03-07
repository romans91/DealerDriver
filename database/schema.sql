CREATE TABLE vehicle_manufacturers(
	name VARCHAR(64),
	country_of_origin VARCHAR(64),
	PRIMARY KEY(name)
);

CREATE TABLE wmi_codes(
	code VARCHAR(3),
	manufacturer_name VARCHAR(64),
	CONSTRAINT manufacturer
	    FOREIGN KEY(manufacturer_name) 
			REFERENCES vehicle_manufacturers(name),
	PRIMARY KEY(code)
);

CREATE TABLE vehicles(
    vin char(17),
	year SMALLINT NOT NULL,
	make VARCHAR(64) NOT NULL,
	model VARCHAR(32) NOT NULL,
	model_specifics VARCHAR(64),
	colour VARCHAR(16),
	mileage INT,
	body_style VARCHAR(16),
	transmission VARCHAR(32),
	engine VARCHAR(16),
	acquisition_price_cents INTEGER,
	CONSTRAINT manufacturer
	    FOREIGN KEY(make) 
			REFERENCES vehicle_manufacturers(name),
	PRIMARY KEY(vin)
);

CREATE TABLE maintenance(
	maintenance_id SERIAL,
	vin char(17) NOT NULL,
	description VARCHAR(255) NOT NULL,
	commencement_date_time TIMESTAMP,
	completion_date_time TIMESTAMP,
	quote_cents INTEGER,
	CONSTRAINT vin_repair
	    FOREIGN KEY(vin) 
			REFERENCES vehicles(vin),
	PRIMARY KEY(maintenance_id)
);

CREATE TABLE customers(
	customer_id SERIAL,
	fullname VARCHAR(32) NOT NULL,
	phone VARCHAR(16),
	email VARCHAR(32),
	address VARCHAR(64),
	city VARCHAR(16),
	postal_code CHAR(2),
	PRIMARY KEY(customer_id)
);
 
CREATE TABLE roles(
	role_id SERIAL,
	title VARCHAR(15) UNIQUE NOT NULL,
	base_hourly_rate_cents INTEGER NOT NULL,
	PRIMARY KEY(role_id)
);

CREATE TABLE branches(
	branch_id SERIAL,
	branch_name VARCHAR(20) UNIQUE NOT NULL,
	phone VARCHAR(16) NOT NULL,
	address VARCHAR(255) NOT NULL,
	vehicle_capacity INT,
	PRIMARY KEY(branch_id)
);

CREATE TABLE stock(
	vin VARCHAR(17),
	branch_id INT,
	CONSTRAINT vehicle
	    FOREIGN KEY(vin) 
			REFERENCES vehicles(vin),
	CONSTRAINT location
	    FOREIGN KEY(branch_id) 
			REFERENCES branches(branch_id),
	PRIMARY KEY(vin)
);

CREATE TABLE staff(
	staff_id SERIAL,
	role_id INT,
	branch_id INT,
	fullname VARCHAR(32) NOT NULL,
	phone VARCHAR(16) NOT NULL,
	email VARCHAR(32) NOT NULL,
	address VARCHAR(64) NOT NULL,
	city VARCHAR(16) NOT NULL,
	postal_code CHAR(2) NOT NULL,
	CONSTRAINT their_role
	    FOREIGN KEY(role_id) 
			REFERENCES roles(role_id),
	CONSTRAINT base_branch
	    FOREIGN KEY(branch_id) 
			REFERENCES branches(branch_id),
	PRIMARY KEY(staff_id)
);

CREATE TABLE sales(
	sale_id SERIAL,
	vin CHAR(17),
	sticker_price_cents INTEGER,
	listing_date DATE,
	sold_date DATE,
	staff_id INTEGER,
	commission_cents INTEGER,
	CONSTRAINT sold_vehicle
		FOREIGN KEY(vin)
			REFERENCES vehicles(vin),
	PRIMARY KEY(sale_id)
);

CREATE TABLE finances(
	sale_id INTEGER,
	customer_id INTEGER,
	down_payment_cents INTEGER,
	loan_cents INTEGER,
	annual_interest_rate DECIMAL,
	payments_per_year SMALLINT,
	number_of_years SMALLINT,
	commencement_date DATE,
	paid_to_date_cents INTEGER,
	CONSTRAINT sale
		FOREIGN KEY(sale_id)
			REFERENCES sales(sale_id),
	CONSTRAINT customer
		FOREIGN KEY(customer_id)
			REFERENCES customers(customer_id),
	PRIMARY KEY(sale_id)
);