import { Request, Response } from 'express';
import Cliente from '../models/cliente.model';
import Prestamo from '../models/prestamo.model';
import Empleado from '../models/empleado.model';
import Articulo from '../models/articulo.model';
import Categoria from '../models/categoria.model';
import Vehiculo from '../models/vehiculo.model';
import Electrodomestico from '../models/electrodometisco.model';
import Venta from '../models/venta.model';
import DetalleVenta from '../models/detalleventa.model';
import Usuario from '../models/usuario.model';
import Pago from '../models/pago.model';
import { Op } from 'sequelize';
import server from '../server';

export const getClientes = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1; // Página solicitada (predeterminada: 1)
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10; // Tamaño de página (predeterminado: 10)
      const offset = (page - 1) * pageSize;
  
      // Consulta para obtener clientes paginados
      const clientes = await Cliente.findAndCountAll({
        limit: pageSize,
        offset: offset,
        order: [['id', 'DESC']],
      });
  
      const totalItems = clientes.count;
      const totalPages = Math.ceil(totalItems / pageSize);
  
      res.json({
        page,
        pageSize,
        totalItems,
        totalPages,
        data: clientes.rows
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener la lista de clientes' });
    }
  };
  

  export const getPrestamos = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
      const offset = (page - 1) * pageSize;
  
      const prestamos = await Prestamo.findAndCountAll({
        limit: pageSize,
        offset: offset,
        order: [['id', 'DESC']],
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
      });
  
      const totalItems = prestamos.count;
      const totalPages = Math.ceil(totalItems / pageSize);
  
      res.json({
        page,
        pageSize,
        totalItems,
        totalPages,
        data: prestamos.rows
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener la lista de préstamos' });
    }
  };


  // Método de paginación para empleados
export const getEmpleados = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    const empleados = await Empleado.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],
    });

    const totalItems = empleados.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: empleados.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de empleados' });
  }
};


// export const getArticulos = async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string, 10) || 1;
//     const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
//     const offset = (page - 1) * pageSize;
//     const categoriaId = req.params.categoriaId;
//     // Consulta para obtener artículos paginados según el tipo de categoría
//     let consulta;
//     if (categoriaId === '1') { // Si la categoría es 1, contar vehículos
//       consulta = Vehiculo.findAndCountAll({ limit: pageSize, offset: offset,
//         order: [['id', 'DESC']],
        
//        });
       
//     } else if (categoriaId === '2') { // Si la categoría es 2, contar electrodomésticos
//       consulta = Electrodomestico.findAndCountAll({ limit: pageSize, offset: offset ,
//         order: [['id', 'DESC']],
       
//       });
//     } else { // Por defecto, contar todos los artículos
//       consulta = Articulo.findAndCountAll({ limit: pageSize, offset: offset,
//         order: [['id', 'DESC']],
//         include: [
//           { model: Categoria, as: 'Categoria' },
//           { model: Vehiculo, as: 'Vehiculo' },
//           { model: Electrodomestico, as: 'Electrodomestico' }
//         ]
//        });
//     }

//     const articulos = await consulta;


//     const totalItems = articulos.count;
//     const totalPages = Math.ceil(totalItems / pageSize);

//     res.json({
//       page,
//       pageSize,
//       totalItems,
//       totalPages,
//       data: articulos.rows,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: 'Error al obtener la lista de artículos' });
//   }
// };

export const getArticulos = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;
    const categoriaId = req.params.categoriaId;

    let consulta;

    if (categoriaId === '1') {
      // Consulta para obtener artículos (vehículos) paginados con detalles de Vehiculo
      consulta = Articulo.findAndCountAll({
        where: { idvehiculo: { [Op.not]: null } }, // Filtra solo los artículos que tienen asociación con Vehiculo
        limit: pageSize,
        offset: offset,
        order: [['id', 'DESC']],
        include: [
          { model: Categoria, as: 'Categoria' },
          { model: Vehiculo, as: 'Vehiculo' },
        ],
      });
    } else if (categoriaId === '2') {
      // Consulta para obtener artículos (electrodomésticos) paginados con detalles de Electrodomestico
      consulta = Articulo.findAndCountAll({
        where: { idelectrodomestico: { [Op.not]: null } }, // Filtra solo los artículos que tienen asociación con Electrodomestico
        limit: pageSize,
        offset: offset,
        order: [['id', 'DESC']],
        include: [
          { model: Categoria, as: 'Categoria' },
          { model: Electrodomestico, as: 'Electrodomestico' },
        ],
      });
    } else {
      // Consulta para obtener todos los artículos paginados con detalles de Vehiculo o Electrodomestico según corresponda
      consulta = Articulo.findAndCountAll({
        limit: pageSize,
        offset: offset,
        order: [['id', 'DESC']],
        include: [
          { model: Categoria, as: 'Categoria' },
          { model: Vehiculo, as: 'Vehiculo' },
          { model: Electrodomestico, as: 'Electrodomestico' },
        ],
      });
    }

    const articulos = await consulta;

    const totalItems = articulos.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: articulos.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de artículos' });
  }
};


// Método de paginación para Vehículo
export const getVehiculos = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    const vehiculos = await Vehiculo.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],
    });

    const totalItems = vehiculos.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: vehiculos.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de vehículos' });
  }
};

// Método de paginación para Electrodoméstico
export const getElectrodomesticos = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    const electrodomesticos = await Electrodomestico.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],

    });

    const totalItems = electrodomesticos.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: electrodomesticos.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de electrodomésticos' });
  }
};

// Método de paginación para DetallePrestamo
export const getPagos = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1; // Página solicitada (predeterminada: 1)
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10; // Tamaño de página (predeterminado: 10)
    const offset = (page - 1) * pageSize;

    // Consulta para obtener pagos paginados
    const pagos = await Pago.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],
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

    const totalItems = pagos.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: pagos.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de pagos' });
  }
};


// Método de paginación para Categoria
export const getCategorias = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    const categorias = await Categoria.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],
    });

    const totalItems = categorias.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: categorias.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de categorías' });
  }
};

// Método de paginación para Venta
export const getVentas = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    const ventas = await Venta.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],
      include: [
        { model: Empleado, as: 'Empleado' },
        { model: Cliente, as: 'Cliente' },
        {
          model: Articulo,
          as: 'Articulo',
          include: [
            { model: Categoria, as: 'Categoria' },
            { model: Vehiculo, as: 'Vehiculo' },
            { model: Electrodomestico, as: 'Electrodomestico' },
          ],
        },
      ],
    });

    const totalItems = ventas.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: ventas.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de ventas' });
  }
};

// Método de paginación para DetalleVenta
export const getDetallesVenta = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    const detallesVenta = await DetalleVenta.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],
include: [
        { model: Venta, as: 'Venta',
        include: [
          { model: Empleado, as: 'Empleado' },
          { model: Cliente, as: 'Cliente' },
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
            },
        ],
         },
        
      ],
    });

    const totalItems = detallesVenta.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: detallesVenta.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de detalles de venta' });
  }
};


export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    const usuarios = await Usuario.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],
    });

    const totalItems = usuarios.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: usuarios.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de usuarios' });
  }
};


// export const getPrestamosVencidos = async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string, 10) || 1;
//     const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
//     const offset = (page - 1) * pageSize;

//     const hoy = new Date(); // Obtener la fecha actual

//     // Obtener los préstamos vencidos
//     const prestamosVencidos = await Prestamo.findAndCountAll({
//       where: {
//         fecha_devolucion: {
//           [Op.lt]: hoy // Obtener los préstamos donde la fecha de devolución es anterior a la fecha actual
//         },

//         [Op.and]: [
//           { estado: 'pendiente' }, // Préstamos vencidos con estado 'pendiente'
//           //{ estado: 'venta' } // Préstamos vencidos con estado 'venta'
//         ],
//       },
//       include: [
//         { model: Cliente, as: 'Cliente' },
//         { model: Empleado, as: 'Empleado' },
//         {
//           model: Articulo,
//           as: 'Articulo',
//           include: [
//             { model: Categoria, as: 'Categoria' },
//             { model: Vehiculo, as: 'Vehiculo' },
//             { model: Electrodomestico, as: 'Electrodomestico' },
//           ],
//         },
//       ],
//       limit: pageSize,
//       offset: offset,
//       order: [['fecha_devolucion', 'DESC']], // Ordenar por fecha de devolución en orden descendente
//     });

//     // Obtener los IDs de los préstamos vencidos
//     const prestamosIds = prestamosVencidos.rows.map((prestamo: any) => prestamo.id);

//     // Actualizar los préstamos vencidos a estado 'venta'
//     // Añade una condición para actualizar solo los préstamos que están en estado 'pendiente'
//     await Prestamo.update(
//       { estado: 'venta' },
//       {
//         where: {
//           id: prestamosIds,
//           estado: 'pendiente' // Solo actualizar préstamos que estén en estado 'pendiente'
//         }
//       }
//     );

//     // Recuperar nuevamente los préstamos actualizados (incluyendo los que se acaban de actualizar a 'venta')
//     const prestamosActualizados = await Prestamo.findAll({
//       where: {
//         id: prestamosIds
//       },
//       include: [
//         { model: Cliente, as: 'Cliente' },
//         { model: Empleado, as: 'Empleado' },
//         {
//           model: Articulo,
//           as: 'Articulo',
//           include: [
//             { model: Categoria, as: 'Categoria' },
//             { model: Vehiculo, as: 'Vehiculo' },
//             { model: Electrodomestico, as: 'Electrodomestico' },
//           ],
//         },
//       ]
//     });

//     const totalItems = prestamosVencidos.count;
//     const totalPages = Math.ceil(totalItems / pageSize);

//     res.json({
//       page,
//       pageSize,
//       totalItems,
//       totalPages,
//       data: prestamosActualizados, // Devuelve los préstamos actualizados
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: 'Error al obtener los préstamos vencidos' });
//   }
// };

export const actualizarPrestamosAVenta = async (req: Request, res: Response) => {
  try {
    const hoy = new Date();

    // Obtener los IDs de los préstamos vencidos y pendientes
    const prestamosPendientes = await Prestamo.findAll({
      where: {
        estado: 'pendiente',
        fecha_devolucion: {
          [Op.lt]: hoy
        }
      }
    });

    const prestamosIds = prestamosPendientes.map((prestamo: any) => prestamo.id);

    // Actualizar los préstamos vencidos y pendientes a estado 'venta'
    const [prestamosActualizadosCount] = await Prestamo.update(
      { estado: 'venta' },
      {
        where: {
          id: {
            [Op.in]: prestamosIds
          }
        }
      }
    );

    console.log('Préstamos actualizados:', prestamosActualizadosCount); // Verificar el conteo de préstamos actualizados

    if (prestamosActualizadosCount > 0) {
      // Obtener los detalles de los préstamos actualizados
      const prestamosActualizadosDetails = await Prestamo.findAll({
        where: {
          id: {
            [Op.in]: prestamosIds
          }
        },
        include: [
          {
            model: Articulo,
            as: 'Articulo',
            include: [
              { model: Vehiculo, as: 'Vehiculo' },
              { model: Electrodomestico, as: 'Electrodomestico' }
            ]
          },
          { model: Cliente, as: 'Cliente' },
          { model: Empleado, as: 'Empleado' }
        ]
      });

      console.log('Detalles de préstamos actualizados:', prestamosActualizadosDetails); // Verificar los detalles de los préstamos actualizados

      const io = server.getIO(); // Obtener la instancia de io desde la instancia de Server

      // Emitir un evento para cada préstamo actualizado
      prestamosActualizadosDetails.forEach((prestamo: any) => {
        const { id, estado, Articulo, Cliente, Empleado } = prestamo;

        let articuloDescripcion = 'No disponible';
        if (Articulo) {
          if (Articulo.Vehiculo) {
            articuloDescripcion = Articulo.Vehiculo.descripcion || 'No hay descripción de vehículo disponible';
          } else if (Articulo.Electrodomestico) {
            articuloDescripcion = Articulo.Electrodomestico.descripcion || 'No hay descripción de electrodoméstico disponible';
          }
        }

        const clienteNombre = Cliente ? Cliente.nombre : 'No disponible';
        const empleadoNombre = Empleado ? Empleado.nombre : 'No disponible';

        const mensaje = `Se ha actualizado el préstamo a estado "venta" - Detalles del artículo: ${articuloDescripcion}`;
        const evento = {
          id: id,
          estado: estado,
          cliente: clienteNombre,
          empleado: empleadoNombre
        };

        io.emit('prestamoActualizado', { message: mensaje, prestamo: evento });
        console.log('Evento emitido para préstamo actualizado:', evento); // Verificar el evento emitido
      });

      res.status(200).json({ success: true, message: 'Se han actualizado los préstamos a estado "venta" correctamente.' });
      
    } else {
      res.status(404).json({ success: false, message: 'No se encontraron préstamos vencidos y pendientes para actualizar.' });
    }
  } catch (error) {
    console.error('Error al actualizar préstamos a estado "venta":', error);
    res.status(500).json({ success: false, message: 'Error al actualizar préstamos a estado "venta".' });
  }
};

// async function obtenerDescripcionArticulo(articulo: any): Promise<string> {
//   if (!articulo) {
//     return 'No hay descripción disponible';
//   }

//   const { idvehiculo, idelectrodomestico } = articulo.dataValues;

//   if (idvehiculo !== null) {
//     return await obtenerDescripcionVehiculo(idvehiculo);
//   } else if (idelectrodomestico !== null) {
//     return await obtenerDescripcionElectrodomestico(idelectrodomestico);
//   } else {
//     return 'No hay descripción disponible';
//   }
// }

// async function obtenerDescripcionVehiculo(idVehiculo: number): Promise<string> {
//   try {
//     const vehiculo:any = await Vehiculo.findByPk(idVehiculo); // Busca el vehículo por su ID

//     if (vehiculo) {
//       return vehiculo.descripcion || 'No hay descripción de vehículo disponible';
//     } else {
//       return 'No hay descripción de vehículo disponible';
//     }
//   } catch (error) {
//     console.error('Error al obtener la descripción del vehículo:', error);
//     return 'Error al obtener la descripción del vehículo';
//   }
// }

// async function obtenerDescripcionElectrodomestico(idElectrodomestico: number): Promise<string> {
//   try {
//     const electrodomestico:any = await Electrodomestico.findByPk(idElectrodomestico); // Busca el electrodoméstico por su ID

//     if (electrodomestico) {
//       return electrodomestico.descripcion || 'No hay descripción de electrodoméstico disponible';
//     } else {
//       return 'No hay descripción de electrodoméstico disponible';
//     }
//   } catch (error) {
//     console.error('Error al obtener la descripción del electrodoméstico:', error);
//     return 'Error al obtener la descripción del electrodoméstico';
//   }
// }


export const getPrestamosVenta = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    // Realiza la consulta paginada para obtener los préstamos en estado 'venta'
    const prestamosVenta = await Prestamo.findAndCountAll({
      where: {
        estado: 'venta'
      },
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],
            include: [
        { model: Cliente, as: 'Cliente' },
        { model: Empleado, as: 'Empleado' },
        {
          model: Articulo,
          as: 'Articulo',
          include: [
            { model: Categoria, as: 'Categoria' },
            { model: Vehiculo, as: 'Vehiculo' },
            { model: Electrodomestico, as: 'Electrodomestico' },
          ],
        },
      ]
    
    });

    const totalItems = prestamosVenta.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: prestamosVenta.rows
    });
  } catch (error) {
    console.error('Error al obtener préstamos en estado "venta" con paginación:', error);
    res.status(500).json({ success: false, message: 'Error al obtener préstamos en estado "venta" con paginación.' });
  }
};

export const getPrestamosPendientes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    const prestamosPendientes = await Prestamo.findAndCountAll({
      where: {
        estado: 'pendiente', // Filtrar por préstamos con estado "pendiente"
      },
      include: [
        { model: Cliente, as: 'Cliente' },
        { model: Empleado, as: 'Empleado' },
        {
          model: Articulo,
          as: 'Articulo',
          include: [
            { model: Categoria, as: 'Categoria' },
            { model: Vehiculo, as: 'Vehiculo' },
            { model: Electrodomestico, as: 'Electrodomestico' },
          ],
        },
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']], // Ordenar por fecha de creación en orden descendente (o usar otro campo relevante)
    });

    const totalItems = prestamosPendientes.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: prestamosPendientes.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los préstamos pendientes' });
  }
};

export const getPrestamosPagados = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    const prestamosPendientes = await Prestamo.findAndCountAll({
      where: {
        estado: 'pagado', // Filtrar por préstamos con estado "pendiente"
      },
      include: [
        { model: Cliente, as: 'Cliente' },
        { model: Empleado, as: 'Empleado' },
        {
          model: Articulo,
          as: 'Articulo',
          include: [
            { model: Categoria, as: 'Categoria' },
            { model: Vehiculo, as: 'Vehiculo' },
            { model: Electrodomestico, as: 'Electrodomestico' },
          ],
        },
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']], // Ordenar por fecha de creación en orden descendente (o usar otro campo relevante)
    });

    const totalItems = prestamosPendientes.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: prestamosPendientes.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los préstamos pagados' });
  }
};