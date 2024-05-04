import { Router } from 'express';
import {
  createPago,
  updatePago,
  deletePago,
  getPagoById,
  getPagos,
} from '../controllers/pago.controller';

const PagoRouter = Router();

PagoRouter.post('/', createPago); // Crear un nuevo registro de pago
PagoRouter.get('/', getPagos); // Obtener la lista de registros de pago
PagoRouter.get('/:idPago', getPagoById); // Obtener un registro de pago por ID
PagoRouter.put('/:idPago', updatePago); // Actualizar un registro de pago por ID
PagoRouter.delete('/:idPago', deletePago); // Eliminar un registro de pago por ID

export default PagoRouter;
