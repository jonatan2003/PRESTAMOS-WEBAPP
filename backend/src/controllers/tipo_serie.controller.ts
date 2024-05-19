import { Request, Response } from 'express';
import TipoSerie from '../models/tipo_serie.model';

export const createTipoSerie = async (req: Request, res: Response) => {
  const { nombre } = req.body;

  try {
    const nuevoTipoSerie = await TipoSerie.create({ nombre });
    res.status(201).json(nuevoTipoSerie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el Tipo de Serie' });
  }
};

export const getTiposSerie = async (req: Request, res: Response) => {
  try {
    const tiposSerie = await TipoSerie.findAll();
    res.json(tiposSerie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de Tipos de Serie' });
  }
};

export const getTipoSerieById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tipoSerie = await TipoSerie.findByPk(id);

    if (!tipoSerie) {
      res.status(404).json({ msg: 'Tipo de Serie no encontrado' });
    } else {
      res.json(tipoSerie);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el Tipo de Serie' });
  }
};

export const updateTipoSerie = async (req: Request, res: Response) => {
  const { body } = req;
  const { id } = req.params;

  try {
    const tipoSerie = await TipoSerie.findByPk(id);

    if (tipoSerie) {
      await tipoSerie.update(body);
      res.json({ msg: 'El Tipo de Serie fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un Tipo de Serie con el id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el Tipo de Serie' });
  }
};

export const deleteTipoSerie = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tipoSerie = await TipoSerie.findByPk(id);

    if (!tipoSerie) {
      res.status(404).json({ msg: 'Tipo de Serie no encontrado' });
    } else {
      await tipoSerie.destroy();
      res.json({ msg: 'Tipo de Serie eliminado con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el Tipo de Serie' });
  }
};
