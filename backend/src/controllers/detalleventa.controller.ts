// Controladores para el modelo Detalle de Venta (detaventa)
import { Request, Response } from 'express';
import DetallesVenta from '../models/detalleventa.model';
import Venta from '../models/venta.model';
import Articulo from '../models/articulo.model';
import Empleado from '../models/empleado.model';
import Cliente from '../models/cliente.model';
import Categoria from '../models/categoria.model';
import Vehiculo from '../models/vehiculo.model';
import Electrodomestico from '../models/electrodometisco.model';

export const createDetalleVenta = async (req: Request, res: Response) => {
  const { idventa, cantidad, precio_unitario,subtotal } = req.body;

  try {
    const nuevoDetalleVenta = await DetallesVenta.create({
      idventa,
      cantidad,
      precio_unitario,
      subtotal,
      
      
    });

    res.status(201).json(nuevoDetalleVenta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el detalle de venta' });
  }
};

export const getDetalleVentaById = async (req: Request, res: Response) => {
  const { idDetalleVenta } = req.params;

  try {
    const detalleVenta = await DetallesVenta.findByPk(idDetalleVenta,{
      include: [
        { model: Venta, as: 'Venta',
        include: [
          { model: Empleado, as: 'Empleado' },
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
         },
        
      ],
    });

    if (!detalleVenta) {
      res.status(404).json({ msg: 'Detalle de venta no encontrado' });
    } else {
      res.json(detalleVenta);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el detalle de venta' });
  }
};

export const updateDetalleVenta = async (req: Request, res: Response) => {
  const { body } = req;
  const { idDetalleVenta } = req.params;

  try {
    const detalleVenta = await DetallesVenta.findByPk(idDetalleVenta);

    if (detalleVenta) {
      await detalleVenta.update(body);
      res.json({ msg: 'El detalle de venta fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un detalle de venta con el id ${idDetalleVenta}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el detalle de venta' });
  }
};

export const deleteDetalleVenta = async (req: Request, res: Response) => {
  const { idDetalleVenta } = req.params;

  try {
    const detalleVenta = await DetallesVenta.findByPk(idDetalleVenta);

    if (!detalleVenta) {
      res.status(404).json({ msg: 'Detalle de venta no encontrado' });
    } else {
      await detalleVenta.destroy();
      res.json({ msg: 'Detalle de venta eliminado con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el detalle de venta' });
  }
};

export const getDetallesVenta = async (req: Request, res: Response) => {
  try {
    const detallesVenta = await DetallesVenta.findAll({
      include: [
        { model: Venta, as: 'Venta',
        include: [
          { model: Empleado, as: 'Empleado' },
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
         },
        
      ],
    });
    res.json(detallesVenta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de detalles de venta' });
  }
};
