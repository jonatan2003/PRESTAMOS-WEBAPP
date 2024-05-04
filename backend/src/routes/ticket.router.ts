import { Router } from 'express';
import {
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketById,
  getTickets,
} from '../controllers/ticket.controller';

const TicketRouter = Router();

TicketRouter.post('/', createTicket); // Crear un nuevo ticket
TicketRouter.get('/', getTickets); // Obtener la lista de tickets
TicketRouter.get('/:id', getTicketById); // Obtener un ticket por su ID
TicketRouter.put('/:id', updateTicket); // Actualizar un ticket por su ID
TicketRouter.delete('/:id', deleteTicket); // Eliminar un ticket por su ID

export default TicketRouter;