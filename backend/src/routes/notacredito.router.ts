import { Router } from 'express';
import {
  createNotaCredito,
  getAllNotasCredito,
  getNotaCreditoById,
  updateNotaCredito,
  deleteNotaCredito
} from '../controllers/notacredito.controller';

const NotasCreditoRouter = Router();

// Rutas para las notas de crédito
NotasCreditoRouter.post('/', createNotaCredito); // Crear una nueva nota de crédito
NotasCreditoRouter.get('/', getAllNotasCredito); // Obtener la lista de notas de crédito
NotasCreditoRouter.get('/:id', getNotaCreditoById); // Obtener una nota de crédito por ID
NotasCreditoRouter.put('/:id', updateNotaCredito); // Actualizar una nota de crédito por ID
NotasCreditoRouter.delete('/:id', deleteNotaCredito); // Eliminar una nota de crédito por ID

export default NotasCreditoRouter;
