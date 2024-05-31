import { Router } from 'express';
import {
  createDetalleVenta,
  updateDetalleVenta,
  deleteDetalleVenta,
  getDetalleVentaById,
  getDetallesVenta,
  getDetalleVentaByVentaId,
} from '../controllers/detalleventa.controller';

const DetalleVentaRouter = Router();

DetalleVentaRouter.post('/', createDetalleVenta); // Crear un nuevo registro de detalleventa
DetalleVentaRouter.get('/', getDetallesVenta); // Obtener la lista de registros de detalleventa
DetalleVentaRouter.get('/venta/:idVenta', getDetalleVentaByVentaId); // Obtener un registro de detalleventa por ID
DetalleVentaRouter.get('/:idDetalleVenta', getDetalleVentaById); // Obtener un registro de detalleventa por ID
DetalleVentaRouter.put('/:idDetalleVenta', updateDetalleVenta); // Actualizar un registro de detalleventa por ID
DetalleVentaRouter.delete('/:idDetalleVenta', deleteDetalleVenta); // Eliminar un registro de detalleventa por ID

export default DetalleVentaRouter;
