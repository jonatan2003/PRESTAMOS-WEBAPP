import { Router } from 'express';
import {
  createTipoSerie,
  getTiposSerie,
  getTipoSerieById,
  updateTipoSerie,
  deleteTipoSerie,
} from '../controllers/tipo_serie.controller';

const TipoSerieRouter = Router();

TipoSerieRouter.post('/', createTipoSerie); // Crear un nuevo tipo de serie
TipoSerieRouter.get('/', getTiposSerie); // Obtener la lista de tipos de serie
TipoSerieRouter.get('/:id', getTipoSerieById); // Obtener un tipo de serie por ID
TipoSerieRouter.put('/:id', updateTipoSerie); // Actualizar un tipo de serie por ID
TipoSerieRouter.delete('/:id', deleteTipoSerie); // Eliminar un tipo de serie por ID

export default TipoSerieRouter;
