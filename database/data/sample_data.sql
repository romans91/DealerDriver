INSERT INTO vehicles(vin, year, make, model, model_specifics, colour, mileage, body_style, transmission, engine, acquisition_price_cents)
VALUES ('2G1WB58K469268340', 2006, 'Chevrolet', 'Impala', 'BOSE Sound System', 'White', 131747, 'Sedan', 'Automatic', '3.5L Gasoline', 511987), 
('KNAFK4A60F5302332', 2014, 'Kia', 'Forte', '', 'Beige', 35411, 'Sedan', 'Automatic', '1.8L Gasoline', 1184355),
('JHMGE8H52CC009119', 2012, 'Honda', 'Fit', 'Modified suspension', 'Black', 98113, 'Hatchback', 'Manual', '1.5L Gasoline', 862229),
('1VWAP7A37EC006656', 2014, 'Volkswagen', 'Passat', 'Custom exhaust', 'Blue Metallic', 111745, 'Sedan', 'Automatic', '2.5L Gasoline', 1256629),
('4T1BG22K11U780417', 2001, 'Toyota', 'Camry', '', 'Pearl Red', 231553, 'Sedan', 'Manual', '2.2L Gasoline', 267613),
('KNDJN2A29E7075375', 2014, 'Kia', 'Soul', '', 'Brown Metallic', 76737, 'Station Wagon', 'Automatic', '1.6L Gasoline', 898244),
('1HGCR2F59EA000597', 2014, 'Honda', 'Accord', 'Sport', 'White', 179672, 'Sedan', 'Automatic', '2.4L Gasoline', 856541),
('3TMJU4GN5EM169274', 2014, 'Toyota', 'Tacoma', 'Light Bar', 'White', 21634, 'Light Pickup', 'Manual', '4.0L Gasoline', 1990000),
('3C63D3EL4CG137066', 2012, 'Dodge', 'RAM', '', 'Red', 85633, 'Pickup', 'Manual', '6.7L Diesel', 2679211),
('SAJDA03N42FM40889', 2002, 'Jaguar', 'S-Type', '', 'Silver', 60788, 'Sedan', 'Automatic', '3.0L Gasoline', 895573),
('1HGCD7135TA022837', 1996, 'Honda', 'Accord', '', 'Black', 213867, 'Coupe', 'Automatic', '2.2L Gasoline', 235000);

INSERT INTO branches(branch_name, phone, address, vehicle_capacity)
VALUES('Dallas', '817-887-5434', '1366 Baker Avenue, Dallas, TX', 50), 
('Lubbock', '307-732-9567', '4702 Archwood Avenue, Lubbock, TX', 40),
('El Paso', '561-443-8361', '490 Wyatt Street, El Paso, TX', 60);

INSERT INTO roles(title, base_hourly_rate_cents)
VALUES ('Manager', 2500), 
('Sales Agent', 2125),
('Finance Manager', 2325);

INSERT INTO staff(role_id, branch_id, fullname, phone, email, address, city, postal_code)
VALUES (1, 1, 'Catherine Warner', '808-841-5031', 'cWarner@gmail.com', '4388 Randall Drive', 'Lubbock', 'TX'), 
(2, 2, 'Arnold Pillsbury', '830-303-9027', 'arnoldP23@hotmail.com', '2263 Wilson Avenue', 'Lubbock', 'TX'), 
(2, 1, 'Josephine Reinert', '832-248-1389', 'JJReiner@gmail.com', '62b Meadowview Drive', 'Shallowater', 'TX');

INSERT INTO customers(fullname, phone, email, address, city, postal_code)
VALUES ('Alana Knott', '515-222-8483', 'aknott1@hotmail.com', '1645 Stark Hollow Road', 'San Antonio', 'TX'), 
('Ernest Winter', '803-916-7890', '1ewin1@gmail.com', '4 Ashford Drive', 'Flat', 'TX'), 
('Betty Lilly', '720-400-7268', 'B.Lilly@live.com', '355 Alexander Avenue', 'Oakley', 'CA'), 
('Robert Mui', '841-390-3796', 'robertM@gmail.com', '147 Cambridge Court', 'Lubbock', 'TX'), 
('Diana Carder', '330-210-0146', 'dianacarder@gmail.com', '3669 Duke Lane', 'Jackson', 'MS'),
('Arthur Bayne', '870-328-8734', 'abayne@gmail.com', '4412 Fittro Street', 'Fisher', 'AR');

INSERT INTO sales(vin, sticker_price_cents, listing_date, sold_date, staff_id, commission_cents)
VALUES('4T1BG22K11U780417', 399500, TO_DATE('06/05/2021', 'DD/MM/YYYY'), TO_DATE('06/07/2021', 'DD/MM/YYYY'), 2, 12525),
('KNAFK4A60F5302332', 1679500, TO_DATE('17/05/2021', 'DD/MM/YYYY'), null, null, null), 
('1VWAP7A37EC006656', 1499500, TO_DATE('19/05/2021', 'DD/MM/YYYY'), null, null, null),
('JHMGE8H52CC009119', 999500, TO_DATE('03/06/2021', 'DD/MM/YYYY'), null, null, null),
('KNDJN2A29E7075375', 999500, TO_DATE('08/07/2021', 'DD/MM/YYYY'), TO_DATE('11/08/2021', 'DD/MM/YYYY'), 3, 26575),
('3C63D3EL4CG137066', 2999500, TO_DATE('08/07/2021', 'DD/MM/YYYY'), TO_DATE('21/09/2021', 'DD/MM/YYYY'), 2, 30000),
('1HGCR2F59EA000597', 1199500, TO_DATE('21/07/2021', 'DD/MM/YYYY'), TO_DATE('26/09/2021', 'DD/MM/YYYY'), 1, 24550);

INSERT INTO finances(sale_id, customer_id, down_payment_cents, loan_cents, annual_interest_rate, payments_per_year, number_of_years, commencement_date, paid_to_date_cents)
VALUES(4, 5, 100000, 299500, 0.03, 12, 1, TO_DATE('06/07/2021', 'DD/MM/YYYY'), 115000),
(5, 3, 200000, 799500, 0.03, 26, 2, TO_DATE('11/08/2021', 'DD/MM/YYYY'), 160000),
(6, 1, 500000, 2499500, 0.03, 52, 2, TO_DATE('21/09/2021', 'DD/MM/YYYY'), 350000),
(7, 2, 200000, 999500, 0.03, 12, 2, TO_DATE('26/09/2021', 'DD/MM/YYYY'), 85000);

INSERT INTO maintenance(vin, description, commencement_date_time, completion_date_time, quote_cents)
VALUES('1VWAP7A37EC006656', 'Service', '2021-06-22 15:30:00', '2021-06-24 11:00:00', 65678);

INSERT INTO stock(vin, branch_id)
VALUES('2G1WB58K469268340', 1),
('KNAFK4A60F5302332', 1),
('JHMGE8H52CC009119', 2),
('1VWAP7A37EC006656', 2),
('3TMJU4GN5EM169274', 1),
('SAJDA03N42FM40889', 1);