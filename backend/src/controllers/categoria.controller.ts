import { Request, Response } from 'express';
import Categoria from '../models/categoria.model';

export const createCategoria = async (req: Request, res: Response) => {
  const { nombre } = req.body;

  try {
    const nuevaCategoria = await Categoria.create({
      nombre,
    });

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear la categoría' });
  }
};

export const getCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de categorías' });
  }
};

export const getCategoriaById = async (req: Request, res: Response) => {
  const { idCategoria } = req.params;

  try {
    const categoria = await Categoria.findByPk(idCategoria);

    if (!categoria) {
      res.status(404).json({ msg: 'Categoría no encontrada' });
    } else {
      res.json(categoria);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la categoría' });
  }
};

export const updateCategoria = async (req: Request, res: Response) => {
  const { body } = req;
  const { idCategoria } = req.params;

  try {
    const categoria = await Categoria.findByPk(idCategoria);

    if (categoria) {
      await categoria.update(body);
      res.json({ msg: 'La categoría fue actualizada con éxito' });
    } else {
      res.status(404).json({ msg: `No existe una categoría con el id ${idCategoria}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar la categoría' });
  }
};

export const deleteCategoria = async (req: Request, res: Response) => {
  const { idCategoria } = req.params;

  try {
    const categoria = await Categoria.findByPk(idCategoria);

    if (!categoria) {
      res.status(404).json({ msg: 'Categoría no encontrada' });
    } else {
      await categoria.destroy();
      res.json({ msg: 'Categoría eliminada con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar la categoría' });
  }
};
