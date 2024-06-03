import { Router } from 'express';
import {
  createComprobanteVenta,
  getComprobantesVenta,
  getComprobanteVentaById,
  updateComprobanteVenta,
  deleteComprobanteVenta,
  getComprobanteVentaByIdVenta,
} from '../controllers/comprobante_venta.controller';

const ComprobanteVentaRouter = Router();

ComprobanteVentaRouter.post('/', createComprobanteVenta);
ComprobanteVentaRouter.get('/', getComprobantesVenta);
ComprobanteVentaRouter.get('/:id', getComprobanteVentaById);
ComprobanteVentaRouter.get('/venta/:idventa', getComprobanteVentaByIdVenta);
ComprobanteVentaRouter.put('/:id', updateComprobanteVenta);
ComprobanteVentaRouter.delete('/:id', deleteComprobanteVenta);

export default ComprobanteVentaRouter;
