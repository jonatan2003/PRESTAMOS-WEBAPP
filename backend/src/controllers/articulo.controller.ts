import { Request, Response } from 'express';
import Articulo from '../models/articulo.model';
import Categoria from '../models/categoria.model';
import Vehiculo from '../models/vehiculo.model';
import Electrodomestico from '../models/electrodometisco.model';
import { Op } from 'sequelize';

// Crear un nuevo artículo
export const createArticulo = async (req: Request, res: Response) => {
  const { idcategoria, idvehiculo, idelectrodomestico, observaciones, estado, numero_serie } = req.body;

  try {
    // Verificar si la categoría asociada al artículo existe
    const categoriaExistente = await Categoria.findByPk(idcategoria);
    if (!categoriaExistente) {
      return res.status(400).json({ msg: 'La categoría especificada no existe' });
    }

    // Verificar si el vehículo asociado al artículo existe
    if (idvehiculo) {
      const vehiculoExistente = await Vehiculo.findByPk(idvehiculo);
      if (!vehiculoExistente) {
        return res.status(400).json({ msg: 'El vehículo especificado no existe' });
      }
    }

    // Verificar si el electrodoméstico asociado al artículo existe
    if (idelectrodomestico) {
      const electrodomesticoExistente = await Electrodomestico.findByPk(idelectrodomestico);
      if (!electrodomesticoExistente) {
        return res.status(400).json({ msg: 'El electrodoméstico especificado no existe' });
      }
    }

    const nuevoArticulo = await Articulo.create({
      idcategoria,
      idvehiculo,
      idelectrodomestico,
      observaciones,
      estado,
      numero_serie
    });

    res.status(201).json(nuevoArticulo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el artículo' });
  }
};

// Obtener todos los artículos
export const getArticulos = async (req: Request, res: Response) => {
  try {
    const articulos = await Articulo.findAll({
      include: [
        { model: Categoria, as: 'Categoria' },
        { model: Vehiculo, as: 'Vehiculo' },
        { model: Electrodomestico, as: 'Electrodomestico' }
      ]
    });
    res.json(articulos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de artículos' });
  }
};

// Obtener un artículo por su ID
export const getArticuloById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const articulo = await Articulo.findByPk(id, {
      include: [
        { model: Categoria, as: 'Categoria' },
        { model: Vehiculo, as: 'Vehiculo' },
        { model: Electrodomestico, as: 'Electrodomestico' }
      ]
    });

    if (!articulo) {
      return res.status(404).json({ msg: 'Artículo no encontrado' });
    }

    res.json(articulo);
  } catch (error) {
    console.error('Error al obtener el artículo:', error);
    res.status(500).json({ msg: 'Error al obtener el artículo' });
  }
};

// Actualizar un artículo
export const updateArticulo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { idcategoria, idvehiculo, idelectrodomestico, estado } = req.body;

  try {
    const articulo = await Articulo.findByPk(id);
    if (articulo) {
      const updateData: any = {};

      // Verificar si la categoría asociada al artículo existe
      if (idcategoria) {
        const categoriaExistente = await Categoria.findByPk(idcategoria);
        if (!categoriaExistente) {
          return res.status(400).json({ msg: 'La categoría especificada no existe' });
        }
        updateData.idcategoria = idcategoria;
      }

      // Verificar si el vehículo asociado al artículo existe
      if (idvehiculo) {
        const vehiculoExistente = await Vehiculo.findByPk(idvehiculo);
        if (!vehiculoExistente) {
          return res.status(400).json({ msg: 'El vehículo especificado no existe' });
        }
        updateData.idvehiculo = idvehiculo;
      }

      // Verificar si el electrodoméstico asociado al artículo existe
      if (idelectrodomestico) {
        const electrodomesticoExistente = await Electrodomestico.findByPk(idelectrodomestico);
        if (!electrodomesticoExistente) {
          return res.status(400).json({ msg: 'El electrodoméstico especificado no existe' });
        }
        updateData.idelectrodomestico = idelectrodomestico;
      }

      // Actualizar estado si está presente en el request body
      if (estado) {
        updateData.estado = estado;
      }

      // Actualizar artículo solo con los campos proporcionados
      await articulo.update(updateData);
      res.json({ msg: 'Artículo actualizado correctamente' });
    } else {
      res.status(404).json({ msg: 'Artículo no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el artículo' });
  }
};

// Eliminar un artículo
export const deleteArticulo = async (req: Request, res: Response) => {
  const { idArticulo } = req.params; // El nombre de parámetro debe coincidir con el especificado en la ruta

  try {
    const articulo = await Articulo.findByPk(idArticulo);
    if (articulo) {
      await articulo.destroy();
      res.json({ msg: 'Artículo eliminado correctamente' });
    } else {
      res.status(404).json({ msg: 'Artículo no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el artículo' });
  }
};


export const getArticulosVehiculo = async (req: Request, res: Response) => {
  try {
    const articulos = await Articulo.findAll({
      where: {
        idvehiculo: { [Op.not]: null } // Filtrar artículos que tengan un vehículo asociado
      },
      include: [{ model: Vehiculo, as: 'Vehiculo' }]
    });
    res.json(articulos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de artículos de categoría vehículo' });
  }
};

// Método para obtener artículos de categoría electrodoméstico
export const getArticulosElectrodomestico = async (req: Request, res: Response) => {
  try {
    const articulos = await Articulo.findAll({
      where: {
        idelectrodomestico: { [Op.not]: null } // Filtrar artículos que tengan un electrodoméstico asociado
      },
      include: [{ model: Electrodomestico, as: 'Electrodomestico' }]
    });
    res.json(articulos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de artículos de categoría electrodoméstico' });
  }
};


