import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Usuario from '../models/usuario.model';
import jwt from 'jsonwebtoken'; // Importa el paquete JWT

export const login = async (req: Request, res: Response) => {
  const { usuario, password } = req.body;

  try {
    // Buscar el usuario por nombre de usuario
    const user: any = await Usuario.findOne({ where: { usuario } });

    if (!user) {
      return res.status(404).json({ msg: 'Nombre de usuario incorrecto' });
    }

    // Verificar la contraseña
    const hashedPasswordFromDB = user.get('password');
    const match: any = await bcrypt.compare(password, hashedPasswordFromDB);
    if (!match) {
      return res.status(401).json({ msg: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = jwt.sign({ usuario: usuario }, 'secreto', { expiresIn: '1m' }); // Cambia 'secreto' por tu clave secreta

    // Enviar el token y los detalles del usuario como respuesta
    res.json({ 
      msg: 'Inicio de sesión exitoso',
      token,
      idusuario: user.get('id'),
      permiso: user.get('permiso'),
      usuario: user.get('usuario'),
      empleado: user.get('id_empleado'),
      password: user.get('password')
   


    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error, comuníquese con soporte' });
  }
};