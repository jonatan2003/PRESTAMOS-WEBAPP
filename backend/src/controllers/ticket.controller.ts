// ticket.controller.js

import { Request, Response } from 'express';
import Ticket from '../models/ticket.model'; // Importa el modelo Ticket
import Pago from '../models/pago.model'; // Importa el modelo Pago
import DetalleVenta from '../models/detalleventa.model'; // Importa el modelo DetalleVenta

// Controlador para crear un nuevo Ticket
export const createTicket = async (req: Request, res: Response) => {
  const { nro_serie, nro_ticket, tipo_comprobante, id_pago, id_detalleventa } = req.body;

  try {
    // Verificar si el Pago asociado al Ticket existe
    const pagoExistente = await Pago.findByPk(id_pago);
    if (!pagoExistente) {
      return res.status(400).json({ msg: 'El Pago especificado no existe' });
    }

    // Verificar si el DetalleVenta asociado al Ticket existe
    const detalleVentaExistente = await DetalleVenta.findByPk(id_detalleventa);
    if (!detalleVentaExistente) {
      return res.status(400).json({ msg: 'El DetalleVenta especificado no existe' });
    }

    const nuevoTicket = await Ticket.create({
      nro_serie,
      nro_ticket,
      tipo_comprobante,
      id_pago,
      id_detalleventa,
    });

    res.status(201).json(nuevoTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al crear el Ticket' });
  }
};

// Controlador para obtener todos los Tickets
export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        { model: Pago, as: 'Pago' },
        { model: DetalleVenta, as: 'DetalleVenta' },
      ],
    });
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de Tickets' });
  }
};

// Controlador para obtener un Ticket por su ID
export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: Pago, as: 'Pago' },
        { model: DetalleVenta, as: 'DetalleVenta' },
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

// Controlador para actualizar un Ticket por su ID
export const updateTicket = async (req: Request, res: Response) => {
  const { body } = req;
  const { id } = req.params;

  try {
    const ticket = await Ticket.findByPk(id);

    if (ticket) {
      // Verificar si el Pago asociado al Ticket existe
      if (body.id_pago) {
        const pagoExistente = await Pago.findByPk(body.id_pago);
        if (!pagoExistente) {
          return res.status(400).json({ msg: 'El Pago especificado no existe' });
        }
      }

      // Verificar si el DetalleVenta asociado al Ticket existe
      if (body.id_detalleventa) {
        const detalleVentaExistente = await DetalleVenta.findByPk(body.id_detalleventa);
        if (!detalleVentaExistente) {
          return res.status(400).json({ msg: 'El DetalleVenta especificado no existe' });
        }
      }

      await ticket.update(body);
      res.json({ msg: 'El Ticket fue actualizado con éxito' });
    } else {
      res.status(404).json({ msg: `No existe un Ticket con el ID ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar el Ticket' });
  }
};

// Controlador para eliminar un Ticket por su ID
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
