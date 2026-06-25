import employeeController from '../controller/employee.js'
import { Router } from 'express'
import { verify, verifyRoles } from "../middleware/auth.js";


const routes = Router();

routes.post("/create", employeeController.createEmployee);
routes.post("/login", employeeController.loginEmployee);
routes.get('/all_employees', verify, verifyRoles("admin"), employeeController.getAllEmployess)
routes.get('/delete_employee/:id', verify, verifyRoles("admin"), employeeController.deleteEmployee)
routes.put("/update_employee/:id", verify, employeeController.updateEmployee);
routes.get(
    "/dashboard",
    verify,
    employeeController.adminDashboard
);
export default routes