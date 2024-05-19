import { Request, Response } from 'express';
import TipoComprobante from '../models/tipo_comprobante.model';
import TipoSerie from '../models/tipo_serie.model';

export const createTipoComprobante = async (req: Request, res: Response) => {
  const { nombre, idserie } = req.body;

  try {
    const nuevoTipoComprobante = await TipoComprobante.create({ nombre, idserie });
    res.status(201).json(nuevoTipoComprobante);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el Tipo de Comprobante' });
  }
};

export const getTiposComprobante = async (req: Request, res: Response) => {
  try {
    const tiposComprobante = await TipoComprobante.findAll({
     include: [   { model: TipoSerie, as: 'TipoSerie' }  ]
    });
    res.json(tiposComprobante);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de Tipos de Comprobante' });
  }
};

export const getTipoComprobanteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tipoComprobante = await TipoComprobante.findByPk(id);

    if (!tipoComprobante) {
      res.status(404).json({ msg: 'Tipo de Comprobante no encontrado' });
    } else {
      res.json(tipoComprobante);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el Tipo de Comprobante' });
  }
};

export const updateTipoComprobante = async (req: Request, res: Response) => {
  const { body } = req;
  const { id } = req.params;

  try {
    const tipoComprobante = await TipoComprobante.findByPk(id);

    if (tipoComprobante) {
      await tipoComprobante.update(body);
      res.json({ msg: 'El Tipo de Comprobante fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un Tipo de Comprobante con el id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el Tipo de Comprobante' });
  }
};

export const deleteTipoComprobante = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tipoComprobante = await TipoComprobante.findByPk(id);

    if (!tipoComprobante) {
      res.status(404).json({ msg: 'Tipo de Comprobante no encontrado' });
    } else {
      await tipoComprobante.destroy();
      res.json({ msg: 'Tipo de Comprobante eliminado con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el Tipo de Comprobante' });
  }
};
