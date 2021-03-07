import express from "express";

const app = express();
app.use(express.json());

import branchesRoutes from "./routes/branches.js";
app.use("/branches", branchesRoutes);

import customersRoutes from "./routes/customers.js";
app.use("/customers", customersRoutes);

import financesRoutes from "./routes/finances.js";
app.use("/finances", financesRoutes);

import maintenanceRoutes from "./routes/maintenance.js";
app.use("/maintenance", maintenanceRoutes);

import rolesRoutes from "./routes/roles.js";
app.use("/roles", rolesRoutes);

import salesRoutes from "./routes/sales.js";
app.use("/sales", salesRoutes);

import staffRoutes from "./routes/staff.js";
app.use("/staff", staffRoutes);

import stockRoutes from "./routes/stock.js";
app.use("/stock", stockRoutes);

import vehicleManufacturersRoutes from "./routes/vehicle-manufacturers.js";
app.use("/vehicle_manufacturers", vehicleManufacturersRoutes);

import vehiclesRoutes from "./routes/vehicles.js";
app.use("/vehicles", vehiclesRoutes);

import vinParseRoutes from "./routes/vin-parse.js";
app.use("/vin_parse", vinParseRoutes);

export default app;