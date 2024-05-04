import { Router } from 'express';
import {
  createPrestamo,
  updatePrestamo,
  deletePrestamo,
  getPrestamoById,
  getPrestamos,
  getUltimoPrestamoIngresado,
  getPrestamosPorEstadoDetalle,
  getPrestamosPorArticuloVehiculo,
  getPrestamosPorArticuloElectrodomestico,
  getPrestamosVencidos, // Importa la nueva función
} from '../controllers/prestamo.controller';

const PrestamoRouter = Router();

PrestamoRouter.post('/', createPrestamo); // Crear un nuevo registro de prestamo
PrestamoRouter.get('/', getPrestamos); // Obtener la lista de registros de prestamo
PrestamoRouter.get('/:idPrestamo', getPrestamoById); // Obtener un registro de prestamo por ID
PrestamoRouter.put('/:idPrestamo', updatePrestamo); // Actualizar un registro de prestamo por ID
PrestamoRouter.delete('/:idPrestamo', deletePrestamo); // Eliminar un registro de prestamo por ID

PrestamoRouter.get('/last/prestamo', getUltimoPrestamoIngresado);
PrestamoRouter.get('/list/vehiculos', getPrestamosPorArticuloVehiculo); // Obtener la lista de registros de prestamo
PrestamoRouter.get('/list/electrodomesticos', getPrestamosPorArticuloElectrodomestico); // Obtener la lista de registros de prestamo
PrestamoRouter.get('/list/vencidos', getPrestamosVencidos); // Obtener la lista de registros de prestamo
PrestamoRouter.get('/estadoDetalle/:estadoDetalle', getPrestamosPorEstadoDetalle);



export default PrestamoRouter;
