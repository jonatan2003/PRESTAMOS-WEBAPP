import { Request, Response } from 'express';
import CronogramaPagos from '../models/cronograma_pagos.model';
import Prestamo from '../models/prestamo.model';
import Cliente from '../models/cliente.model';
import Articulo from '../models/articulo.model';
import Categoria from '../models/categoria.model';
import Vehiculo from '../models/vehiculo.model';
import Electrodomestico from '../models/electrodometisco.model';

export const createCronogramaPago = async (req: Request, res: Response) => {
  const { id_prestamo, fecha_vencimiento, monto, monto_pagado } = req.body;

  try {
    const nuevoPago = await CronogramaPagos.create({
      id_prestamo,
      fecha_vencimiento,
      monto,
      monto_pagado,
    });

    res.status(201).json(nuevoPago);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el pago' });
  }
};

export const getCronogramaPagos = async (req: Request, res: Response) => {
  try {
    const pagos = await CronogramaPagos.findAll({
      include: [
        { 
          model: Prestamo, 
          as: 'Prestamo',
          include: [
            { model: Cliente, as: 'Cliente' },
            { 
              model: Articulo, 
              as: 'Articulo',
              include: [
                { 
                  model: Categoria, 
                  as: 'Categoria' 
                },
                { 
                  model: Vehiculo, 
                  as: 'Vehiculo' 
                },
                { 
                  model: Electrodomestico, 
                  as: 'Electrodomestico' 
                },
              ]
            },
          ],
        }
      ],
    });
    res.json(pagos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de pagos' });
  }
};

export const getCronogramaPagoByIdPrestamo = async (req: Request, res: Response) => {
  const { id_prestamo } = req.params;

  try {
    const pagos = await CronogramaPagos.findAll({
      include: [
        { 
          model: Prestamo, 
          as: 'Prestamo',
          include: [
            { model: Cliente, as: 'Cliente' },
            { 
              model: Articulo, 
              as: 'Articulo',
              include: [
                { 
                  model: Categoria, 
                  as: 'Categoria' 
                },
                { 
                  model: Vehiculo, 
                  as: 'Vehiculo' 
                },
                { 
                  model: Electrodomestico, 
                  as: 'Electrodomestico' 
                },
              ]
            },
          ],
        }
      ],
      where: { id_prestamo }
    });

    if (!pagos.length) {
      res.status(404).json({ msg: 'Pagos no encontrados para el préstamo especificado' });
    } else {
      res.json(pagos);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los pagos' });
  }
};

export const updateCronogramaPago = async (req: Request, res: Response) => {
  const { body } = req;
  const { id } = req.params;

  try {
    const pago = await CronogramaPagos.findByPk(id);

    if (pago) {
      await pago.update(body);
      res.json({ msg: 'El pago fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un pago con el id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el pago' });
  }
};

export const deleteCronogramaPago = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pago = await CronogramaPagos.findByPk(id);

    if (!pago) {
      res.status(404).json({ msg: 'Pago no encontrado' });
    } else {
      await pago.destroy();
      res.json({ msg: 'Pago eliminado con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el pago' });
  }
};
