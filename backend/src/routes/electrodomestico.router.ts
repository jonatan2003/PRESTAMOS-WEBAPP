import { Router } from 'express';
import {
  createElectrodomestico,
  getElectrodomesticos,
  getElectrodomesticoById,
  updateElectrodomestico,
  deleteElectrodomestico,
  getUltimoElectrodomestico,
} from '../controllers/electrodomestico.controller';

const ElectrodomesticosRouter = Router();

ElectrodomesticosRouter.post('/', createElectrodomestico); // Crear un nuevo electrodoméstico
ElectrodomesticosRouter.get('/', getElectrodomesticos); // Obtener la lista de electrodomésticos
ElectrodomesticosRouter.get('/:id', getElectrodomesticoById); // Obtener un electrodoméstico por ID
ElectrodomesticosRouter.put('/:id', updateElectrodomestico); // Actualizar un electrodoméstico por ID
ElectrodomesticosRouter.delete('/:id', deleteElectrodomestico); // Eliminar un electrodoméstico por ID
ElectrodomesticosRouter.get('/last/electrodomestico', getUltimoElectrodomestico); // Obtener la lista de electrodomésticos

export default ElectrodomesticosRouter;
