import { Router } from 'express';
import {searchClientes,
        searchEmpleados,
        searchArticulos,
        searchCategorias,
        searchPrestamos,
        searchUsuarios,
        searchVentas,
        searchPagos,
        searchDetallesVenta,
        searchCronogramaPagos,
        searchInventario,
        searchTicketsPrestamos,
        searchComprobantesVentas,
} from '../controllers/search.controller';

const SearchRouter = Router();

SearchRouter.get('/clientes/:searchTerm', searchClientes); // Obtener la lista de clientes

SearchRouter.get('/empleados/:searchTerm', searchEmpleados); // Obtener la lista de empleados

SearchRouter.get('/articulos/:searchTerm', searchArticulos); // Obtener la lista de articulos

SearchRouter.get('/inventario/:searchTerm', searchInventario); // Obtener la lista de articulos


SearchRouter.get('/categorias/:searchTerm', searchCategorias); // Obtener la lista de categorias

SearchRouter.get('/cronograma_pagos/:searchTerm', searchCronogramaPagos); // Obtener la lista de cronograma de pagos


SearchRouter.get('/prestamos/:searchTerm', searchPrestamos); // Obtener la lista de prestamos

SearchRouter.get('/ticketsprestamos/:searchTerm', searchTicketsPrestamos); // Obtener la lista de tickets de prestamos

SearchRouter.get('/comprobantesventas/:searchTerm', searchComprobantesVentas); // Obtener la lista de tickets de prestamos






SearchRouter.get('/pagos/:searchTerm', searchPagos); // Obtener la lista de pagos


SearchRouter.get('/usuarios/:searchTerm', searchUsuarios); // Obtener la lista de usuarios

SearchRouter.get('/ventas/:searchTerm', searchVentas); // Obtener la lista de ventas

SearchRouter.get('/detalleventas/:searchTerm', searchDetallesVenta); // Obtener la lista de ventas


export default SearchRouter;
