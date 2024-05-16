// Controladores para el modelo Pago (Pago)
import { Request, Response } from 'express';
import Pago from '../models/pago.model';
import Prestamo from '../models/prestamo.model';
import Cliente from '../models/cliente.model';
import Empleado from '../models/empleado.model';
import Articulo from '../models/articulo.model';
import Categoria from '../models/categoria.model';
import Vehiculo from '../models/vehiculo.model';
import Electrodomestico from '../models/electrodometisco.model';

export const createPago = async (req: Request, res: Response) => {
  const { idprestamo, tipo_pago, fecha_pago,interes_pago,monto_restante,capital_pago } = req.body;

  try {

 // Verificar si el prestamo asociados al Pago existen
 const prestamoExistente = await Prestamo.findByPk(idprestamo);

 if (!prestamoExistente ) {
   return res.status(400).json({ msg: 'El Prestamo especificados no existen' });
 }

    const nuevoPago = await Pago.create({
      idprestamo, 
      tipo_pago, 
      fecha_pago,
      interes_pago,
      monto_restante,
      capital_pago,
    });

    res.status(201).json(nuevoPago);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el Pago' });
  }
};

export const getPagos = async (req: Request, res: Response) => {
  try {
    const pagos = await Pago.findAll({
      include: [
        { model: Prestamo, as: 'Prestamo',
        include: [ { model: Cliente, as: 'Cliente'},
        { model: Empleado, as: 'Empleado' },
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
        }
         
        ]



         }
       
      ],
    });
    res.json(pagos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de Pagos' });
  }
};


export const getPagoById = async (req: Request, res: Response) => {
  const { idPago } = req.params;

  try {
    const pago = await Pago.findByPk(idPago,{
      include: [
        { model: Prestamo, as: 'Prestamo',
        include: [ { model: Cliente, as: 'Cliente'},
        { model: Empleado, as: 'Empleado' },
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
        }
         
        ]



         }
       
      ],
    });

    if (!pago) {
      res.status(404).json({ msg: 'Pago no encontrado' });
    } else {
      res.json(pago);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el Pago' });
  }
};

export const updatePago = async (req: Request, res: Response) => {
  const { body } = req;
  const { idPago } = req.params;

  try {
    const pago = await Pago.findByPk(idPago);

    if (pago) {
      // Verificar si el prestamo asociados al préstamo existen
      if (body.idprestamo) {
        const prestamoExistente = await Pago.findByPk(body.idprestamo);
        if (!prestamoExistente) {
          return res.status(400).json({ msg: 'El prestamo especificado no existe' });
        }
      }

      await pago.update(body);
      res.json({ msg: 'El pago fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un pago con el id ${idPago}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el Pago' });
  }
};

export const deletePago = async (req: Request, res: Response) => {
  const { idPago } = req.params;

  try {
    const pago = await Pago.findByPk(idPago);

    if (!pago) {
      res.status(404).json({ msg: 'Pago no encontrado' });
    } else {
      await pago.destroy();
      res.json({ msg: 'Pago eliminado con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el Pago' });
  }
};




