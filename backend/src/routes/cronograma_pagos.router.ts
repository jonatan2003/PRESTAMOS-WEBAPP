

import { Router } from 'express';
import * as cronogramaPagosController from '../controllers/cronograma_pagos.controller';

const CronogramaPagosRouter = Router();

CronogramaPagosRouter.post('/', cronogramaPagosController.createCronogramaPago); // Crear un nuevo pago
CronogramaPagosRouter.get('/', cronogramaPagosController.getCronogramaPagos); // Obtener la lista de pagos
CronogramaPagosRouter.get('/:id_prestamo', cronogramaPagosController.getCronogramaPagoByIdPrestamo); // Obtener un pago por ID
CronogramaPagosRouter.put('/:id', cronogramaPagosController.updateCronogramaPago); // Actualizar un pago por ID
CronogramaPagosRouter.delete('/:id', cronogramaPagosController.deleteCronogramaPago); // Eliminar un pago por ID

export default CronogramaPagosRouter;
