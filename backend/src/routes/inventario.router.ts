import { Router } from 'express';
import {
  createInventario,
  updateInventario,
  deleteInventario,
  getInventarioById,
  getInventarios,
} from '../controllers/inventario.controller';

const InventarioRouter = Router();

InventarioRouter.post('/', createInventario); // Crear un nuevo registro de inventario
InventarioRouter.get('/', getInventarios); // Obtener la lista de registros de inventario
InventarioRouter.get('/:id', getInventarioById); // Obtener un registro de inventario por ID
InventarioRouter.put('/:id', updateInventario); // Actualizar un registro de inventario por ID
InventarioRouter.delete('/:id', deleteInventario); // Eliminar un registro de inventario por ID

export default InventarioRouter;
