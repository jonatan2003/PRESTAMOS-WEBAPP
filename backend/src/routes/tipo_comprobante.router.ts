import { Router } from 'express';
import {
  createTipoComprobante,
  getTiposComprobante,
  getTipoComprobanteById,
  updateTipoComprobante,
  deleteTipoComprobante,
} from '../controllers/tipo_comprobante.controller';

const TipoComprobanteRouter = Router();

TipoComprobanteRouter.post('/', createTipoComprobante);
TipoComprobanteRouter.get('/', getTiposComprobante);
TipoComprobanteRouter.get('/:id', getTipoComprobanteById);
TipoComprobanteRouter.put('/:id', updateTipoComprobante);
TipoComprobanteRouter.delete('/:id', deleteTipoComprobante);

export default TipoComprobanteRouter;
