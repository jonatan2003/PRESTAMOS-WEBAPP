import { Request, Response } from 'express';
import Boleta from '../models/boleta.model';
import DetalleVenta from '../models/detalleventa.model';
import Venta from '../models/venta.model';
import Cliente from '../models/cliente.model';
import Empleado from '../models/empleado.model';
import Articulo from '../models/articulo.model';
import Categoria from '../models/categoria.model';
import Vehiculo from '../models/vehiculo.model';
import Electrodomestico from '../models/electrodometisco.model';


export const createBoleta = async (req: Request, res: Response) => {
    const { igv, descuento, iddetalleventa } = req.body;
  
    try {
  
   // Verificar si el prestamo asociados al Pago existen
   const detalleventaExistente = await DetalleVenta.findByPk(iddetalleventa);
  
   if (!detalleventaExistente ) {
     return res.status(400).json({ msg: 'El DetalleVenta especificados no existen' });
   }
  
      const nuevoBoleta = await Boleta.create({
        igv, 
        descuento, 
        iddetalleventa,
      });
  
      res.status(201).json(nuevoBoleta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Ocurrió un error al crear el Boleta' });
    }
  };


  export const getBoletas = async (req: Request, res: Response) => {
    try {
      const boletas = await Boleta.findAll({
        include: [
          { 
            model: DetalleVenta, 
            as: 'Detalleventa',
            include: [
              { 
                model: Venta, 
                as: 'Venta',
                include: [
                  { model: Empleado, as: 'Empleado' },
                  { model: Cliente, as: 'Cliente' },
                  { 
                    model: Articulo, 
                    as: 'Articulo',
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
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });
      res.json(boletas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener la lista de Boletas' });
    }
  };

  export const getBoletaById = async (req: Request, res: Response) => {
    const { idBoleta } = req.params;
  
    try {
      const boleta = await Boleta.findByPk(idBoleta,{
        include: [
          { model: DetalleVenta, as: 'DetalleVenta' }
         
        ],
      });
  
      if (!boleta) {
        res.status(404).json({ msg: 'Boleta no encontrado' });
      } else {
        res.json(boleta);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener el Boleta' });
    }
  };


  
export const updateBoleta = async (req: Request, res: Response) => {
    const { body } = req;
    const { idBoleta } = req.params;
  
    try {
      const boleta = await Boleta.findByPk(idBoleta);
  
      if (boleta) {
        // Verificar si el prestamo asociados al préstamo existen
        if (body.iddetalleventa) {
          const detalleventaExistente = await Boleta.findByPk(body.iddetalleventa);
          if (!detalleventaExistente) {
            return res.status(400).json({ msg: 'El detalleventa especificado no existe' });
          }
        }
  
        await boleta.update(body);
        res.json({ msg: 'El boleta fue actualizado con éxito' });
      } else {
        res.status(404).json({ msg: `No existe un boleta con el id ${idBoleta}` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Ocurrió un error al actualizar el Boleta' });
    }
  };



  
export const deleteBoleta = async (req: Request, res: Response) => {
    const { idBoleta } = req.params;
  
    try {
      const boleta = await Boleta.findByPk(idBoleta);
  
      if (!boleta) {
        res.status(404).json({ msg: 'Boleta no encontrado' });
      } else {
        await boleta.destroy();
        res.json({ msg: 'Boleta eliminado con éxito' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al eliminar el Boleta' });
    }
  };