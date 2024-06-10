import { Request, Response } from 'express';
import Electrodomestico from '../models/electrodometisco.model';

// Crear un nuevo electrodoméstico
export const createElectrodomestico = async (req: Request, res: Response) => {
  const { marca, modelo, color, numero_serie, descripcion } = req.body;

  try {
    // Verificar si ya existe un electrodoméstico con el mismo numero_serie
    const electrodomesticoExistente = await Electrodomestico.findOne({ where: { numero_serie } });

    if (electrodomesticoExistente) {
      return res.status(400).json({ msg: 'Ya existe un electrodoméstico con este número de serie' });
    }

    // Crear un nuevo electrodoméstico si no existe
    const nuevoElectrodomestico = await Electrodomestico.create({
      marca,
      modelo,
      color,
      numero_serie,
      descripcion,
    });

    res.status(201).json(nuevoElectrodomestico);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el electrodoméstico' });
  }
};

// Obtener todos los electrodomésticos
export const getElectrodomesticos = async (req: Request, res: Response) => {
  try {
    const electrodomesticos = await Electrodomestico.findAll();
    res.json(electrodomesticos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de electrodomésticos' });
  }
};

// Obtener un electrodoméstico por su ID
export const getElectrodomesticoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const electrodomestico = await Electrodomestico.findByPk(id);
    if (electrodomestico) {
      res.json(electrodomestico);
    } else {
      res.status(404).json({ msg: 'Electrodoméstico no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el electrodoméstico' });
  }
};

// Actualizar un electrodoméstico
export const updateElectrodomestico = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, marca, modelo, color, numero_serie, descripcion } = req.body;

  try {
    const electrodomestico = await Electrodomestico.findByPk(id);
    if (electrodomestico) {
      await electrodomestico.update({ nombre, marca, modelo, color, numero_serie, descripcion });
      res.json({ msg: 'Electrodoméstico actualizado correctamente' });
    } else {
      res.status(404).json({ msg: 'Electrodoméstico no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el electrodoméstico' });
  }
};

// Eliminar un electrodoméstico
export const deleteElectrodomestico = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const electrodomestico = await Electrodomestico.findByPk(id);
    if (electrodomestico) {
      await electrodomestico.destroy();
      res.json({ msg: 'Electrodoméstico eliminado correctamente' });
    } else {
      res.status(404).json({ msg: 'Electrodoméstico no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el electrodoméstico' });
  }
};


export const getUltimoElectrodomestico = async (req: Request, res: Response) => {
  try {
    // Realizar una consulta para obtener el último electrodoméstico ingresado
    const ultimoElectrodomestico = await Electrodomestico.findOne({
      order: [['id', 'DESC']], // Ordenar por ID de forma descendente para obtener el último electrodoméstico ingresado
    });

    res.json(ultimoElectrodomestico);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el último electrodoméstico ingresado' });
  }
};
