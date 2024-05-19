import { Router } from 'express';
import { getClientes, 
    getPrestamos, 
    getEmpleados, 
    getArticulos ,
    getVehiculos, 
    getElectrodomesticos,
     getPagos,
      getCategorias,
      getInventario,
       getVentas,
        getDetallesVenta,
         getUsuarios, 
         getPrestamosPendientes,
         getPrestamosPagados,
         getPrestamosVenta,
         actualizarPrestamosAVenta,
         getComprobantesVenta,
         getTickets,
         getTiposPago} from '../controllers/paginacion.controller';

const PaginacionRouter = Router();

// Rutas para clientes
PaginacionRouter.get('/clientes', getClientes);

// Rutas para préstamos
PaginacionRouter.get('/prestamos', getPrestamos);

// Rutas para empleados
PaginacionRouter.get('/empleados', getEmpleados);

// Rutas para artículos
PaginacionRouter.get('/articulos/:categoriaId', getArticulos);

// Rutas para vehículos
PaginacionRouter.get('/vehiculos', getVehiculos);

// Rutas para electrodomésticos
PaginacionRouter.get('/electrodomesticos', getElectrodomesticos);

PaginacionRouter.get('/inventario', getInventario);

PaginacionRouter.get('/comprobantes_ventas', getComprobantesVenta);

PaginacionRouter.get('/tickets', getTickets);

PaginacionRouter.get('/tipospago', getTiposPago);




// Rutas para detalles de préstamo
PaginacionRouter.get('/pagos', getPagos);

// Rutas para categorías
PaginacionRouter.get('/categorias', getCategorias);

// Rutas para ventas
PaginacionRouter.get('/ventas', getVentas);

// Rutas para detalles de venta
PaginacionRouter.get('/detalleventas', getDetallesVenta);

PaginacionRouter.get('/usuarios', getUsuarios);

PaginacionRouter.get('/prestamosvencidos', actualizarPrestamosAVenta);

PaginacionRouter.get('/prestamosventas', getPrestamosVenta);


PaginacionRouter.get('/prestamospendientes', getPrestamosPendientes);

PaginacionRouter.get('/prestamospagados', getPrestamosPagados);





export default PaginacionRouter;