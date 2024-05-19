// Controladores para el modelo Pago (Pago)
import { Request, Response } from 'express';
import Pago from '../models/pago.model';
import TipoPago from '../models/tipo_pago.model';

export const createPago = async (req: Request, res: Response) => {
  const { id_tipopago, fecha_pago, interes_pago, monto_restante, capital_pago } = req.body;

  try {
    const nuevoPago = await Pago.create({
      id_tipopago,
      fecha_pago,
      interes_pago,
      monto_restante,
      capital_pago,
    });

    res.status(201).json(nuevoPago);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el Pago' });
  }
};

export const getPagos = async (req: Request, res: Response) => {
  try {
    const pagos = await Pago.findAll(
    
      {
        include: [
          { model: TipoPago, as: 'TipoPago',
           },
        ],
      });
    res.json(pagos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de Pagos' });
  }
};

export const getPagoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pago = await Pago.findByPk(id,
      {
        include: [
          { model: TipoPago, as: 'TipoPago',
           },
        ],
      });

    if (!pago) {
      res.status(404).json({ msg: 'Pago no encontrado' });
    } else {
      res.json(pago);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el Pago' });
  }
};

export const updatePago = async (req: Request, res: Response) => {
  const { body } = req;
  const { idPago } = req.params;

  try {
    const pago = await Pago.findByPk(idPago);

    if (pago) {
      await pago.update(body);
      res.json({ msg: 'El pago fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un pago con el id ${idPago}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el Pago' });
  }
};

export const deletePago = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pago = await Pago.findByPk(id);

    if (!pago) {
      res.status(404).json({ msg: 'Pago no encontrado' });
    } else {
      await pago.destroy();
      res.json({ msg: 'Pago eliminado con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el Pago' });
  }
};
