import { Router } from 'express';
import {
  createTipoPago,
  updateTipoPago,
  deleteTipoPago,
  getTipoPagoById,
  getTiposPago,
} from '../controllers/tipo_pago.controller';

const TipoPagoRouter = Router();

TipoPagoRouter.post('/', createTipoPago); // Crear un nuevo tipo de pago
TipoPagoRouter.get('/', getTiposPago); // Obtener la lista de tipos de pago
TipoPagoRouter.get('/:id', getTipoPagoById); // Obtener un tipo de pago por ID
TipoPagoRouter.put('/:id', updateTipoPago); // Actualizar un tipo de pago por ID
TipoPagoRouter.delete('/:id', deleteTipoPago); // Eliminar un tipo de pago por ID



export default TipoPagoRouter;
