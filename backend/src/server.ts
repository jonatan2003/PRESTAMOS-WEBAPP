import express, { Application, Request, Response } from 'express';
import cors from 'cors';



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


class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Aplicacion corriendo en el puerto ${this.port}`)
        })
    }

    routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.json({
                msg: 'API Working'
            })
        })
    

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
        this.app.use('/api/v1/ticket', TicketRouter);


    }

    midlewares() {

        // Parseamos el body
        this.app.use(express.json());

        // Cors
        this.app.use(cors());
    }

    async dbConnect() {

        try {
            await db.authenticate();
            console.log('Base de datos conectada')
        } catch (error) {
            console.log(error);
            console.log('Error al conectarse a la base de datos')
        }

       
    }


}

export default Server;