import { Router } from 'express';
import {
  createVehiculo,
  getVehiculos,
  getVehiculoById,
  updateVehiculo,
  deleteVehiculo,
  getUltimoVehiculo,
} from '../controllers/vehiculo.controller';

const VehiculosRouter = Router();

VehiculosRouter.post('/', createVehiculo); // Crear un nuevo vehículo
VehiculosRouter.get('/', getVehiculos); // Obtener la lista de vehículos
VehiculosRouter.get('/:id', getVehiculoById); // Obtener un vehículo por ID
VehiculosRouter.put('/:id', updateVehiculo); // Actualizar un vehículo por ID
VehiculosRouter.delete('/:id', deleteVehiculo); // Eliminar un vehículo por ID
VehiculosRouter.get('/last/vehiculo', getUltimoVehiculo); // Obtener la lista de vehículos

export default VehiculosRouter;
