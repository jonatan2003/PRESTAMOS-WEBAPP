import { Request, Response } from 'express';
import Inventario from '../models/inventario.model';
import Articulo from '../models/articulo.model';
import Categoria from '../models/categoria.model';
import Vehiculo from '../models/vehiculo.model';
import Electrodomestico from '../models/electrodometisco.model';

export const createInventario = async (req: Request, res: Response) => {
  const { idarticulo, stock, estado_articulo, valor_venta, valor_precio } = req.body;

  try {
    // Verificar si el artículo asociado al inventario existe
    const articuloExistente = await Articulo.findByPk(idarticulo);

    if (!articuloExistente) {
      return res.status(400).json({ msg: 'El artículo especificado no existe' });
    }

    const nuevoInventario = await Inventario.create({
      idarticulo,
      stock,
      estado_articulo,
      valor_venta,
      valor_precio,
    });

    res.status(201).json(nuevoInventario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el inventario' });
  }
};

export const getInventarios = async (req: Request, res: Response) => {
  try {
    const inventarios = await Inventario.findAll({
      include: [
        { model: Articulo, as: 'Articulo',
        include: [
            { model: Categoria, as: 'Categoria' },
            { model: Vehiculo, as: 'Vehiculo' },
            { model: Electrodomestico, as: 'Electrodomestico' }
          ],
         },
      ],
    });
    res.json(inventarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de inventarios' });
  }
};

export const getInventarioById = async (req: Request, res: Response) => {
  const { id} = req.params;

  try {
    const inventario = await Inventario.findByPk(id, {
      include: [
        { model: Articulo, as: 'Articulo',
        include: [
            { model: Categoria, as: 'Categoria' },
            { model: Vehiculo, as: 'Vehiculo' },
            { model: Electrodomestico, as: 'Electrodomestico' }
          ],
         },
      ],
    });

    if (!inventario) {
      res.status(404).json({ msg: 'Inventario no encontrado' });
    } else {
      res.json(inventario);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el inventario' });
  }
};

export const updateInventario = async (req: Request, res: Response) => {
  const { body } = req;
  const { id } = req.params;

  try {
    const inventario = await Inventario.findByPk(id);

    if (inventario) {
      if (body.idarticulo) {
        const articuloExistente = await Articulo.findByPk(body.idarticulo);
        if (!articuloExistente) {
          return res.status(400).json({ msg: 'El artículo especificado no existe' });
        }
      }

      await inventario.update(body);
      res.json({ msg: 'El inventario fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un inventario con el id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el inventario' });
  }
};

export const deleteInventario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const inventario = await Inventario.findByPk(id);

    if (!inventario) {
      res.status(404).json({ msg: 'Inventario no encontrado' });
    } else {
      await inventario.destroy();
      res.json({ msg: 'Inventario eliminado con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el inventario' });
  }
};
