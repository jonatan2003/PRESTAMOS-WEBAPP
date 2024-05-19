import { Request, Response } from 'express';
import Ticket from '../models/ticket.model';
import Pago from '../models/pago.model';
import Prestamo from '../models/prestamo.model';
import Empleado from '../models/empleado.model';
import Articulo from '../models/articulo.model';
import Categoria from '../models/categoria.model';
import Vehiculo from '../models/vehiculo.model';
import Electrodomestico from '../models/electrodometisco.model';
import Cliente from '../models/cliente.model';

export const createTicket = async (req: Request, res: Response) => {
  const { num_serie, num_ticket, idpago, idprestamo } = req.body;

  try {
    // Verificar si el prestamo asociado al Ticket existe
    const prestamoExistente = await Prestamo.findByPk(idprestamo);
    if (!prestamoExistente) {
      return res.status(400).json({ msg: 'El prestamo especificado no existe' });
    }

    // Verificar si el pago asociado al Ticket existe (si idpago no es nulo)
    if (idpago) {
      const pagoExistente = await Pago.findByPk(idpago);
      if (!pagoExistente) {
        return res.status(400).json({ msg: 'El pago especificado no existe' });
      }
    }

    const nuevoTicket = await Ticket.create({
      num_serie,
      num_ticket,
      idpago,
      idprestamo,
    });

    res.status(201).json(nuevoTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el Ticket' });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        { model: Pago, as: 'Pago' },
        { model: Prestamo, as: 'Prestamo',
        include: [
          { model: Cliente, as: 'Cliente' },
          { model: Empleado, as: 'Empleado' },
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
         }
      ],
    });
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de Tickets' });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: Pago, as: 'Pago' },
        { model: Prestamo, as: 'Prestamo',
        include: [
          { model: Cliente, as: 'Cliente' },
          { model: Empleado, as: 'Empleado' },
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
         }
      ],
    });

    if (!ticket) {
      res.status(404).json({ msg: 'Ticket no encontrado' });
    } else {
      res.json(ticket);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el Ticket' });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  const { body } = req;
  const { id } = req.params;

  try {
    const ticket = await Ticket.findByPk(id,{
      include: [
        { model: Pago, as: 'Pago' },
        { model: Prestamo, as: 'Prestamo',
        include: [
          { model: Cliente, as: 'Cliente' },
          { model: Empleado, as: 'Empleado' },
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
         }
      ],
    });

    if (ticket) {
      // Verificar si el prestamo asociado al Ticket existe
      if (body.idprestamo) {
        const prestamoExistente = await Prestamo.findByPk(body.idprestamo);
        if (!prestamoExistente) {
          return res.status(400).json({ msg: 'El prestamo especificado no existe' });
        }
      }

      // Verificar si el pago asociado al Ticket existe (si idpago no es nulo)
      if (body.idpago) {
        const pagoExistente = await Pago.findByPk(body.idpago);
        if (!pagoExistente) {
          return res.status(400).json({ msg: 'El pago especificado no existe' });
        }
      }

      await ticket.update(body);
      res.json({ msg: 'El Ticket fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un Ticket con el id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el Ticket' });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      res.status(404).json({ msg: 'Ticket no encontrado' });
    } else {
      await ticket.destroy();
      res.json({ msg: 'Ticket eliminado con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el Ticket' });
  }
};
