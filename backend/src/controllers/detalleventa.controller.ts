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
  const detallesVenta = req.body; // Se espera un array de detalles de venta

  try {
    // Itera sobre cada detalle de venta y créalo en la base de datos
    const nuevosDetallesVenta= await Promise.all(
      detallesVenta.map(async (detalle: any) => {
        const nuevoDetalleVenta = await DetallesVenta.create({
          idventa: detalle.idventa,
          idarticulo: detalle.idarticulo,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          subtotal: detalle.subtotal,
          // Otras propiedades del detalle de venta, si las hay
        });
        return nuevoDetalleVenta;
      })
    );

    res.status(201).json(nuevosDetallesVenta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear los detalles de venta' });
  }
};



export const getDetalleVentaById = async (req: Request, res: Response) => {
  const { idDetalleVenta } = req.params;

  try {
    const detalleVenta = await DetallesVenta.findByPk(idDetalleVenta,{
      include: [
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
        { model: Venta, as: 'Venta',

        include: [
          { model: Empleado, as: 'Empleado' },
          { model: Cliente, as: 'Cliente' },
        
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

export const getDetalleVentaByVentaId = async (req: Request, res: Response) => {
  const { idVenta } = req.params;

  try {
    const detallesVenta = await DetallesVenta.findAll({
      where: { idVenta }, // Busca los detalles de venta que corresponden a la idVenta proporcionada
      include: [
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
        { model: Venta, as: 'Venta',
          include: [
            { model: Empleado, as: 'Empleado' },
            { model: Cliente, as: 'Cliente' },
          ],
        },
      ],
    });

    if (!detallesVenta || detallesVenta.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron detalles de venta para la idVenta proporcionada' });
    } else {
      return res.json(detallesVenta);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error al obtener los detalles de venta' });
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
        { model: Venta, as: 'Venta',

        include: [
          { model: Empleado, as: 'Empleado' },
          { model: Cliente, as: 'Cliente' },
        
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
