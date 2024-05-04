import { Router } from 'express';
import {
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getCategoriaById,
  getCategorias,
} from '../controllers/categoria.controller';

const CategoriaRouter = Router();

CategoriaRouter.post('/', createCategoria); // Crear un nuevo registro de categoria
CategoriaRouter.get('/', getCategorias); // Obtener la lista de registros de categoria
CategoriaRouter.get('/:idCategoria', getCategoriaById); // Obtener un registro de categoria por ID
CategoriaRouter.put('/:idCategoria', updateCategoria); // Actualizar un registro de categoria por ID
CategoriaRouter.delete('/:idCategoria', deleteCategoria); // Eliminar un registro de categoria por ID

export default CategoriaRouter;
