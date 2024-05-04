import { Router } from 'express';
import {
  createArticulo,
  getArticulos,
  getArticuloById,
  updateArticulo,
  deleteArticulo,
  getArticulosVehiculo,
  getArticulosElectrodomestico,
} from '../controllers/articulo.controller';

const ArticulosRouter = Router();

ArticulosRouter.post('/', createArticulo); // Crear un nuevo artículo
ArticulosRouter.get('/', getArticulos); // Obtener la lista de artículos
ArticulosRouter.get('/:id', getArticuloById); // Obtener un artículo por ID
ArticulosRouter.put('/:id', updateArticulo); // Actualizar un artículo por ID
ArticulosRouter.delete('/:idArticulo', deleteArticulo); // Eliminar un artículo por ID
ArticulosRouter.get('/list/Vehiculos', getArticulosVehiculo); // Obtener la lista de artículos
ArticulosRouter.get('/list/Electrodomesticos', getArticulosElectrodomestico); // Obtener la lista de artículos

export default ArticulosRouter;
