import { Request, Response } from 'express';
import Vehiculo from '../models/vehiculo.model';

// Crear un nuevo vehículo
export const createVehiculo = async (req: Request, res: Response) => {
  const { carroceria, marca, modelo, color, numero_serie, numero_motor, placa, descripcion } = req.body;

  try {
    const nuevoVehiculo = await Vehiculo.create({
      carroceria,
      marca,
      modelo,
      color,
      numero_serie,
      numero_motor,
      placa,
      descripcion,
    });

    res.status(201).json(nuevoVehiculo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el vehículo' });
  }
};

// Obtener todos los vehículos
export const getVehiculos = async (req: Request, res: Response) => {
  try {
    const vehiculos = await Vehiculo.findAll();
    res.json(vehiculos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de vehículos' });
  }
};

// Obtener un vehículo por su ID
export const getVehiculoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const vehiculo = await Vehiculo.findByPk(id);
    if (vehiculo) {
      res.json(vehiculo);
    } else {
      res.status(404).json({ msg: 'Vehículo no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el vehículo' });
  }
};

// Actualizar un vehículo
export const updateVehiculo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { carroceria, marca, modelo, color, numero_serie, numero_motor, placa, descripcion } = req.body;

  try {
    const vehiculo = await Vehiculo.findByPk(id);
    if (vehiculo) {
      await vehiculo.update({ carroceria, marca, modelo, color, numero_serie, numero_motor, placa, descripcion });
      res.json({ msg: 'Vehículo actualizado correctamente' });
    } else {
      res.status(404).json({ msg: 'Vehículo no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el vehículo' });
  }
};

// Eliminar un vehículo
export const deleteVehiculo = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const vehiculo = await Vehiculo.findByPk(id);
    if (vehiculo) {
      await vehiculo.destroy();
      res.json({ msg: 'Vehículo eliminado correctamente' });
    } else {
      res.status(404).json({ msg: 'Vehículo no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el vehículo' });
  }
};

export const getUltimoVehiculo = async (req: Request, res: Response) => {
  try {
    // Realizar una consulta para obtener el último vehículo ingresado
    const ultimoVehiculo = await Vehiculo.findOne({
      order: [['id', 'DESC']], // Ordenar por ID de forma descendente para obtener el último vehículo ingresado
    });

    res.json(ultimoVehiculo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el último vehículo ingresado' });
  }
};
