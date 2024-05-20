import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import http from 'http'; // Importa el módulo http de Node.js
import { Server as SocketIOServer, Socket } from 'socket.io'; // Importa Server y Socket de socket.io



import PrestamosRouter from './routes/prestamo.router';
import ClientesRouter from './routes/cliente.router';
import ArticulosRouter from './routes/articulo.router';
import VentasRouter from './routes/venta.router';
import PagosRouter from './routes/pago.router';
import DetaventasRouter from './routes/detaventa.router';
import Usuariorouter from './routes/usuario.router';
import db from './db/connection.db';
import Loginrouter from './routes/login.router';
import EmpleadosRouter from './routes/empleado.router';
import CategoriaRouter from './routes/categoria.router';
import SearchRouter from './routes/search.router';
import ElectrodomesticosRouter from './routes/electrodomestico.router';
import VehiculosRouter from './routes/vehiculo.router';
import PaginacionRouter from './routes/paginacion.router';
import TicketRouter from './routes/ticket.router';
import RouterDni from './routes/apidni.router';
import { actualizarPrestamosAVenta } from './controllers/paginacion.controller';
import BoletasRouter from './routes/boleta.router';
import InventarioRouter from './routes/inventario.router';
import TipoPagoRouter from './routes/tipo_pago.router';
import ComprobanteVentaRouter from './routes/comprobante_venta.router';
import routerSUNAT from './routes/sunat.router';
import routerRUC from './routes/apiruc.router';


class Server {
  private app: Application;
  private port: string;
  private httpServer: http.Server; // Crea una instancia de http.Server
  private io: SocketIOServer; // Crea una instancia de SocketIOServer
  private isRequesting: boolean = false;
  private isUpdatingPrestamos: boolean = false;

  
  constructor() {
    this.app = express();
    this.port = process.env.PORT || '3001';
    this.httpServer = new http.Server(this.app); // Crea un servidor http usando express
    this.io = new SocketIOServer(this.httpServer); // Crea una instancia de SocketIOServer asociada al servidor http
    
    this.listen();
    this.middlewares();
    this.routes();
    this.dbConnect();
    this.setupWebSockets();
  }

  private listen() {
    this.httpServer.listen(this.port, () => {
      console.log(`Aplicacion corriendo en el puerto ${this.port}`);
    });
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(cors({
      origin: 'http://localhost:4200',
      credentials: true // Habilita el intercambio de cookies o encabezados de autenticación
    }));
  }

  private routes() {
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        msg: 'API Working'
      });
    });

    this.app.use('/api/v1/login', Loginrouter); 

    this.app.use('/api/v1/usuarios', Usuariorouter); 
    this.app.use('/api/v1/clientes', ClientesRouter);
    this.app.use('/api/v1/articulos', ArticulosRouter);
    this.app.use('/api/v1/categorias', CategoriaRouter);
    this.app.use('/api/v1/electrodomesticos', ElectrodomesticosRouter);
    this.app.use('/api/v1/vehiculos', VehiculosRouter);
    this.app.use('/api/v1/pagos', PagosRouter);
    this.app.use('/api/v1/prestamos', PrestamosRouter);
    this.app.use('/api/v1/detaventas', DetaventasRouter);
    this.app.use('/api/v1/ventas', VentasRouter);
    this.app.use('/api/v1/empleados', EmpleadosRouter);
    this.app.use('/api/v1/search', SearchRouter);
    this.app.use('/api/v1/paginacion', PaginacionRouter);
    this.app.use('/api/v1/inventario', InventarioRouter);
    this.app.use('/api/v1/tipopagos', TipoPagoRouter);
    this.app.use('/api/v1/comprobantes_ventas', ComprobanteVentaRouter);
    this.app.use('/api/v1/ticket', TicketRouter);
    this.app.use('/api/v1/dni', RouterDni);
    this.app.use('/api/v1/ruc', routerRUC);
    this.app.use('/api/v1/boletas', BoletasRouter);
    this.app.use('/api/v1/sunat', routerSUNAT);


  }

  private async dbConnect() {
    try {
        await db.authenticate();
        console.log('Base de datos conectada')
    } catch (error) {
      console.log('Error al conectarse a la base de datos:', error);
    }
  }

  private setupWebSockets() {
    try {
      this.io.on('connection', (socket: Socket) => {
        console.log('Cliente conectado:', socket.id);
  
        socket.on('disconnect', () => {
          console.log('Cliente desconectado:', socket.id);
        });
      });
  
      setInterval(async () => {
        if (this.isRequesting) {
          console.log('Esperando a que la petición actual termine...');
          return;
        }
  
        this.isRequesting = true;
        const req: any = {};
        const res: any = {
          json: (data: any) => data,
          status: (statusCode: number) => ({
            json: (data: any) => data
          })
        };
  
        try {
          await actualizarPrestamosAVenta(req, res);
        } catch (error) {
          console.error('Error al actualizar préstamos:', error);
        } finally {
          this.isRequesting = false;
        }
      },72000000 ); // 60000 es 60 segundos para pruebas, 72000000 20 horas para producción
  
    } catch (error) {
      console.log('Error en la configuración de WebSockets:', error);
    }
  }
  
  public getIO(): SocketIOServer {
    return this.io;
  }
  
  }



  const serverInstance = new Server();
  export default serverInstance;