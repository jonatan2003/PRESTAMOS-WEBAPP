import { Request, Response } from 'express';
import Cliente from '../models/cliente.model';
import { Op } from 'sequelize'; // Agregar esta línea


export const createCliente = async (req: Request, res: Response) => {
  const { nombre, apellido, direccion, dni, ruc, razon_social, telefono, rubro } = req.body;

  try {
    // Construir condiciones dinámicamente
    let condiciones: any = {};

    if (dni && dni !== 'no') {
      condiciones.dni = dni;
    } else if (ruc && ruc !== 'no') {
      condiciones.ruc = ruc;
    } else {
      return res.status(400).json({ msg: 'Debe proporcionar al menos DNI o RUC' });
    }

    // Verificar si ya existe un cliente con el mismo DNI o RUC
    const clienteExistente = await Cliente.findOne({
      where: condiciones
    });

    if (clienteExistente) {
      return res.status(400).json({ msg: 'Ya existe un cliente con el mismo DNI o RUC' });
    }

    // Crear el nuevo cliente
    const nuevoCliente = await Cliente.create({
      nombre,
      apellido,
      direccion,
      dni,
      ruc,
      razon_social,
      telefono,
      rubro
    });

    // Devolver el nuevo cliente creado
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el cliente' });
  }
};

export const getClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de clientes' });
  }
};

export const getClienteById = async (req: Request, res: Response) => {
  const { idCliente } = req.params;

  try {
    const cliente = await Cliente.findByPk(idCliente);

    if (!cliente) {
      res.status(404).json({ msg: 'Cliente no encontrado' });
    } else {
      res.json(cliente);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el cliente' });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  const { body } = req;
  const { idCliente } = req.params;

  try {
    const cliente = await Cliente.findByPk(idCliente);

    if (cliente) {
      await cliente.update(body);
      res.json({ msg: 'El cliente fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un cliente con el id ${idCliente}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el cliente' });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  const { idCliente } = req.params;

  try {
    const cliente = await Cliente.findByPk(idCliente);

    if (!cliente) {
      res.status(404).json({ msg: 'Cliente no encontrado' });
    } else {
      await cliente.destroy();
      res.json({ msg: 'Cliente eliminado con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el cliente' });
  }
};


export const searchClientes = async (req: Request, res: Response) => {
  const { searchTerm } = req.query;

  try {
    const clientes = await Cliente.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.like]: `%${searchTerm}%` } },
          { apellido: { [Op.like]: `%${searchTerm}%` } },
          { direccion: { [Op.like]: `%${searchTerm}%` } },
          { dni: { [Op.like]: `%${searchTerm}%` } },
          { telefono: { [Op.like]: `%${searchTerm}%` } },
        ],
      },
    });

    if (clientes.length === 0) {
      // No se encontraron clientes
      res.status(404).json({ msg: 'No se encontraron clientes que coincidan con el término de búsqueda' });
    } else {
      // Se encontraron clientes
      res.json(clientes);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al realizar la búsqueda de clientes' });
  }
};