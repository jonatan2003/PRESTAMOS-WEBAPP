import { Request, Response } from 'express';
import TipoPago from '../models/tipo_pago.model';

export const createTipoPago = async (req: Request, res: Response) => {
  const { nombre_tipo } = req.body;

  try {
    const nuevoTipoPago = await TipoPago.create({ nombre_tipo });
    res.status(201).json(nuevoTipoPago);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el tipo de pago' });
  }
};

export const getTiposPago = async (req: Request, res: Response) => {
  try {
    const tiposPago = await TipoPago.findAll();
    res.json(tiposPago);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de tipos de pago' });
  }
};

export const getTipoPagoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tipoPago = await TipoPago.findByPk(id);

    if (!tipoPago) {
      res.status(404).json({ msg: 'Tipo de pago no encontrado' });
    } else {
      res.json(tipoPago);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el tipo de pago' });
  }
};

export const updateTipoPago = async (req: Request, res: Response) => {
  const { body } = req;
  const { id } = req.params;

  try {
    const tipoPago = await TipoPago.findByPk(id);

    if (tipoPago) {
      await tipoPago.update(body);
      res.json({ msg: 'El tipo de pago fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un tipo de pago con el id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el tipo de pago' });
  }
};

export const deleteTipoPago = async (req: Request, res: Response) => {
  const { id} = req.params;

  try {
    const tipoPago = await TipoPago.findByPk(id);

    if (!tipoPago) {
      res.status(404).json({ msg: 'Tipo de pago no encontrado' });
    } else {
      await tipoPago.destroy();
      res.json({ msg: 'Tipo de pago eliminado con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el tipo de pago' });
  }
};
