import { Request, Response } from 'express';
import ComprobanteVenta from '../models/comprobante_venta.model';
import TipoComprobante from '../models/tipo_comprobante.model';
import DetalleVenta from '../models/detalleventa.model';
import Venta from '../models/venta.model';
import Empleado from '../models/empleado.model';
import Cliente from '../models/cliente.model';
import Articulo from '../models/articulo.model';
import Categoria from '../models/categoria.model';
import Vehiculo from '../models/vehiculo.model';
import Electrodomestico from '../models/electrodometisco.model';

export const createComprobanteVenta = async (req: Request, res: Response) => {
  const { igv, descuento, idventa, idtipo_comprobante, num_serie } = req.body;

  try {
    const nuevoComprobanteVenta = await ComprobanteVenta.create({ igv, descuento, idventa, idtipo_comprobante, num_serie });
    res.status(201).json(nuevoComprobanteVenta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el Comprobante de Venta' });
  }
};
export const getComprobantesVenta = async (req: Request, res: Response) => {
    try {
      const comprobantesVenta = await ComprobanteVenta.findAll({
        include: [
          { 
            model: TipoComprobante, 
            as: 'TipoComprobante' 
          },
              { 
                model: Venta, 
                as: 'Venta',
                include: [
                  { 
                    model: Empleado, 
                    as: 'Empleado' 
                  },
                  { 
                    model: Cliente, 
                    as: 'Cliente' 
                  },
                 
                ],
              },
             
        
        ],
      });
      res.json(comprobantesVenta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener la lista de Comprobantes de Venta' });
    }
  };
  
export const getComprobanteVentaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const comprobanteVenta = await ComprobanteVenta.findByPk(id, {
      include: [
        { 
          model: TipoComprobante, 
          as: 'TipoComprobante' 
        },
            { 
              model: Venta, 
              as: 'Venta',
              include: [
                { 
                  model: Empleado, 
                  as: 'Empleado' 
                },
                { 
                  model: Cliente, 
                  as: 'Cliente' 
                },
               
              ],
            },
           
      
      ],
    });

    if (!comprobanteVenta) {
      res.status(404).json({ msg: 'Comprobante de Venta no encontrado' });
    } else {
      res.json(comprobanteVenta);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el Comprobante de Venta' });
  }
};


export const getComprobanteVentaByIdVenta = async (req: Request, res: Response) => {
  const { idventa } = req.params;

  try {
    const comprobanteVenta = await ComprobanteVenta.findOne({
      where: { idventa },
      include: [
        { 
          model: TipoComprobante, 
          as: 'TipoComprobante' 
        },
        { 
          model: Venta, 
          as: 'Venta',
          include: [
            { 
              model: Empleado, 
              as: 'Empleado' 
            },
            { 
              model: Cliente, 
              as: 'Cliente' 
            },
           
          ],
        }
      ],
    });

    if (!comprobanteVenta) {
      res.status(404).json({ msg: 'Comprobante de Venta no encontrado' });
    } else {
      res.json(comprobanteVenta);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el Comprobante de Venta' });
  }
};


export const updateComprobanteVenta = async (req: Request, res: Response) => {
  const { body } = req;
  const { id } = req.params;

  try {
    const comprobanteVenta = await ComprobanteVenta.findByPk(id);

    if (comprobanteVenta) {
      await comprobanteVenta.update(body);
      res.json({ msg: 'El Comprobante de Venta fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un Comprobante de Venta con el id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el Comprobante de Venta' });
  }
};

export const deleteComprobanteVenta = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const comprobanteVenta = await ComprobanteVenta.findByPk(id);

    if (!comprobanteVenta) {
      res.status(404).json({ msg: 'Comprobante de Venta no encontrado' });
    } else {
      await comprobanteVenta.destroy();
      res.json({ msg: 'Comprobante de Venta eliminado con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el Comprobante de Venta' });
  }
};
