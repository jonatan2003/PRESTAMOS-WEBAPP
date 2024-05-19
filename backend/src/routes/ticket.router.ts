import { Router } from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket
} from '../controllers/ticket.controller';

const TicketRouter = Router();

TicketRouter.post('/', createTicket); // Crear un nuevo ticket
TicketRouter.get('/', getTickets); // Obtener la lista de tickets
TicketRouter.get('/:id', getTicketById); // Obtener un ticket por ID
TicketRouter.put('/:id', updateTicket); // Actualizar un ticket por ID
TicketRouter.delete('/:id', deleteTicket); // Eliminar un ticket por ID

export default TicketRouter;
