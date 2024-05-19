import { Router } from 'express';
import {
    createBoleta,
    getBoletas,
    getBoletaById,
    updateBoleta,
    deleteBoleta,

  } from '../controllers/boleta.controller';
 
const BoletasRouter = Router();

BoletasRouter.post('/', createBoleta); // Crear un nuevo artículo
BoletasRouter.get('/', getBoletas); // Obtener la lista de artículos
BoletasRouter.get('/:id', getBoletaById); // Obtener un artículo por ID
BoletasRouter.put('/:id', updateBoleta); // Actualizar un artículo por ID
BoletasRouter.delete('/:idArticulo', deleteBoleta); // Eliminar un artículo por ID


export default BoletasRouter;