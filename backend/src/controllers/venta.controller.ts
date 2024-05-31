import { Request, Response } from 'express';
import Venta from '../models/venta.model';
import Empleado from '../models/empleado.model';
import Cliente from '../models/cliente.model';
import Articulo from '../models/articulo.model';
import Categoria from '../models/categoria.model';
import Vehiculo from '../models/vehiculo.model';
import Electrodomestico from '../models/electrodometisco.model';


export const createVenta = async (req: Request, res: Response) => {
  const { idempleado, idcliente,
    fecha_venta,total, tipo_pago } = req.body;

  try {
    // Verificar si el empleado asociado a la venta y el préstamo existen
    const empleadoExistente = await Empleado.findByPk(idempleado);
    const clienteExistente = await Cliente.findByPk(idcliente);

    if (!empleadoExistente || !clienteExistente) {
      return res.status(400).json({ msg: 'El empleado o el cliente especificado no existe' });
    }

    const nuevaVenta = await Venta.create({
      idempleado,
      idcliente,
      fecha_venta,
      total,
      tipo_pago,
    });

    res.status(201).json(nuevaVenta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear la venta' });
  }
};

export const getVentas = async (req: Request, res: Response) => {
  try {
    const ventas = await Venta.findAll({
      include: [
        { model: Empleado, as: 'Empleado' },
        { model: Cliente, as: 'Cliente' },
       
      ],
    });
    res.json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de ventas' });
  }
};

export const getVentaById = async (req: Request, res: Response) => {
  const { idVenta } = req.params;

  try {
    const venta = await Venta.findByPk(idVenta, {
      include: [
        { model: Empleado, as: 'Empleado' },
        { model: Cliente, as: 'Cliente' },
       
      ],
    });

    if (!venta) {
      res.status(404).json({ msg: 'Venta no encontrada' });
    } else {
      res.json(venta);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la venta' });
  }
};

export const updateVenta = async (req: Request, res: Response) => {
  const { body } = req;
  const { idVenta } = req.params;

  try {
    const venta = await Venta.findByPk(idVenta);

    if (venta) {
      // Verificar si el empleado asociado a la venta y el préstamo existen
      if (body.idempleado) {
        const empleadoExistente = await Empleado.findByPk(body.idempleado);
        if (!empleadoExistente) {
          return res.status(400).json({ msg: 'El empleado especificado no existe' });
        }
      }

      if (body.idcliente) {
        const clienteExistente = await Cliente.findByPk(body.idcliente);
        if (!clienteExistente) {
          return res.status(400).json({ msg: 'El cliente especificado no existe' });
        }
      }

      await venta.update(body);
      res.json({ msg: 'La venta fue actualizada con éxito' });
    } else {
      res.status(404).json({ msg: `No existe una venta con el id ${idVenta}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar la venta' });
  }
};

export const deleteVenta = async (req: Request, res: Response) => {
  const { idVenta } = req.params;

  try {
    const venta = await Venta.findByPk(idVenta);

    if (!venta) {
      res.status(404).json({ msg: 'Venta no encontrada' });
    } else {
      await venta.destroy();
      res.json({ msg: 'Venta eliminada con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar la venta' });
  }
};
