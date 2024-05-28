import { Request, Response } from 'express';
import Prestamo from '../models/prestamo.model';
import Cliente from '../models/cliente.model';
import Empleado from '../models/empleado.model';
import Articulo from '../models/articulo.model';
import DetallePrestamo from '../models/pago.model';
import Categoria from '../models/categoria.model';
import Vehiculo from '../models/vehiculo.model';
import Electrodomestico from '../models/electrodometisco.model';
import { Op } from 'sequelize';


export const createPrestamo = async (req: Request, res: Response) => {
  const { idcliente, idarticulo,  fecha_prestamo, fecha_devolucion, monto_prestamo, monto_pago,estado } = req.body;

  try {
    // Verificar si el cliente, el empleado y el artículo asociados al préstamo existen
    const clienteExistente = await Cliente.findByPk(idcliente);
    const articuloExistente = await Articulo.findByPk(idarticulo);

    if (!clienteExistente || !articuloExistente) {
      return res.status(400).json({ msg: 'El cliente, el empleado o el artículo especificados no existen' });
    }

    const nuevoPrestamo = await Prestamo.create({
      idcliente,
      idarticulo,
      fecha_prestamo,
      fecha_devolucion,
      monto_prestamo,
      monto_pago,
      estado
    });

    res.status(201).json(nuevoPrestamo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el préstamo' });
  }
};

export const getPrestamos = async (req: Request, res: Response) => {
  try {
    const prestamos = await Prestamo.findAll({
      include: [
        { model: Cliente, as: 'Cliente' },
        { model: Articulo, as: 'Articulo',
        include: [
          { 
            model: Categoria, // Relación con la tabla de Artículos
            as: 'Categoria' // Alias para la relación de Artículo
          },
          { 
            model: Vehiculo, // Relación con la tabla de Artículos
            as: 'Vehiculo' // Alias para la relación de Artículo
          },
          { 
            model: Electrodomestico, // Relación con la tabla de Artículos
            as: 'Electrodomestico' // Alias para la relación de Artículo
          },
        ]

         },
      ],
    });
    res.json(prestamos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de préstamos' });
  }
};

export const getPrestamoById = async (req: Request, res: Response) => {
  const { idPrestamo } = req.params;

  try {
    const prestamo = await Prestamo.findByPk(idPrestamo, {
      include: [
        { model: Cliente, as: 'Cliente' },
        { model: Articulo, as: 'Articulo' ,
        include: [
          { 
            model: Categoria, // Relación con la tabla de Artículos
            as: 'Categoria' // Alias para la relación de Artículo
          },
          { 
            model: Vehiculo, // Relación con la tabla de Artículos
            as: 'Vehiculo' // Alias para la relación de Artículo
          },
          { 
            model: Electrodomestico, // Relación con la tabla de Artículos
            as: 'Electrodomestico' // Alias para la relación de Artículo
          },
        ]
        },
      ],
    });

    if (!prestamo) {
      res.status(404).json({ msg: 'Préstamo no encontrado' });
    } else {
      res.json(prestamo);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el préstamo' });
  }
};

export const updatePrestamo = async (req: Request, res: Response) => {
  const { body } = req;
  const { idPrestamo } = req.params;

  try {
    const prestamo = await Prestamo.findByPk(idPrestamo);

    if (prestamo) {
      // Verificar si el cliente, el empleado y el artículo asociados al préstamo existen
      if (body.idcliente) {
        const clienteExistente = await Cliente.findByPk(body.idcliente);
        if (!clienteExistente) {
          return res.status(400).json({ msg: 'El cliente especificado no existe' });
        }
      }

      if (body.idempleado) {
        const empleadoExistente = await Empleado.findByPk(body.idempleado);
        if (!empleadoExistente) {
          return res.status(400).json({ msg: 'El empleado especificado no existe' });
        }
      }

      if (body.idarticulo) {
        const articuloExistente = await Articulo.findByPk(body.idarticulo);
        if (!articuloExistente) {
          return res.status(400).json({ msg: 'El artículo especificado no existe' });
        }
      }

      await prestamo.update(body);
      res.json({ msg: 'El préstamo fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un préstamo con el id ${idPrestamo}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el préstamo' });
  }
};


export const deletePrestamo = async (req: Request, res: Response) => {
  const { idPrestamo } = req.params;

  try {
    const prestamo = await Prestamo.findByPk(idPrestamo);

    if (!prestamo) {
      res.status(404).json({ msg: 'Préstamo no encontrado' });
    } else {
      await prestamo.destroy();
      res.json({ msg: 'Préstamo eliminado con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el préstamo' });
  }
};


export const getPrestamosPorEstadoDetalle = async (req: Request, res: Response) => {
  const { estadoDetalle } = req.params;

  try {
    // Realizar una consulta con join para obtener los préstamos basados en el estado de detalle
    const prestamos = await Prestamo.findAll({
      include: [
        {
          model: DetallePrestamo,
          as: 'DetallePrestamo',
          where: { estado_detalle: estadoDetalle },
        },
      ],
    });

    res.json(prestamos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los préstamos por estado de detalle' });
  }
};


export const getUltimoPrestamoIngresado = async (req: Request, res: Response) => {
  try {
    // Realizar una consulta para obtener el último préstamo ingresado
    const ultimoPrestamo = await Prestamo.findOne({
      include: [
        { model: Cliente, as: 'Cliente' },
        { model: Articulo, as: 'Articulo',
        include: [
          { 
            model: Categoria, // Relación con la tabla de Artículos
            as: 'Categoria' // Alias para la relación de Artículo
          },
          { 
            model: Vehiculo, // Relación con la tabla de Artículos
            as: 'Vehiculo' // Alias para la relación de Artículo
          },
          { 
            model: Electrodomestico, // Relación con la tabla de Artículos
            as: 'Electrodomestico' // Alias para la relación de Artículo
          },
        ]
         },
      ],
      order: [['id', 'DESC']], // Ordenar por fecha de creación de forma descendente
      limit: 1, // Limitar los resultados a uno
    });

    res.json(ultimoPrestamo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el último préstamo ingresado' });
  }
};

export const getPrestamosPorArticuloVehiculo = async (req: Request, res: Response) => {
  try {
    const prestamos = await Prestamo.findAll({
      include: [
        {
          model: Articulo,
          as: 'Articulo',
          include: [{ model: Vehiculo, as: 'Vehiculo' }],
          where: {
            idvehiculo: { [Op.not]: null } // Filtrar artículos que tengan un vehículo asociado
          }
        }
      ]
    });
    res.json(prestamos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los préstamos por artículo vehículo' });
  }
};

// Obtener préstamos por artículo electrodoméstico
export const getPrestamosPorArticuloElectrodomestico = async (req: Request, res: Response) => {
  try {
    const prestamos = await Prestamo.findAll({
      include: [
        {
          model: Articulo,
          as: 'Articulo',
          include: [{ model: Electrodomestico, as: 'Electrodomestico' }],
          where: {
            idelectrodomestico: { [Op.not]: null } // Filtrar artículos que tengan un electrodoméstico asociado
          }
        }
      ]
    });
    res.json(prestamos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los préstamos por artículo electrodoméstico' });
  }
};

export const getPrestamosVencidos = async (req: Request, res: Response) => {
  try {
    const hoy  = new Date(); // Obtener la fecha actual
    const prestamosVencidos = await Prestamo.findAll({
      where: {
        fecha_devolucion: {
          [Op.lt]: hoy // Obtener los préstamos donde la fecha de devolución es anterior a la fecha actual
        }
      },
      include: [
        { model: Cliente, as: 'Cliente' },
        { model: Empleado, as: 'Empleado' },
        { model: Articulo, as: 'Articulo',
          include: [
            { 
              model: Categoria,
              as: 'Categoria'
            },
            { 
              model: Vehiculo,
              as: 'Vehiculo'
            },
            { 
              model: Electrodomestico,
              as: 'Electrodomestico'
            },
          ]
        },
      ],
    });

    res.json(prestamosVencidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los préstamos vencidos' });
  }
};