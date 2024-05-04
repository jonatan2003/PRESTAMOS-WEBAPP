import { Router } from 'express';
import {
  createVenta,
  getVentas,
  getVentaById,
  updateVenta,
  deleteVenta,
} from '../controllers/venta.controller';

const VentasRouter = Router();

VentasRouter.post('/', createVenta); // Crear una nueva venta
VentasRouter.get('/', getVentas); // Obtener la lista de ventas
VentasRouter.get('/:idVenta', getVentaById); // Obtener una venta por ID
VentasRouter.put('/:idVenta', updateVenta); // Actualizar una venta por ID
VentasRouter.delete('/:idVenta', deleteVenta); // Eliminar una venta por ID

export default VentasRouter;
