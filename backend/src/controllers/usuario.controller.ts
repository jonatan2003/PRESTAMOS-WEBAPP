import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import Usuario from '../models/usuario.model';
import Empleado from '../models/empleado.model';


export const createUsuario = async (req: Request, res: Response) => {
  const { id_empleado,usuario, password, permiso } = req.body;

  try {
    // Verifica si el usuario ya existe en la base de datos
    const existingUser = await Usuario.findOne({ where: { usuario } });

    if (existingUser) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    // Hashea la contraseña antes de almacenarla en la base de datos
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crea un nuevo usuario con la contraseña hasheada
    const nuevoUsuario = await Usuario.create({
      id_empleado,
      usuario,
      password: hashedPassword,
      permiso,
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error, comuníquese con soporte' });
  }
};

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        { model: Empleado, as: 'Empleado' }
       
      ],
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de usuarios' });
  }
};

export const getUsuarioById = async (req: Request, res: Response) => {
  const { idUsuario } = req.params;

  try {
    const usuario = await Usuario.findByPk(idUsuario,{
      include: [
        { model: Empleado, as: 'Empleado' }
       
      ],
    });

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el usuario' });
  }
};export const updateUsuario = async (req: Request, res: Response) => {
  const { body } = req;

  const { id, usuario, password_actual, password_nueva, permiso } = body;

  try {
    const user: any = await Usuario.findByPk(id); // Utiliza findByPk para buscar por clave primaria
    if (!user) {
      return res.status(404).json({ msg: `No existe un usuario con el id ${id}` });
    }

    // Verificar si se proporcionó una nueva contraseña
    if (password_nueva) {
      // Verificar si la contraseña actual es correcta
      const coincideContrasena = await verificarContrasena(password_actual, user.password);
      if (!coincideContrasena) {
        return res.status(401).json({ msg: 'La contraseña actual es incorrecta' });
      }

      // Encriptar la nueva contraseña antes de almacenarla
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password_nueva, saltRounds);
      user.password = hashedPassword;
    }

    // Actualizar el usuario con los campos proporcionados en la solicitud
    if (usuario) user.usuario = usuario;
    if (permiso) user.permiso = permiso;
    await user.save();

    res.json({ msg: 'El usuario fue actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error, comuníquese con soporte' });
  }
};

const verificarContrasena = async (contrasena: string, hashedContrasena: string) => {
  // Comparar la contraseña proporcionada con la contraseña almacenada en forma hasheada
  return await bcrypt.compare(contrasena, hashedContrasena);
};




export const deleteUsuario = async (req: Request, res: Response) => {
  const { idUsuario } = req.params;

  try {
    const usuario = await Usuario.findByPk(idUsuario);

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.json({ msg: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el usuario' });
  }
};
