import { Router } from 'express';
import * as empleadoController from '../controllers/empleado.controller';

const EmpleadosRouter = Router();

EmpleadosRouter.post('/', empleadoController.createEmpleado); // Crear un nuevo empleado
EmpleadosRouter.get('/', empleadoController.getEmpleados); // Obtener la lista de empleados
EmpleadosRouter.get('/:idEmpleado', empleadoController.getEmpleadoById); // Obtener un empleado por ID
EmpleadosRouter.put('/:idEmpleado', empleadoController.updateEmpleado); // Actualizar un empleado por ID
EmpleadosRouter.delete('/:idEmpleado', empleadoController.deleteEmpleado); // Eliminar un empleado por ID

export default EmpleadosRouter;
