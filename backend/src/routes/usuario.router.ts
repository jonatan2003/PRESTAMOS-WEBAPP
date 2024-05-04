import { Router } from 'express';
import {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
} from '../controllers/usuario.controller';

const UsuariosRouter = Router();

UsuariosRouter.post('/', createUsuario); // Crear un nuevo usuario
UsuariosRouter.get('/', getUsuarios); // Obtener la lista de usuarios
UsuariosRouter.get('/:idUsuario', getUsuarioById); // Obtener un usuario por ID
UsuariosRouter.put('/:idUsuario', updateUsuario); // Actualizar un usuario por ID
UsuariosRouter.delete('/:idUsuario', deleteUsuario); // Eliminar un usuario por ID

export default UsuariosRouter;
