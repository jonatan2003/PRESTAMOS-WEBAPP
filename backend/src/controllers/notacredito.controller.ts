import { Request, Response } from 'express';
import NotaCredito from '../models/notacredito.model';

export const createNotaCredito = async (req: Request, res: Response) => {
  const { descripcion } = req.body;

  try {
    const nuevaNotaCredito = await NotaCredito.create({
      descripcion
    });

    res.status(201).json(nuevaNotaCredito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear la nota de crédito' });
  }
};

export const getAllNotasCredito = async (req: Request, res: Response) => {
  try {
    const notasCredito = await NotaCredito.findAll();
    res.json(notasCredito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de notas de crédito' });
  }
};

export const getNotaCreditoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const notaCredito = await NotaCredito.findByPk(id);

    if (!notaCredito) {
      res.status(404).json({ msg: 'Nota de crédito no encontrada' });
    } else {
      res.json(notaCredito);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la nota de crédito' });
  }
};

export const updateNotaCredito = async (req: Request, res: Response) => {
  const { body } = req;
  const { id } = req.params;

  try {
    const notaCredito = await NotaCredito.findByPk(id);

    if (notaCredito) {
      await notaCredito.update(body);
      res.json({ msg: 'La nota de crédito fue actualizada con éxito' });
    } else {
      res.status(404).json({ msg: `No existe una nota de crédito con el id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar la nota de crédito' });
  }
};

export const deleteNotaCredito = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const notaCredito = await NotaCredito.findByPk(id);

    if (!notaCredito) {
      res.status(404).json({ msg: 'Nota de crédito no encontrada' });
    } else {
      await notaCredito.destroy();
      res.json({ msg: 'Nota de crédito eliminada con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar la nota de crédito' });
  }
};
