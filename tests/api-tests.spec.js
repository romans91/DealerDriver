import { branchesTests } from "./testsuites/branches";
import { customersTests } from "./testsuites/customers";
import { financesTests } from "./testsuites/finances";
import { maintenanceTests } from "./testsuites/maintenance";
import { rolesTests } from "./testsuites/roles";
import { salesTests } from "./testsuites/sales";
import { staffTests } from "./testsuites/staff";
import { stockTests } from "./testsuites/stock";
import { vehiclesTests } from "./testsuites/vehicles";
import { vehicleManufacturersTests } from "./testsuites/vehicle-manufacturers";
import { vinParseTests } from "./testsuites/vin-parse";
import { setup } from "./routines/database-setup";
import { teardown } from "./routines/database-teardown";


describe('Creating tables', setup);
describe('Dealership branch operations tests', branchesTests);
describe('Customers tests', customersTests);
describe('Finances tests', financesTests);
describe('Maintenance tests', maintenanceTests);
describe('Employee role tests', rolesTests);
describe('Sales tests', salesTests);
describe('Staff tests', staffTests);
describe('Vehicle yard movement tests', stockTests);
describe('Vehicle properties tests', vehiclesTests);
describe('Vehicle manufacturers tests', vehicleManufacturersTests);
describe('Vin parser tests', vinParseTests);
describe('Removing tables', teardown);
