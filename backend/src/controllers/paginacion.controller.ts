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
import Inventario from '../models/inventario.model';
import ComprobanteVenta from '../models/comprobante_venta.model';
import TipoComprobante from '../models/tipo_comprobante.model';
import Ticket from '../models/ticket.model';
import TipoPago from '../models/tipo_pago.model';
import CronogramaPagos from '../models/cronograma_pagos.model';

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


export const getInventario = async (req: Request, res: Response) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    // Consulta principal con la paginación y las relaciones
    const inventarios = await Inventario.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],
      include: [
        {
          model: Articulo, as: 'Articulo', include: [
            { model: Categoria, as: 'Categoria' },
            { model: Vehiculo, as: 'Vehiculo' },
            { model: Electrodomestico, as: 'Electrodomestico' }
          ],
        },
      ],
    });

    // Calcular información de paginación
    const totalItems = inventarios.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Enviar respuesta con los datos y la información de paginación
    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: inventarios.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de inventarios' });
  }
};

export const getComprobantesVenta = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const comprobantesVenta = await ComprobanteVenta.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],
      include: [
        { 
          model: TipoComprobante, 
          as: 'TipoComprobante' 
        },
        { 
          model: DetalleVenta, 
          as: 'DetalleVenta', 
          include: [
            { 
              model: Venta, 
              as: 'Venta',
              include: [
                { 
                  model: Empleado, 
                  as: 'Empleado' 
                },
                { 
                  model: Cliente, 
                  as: 'Cliente' 
                },
                { 
                  model: Articulo, 
                  as: 'Articulo' ,
                  include: [
                    { 
                      model: Categoria, 
                      as: 'Categoria' 
                    },
                    { 
                      model: Vehiculo, 
                      as: 'Vehiculo' 
                    },
                    { 
                      model: Electrodomestico, 
                      as: 'Electrodomestico' 
                    },
                  ]
                },
              ],
            },
          ],
        }
      ],
    });

    // Calcular información de paginación
    const totalItems = comprobantesVenta.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Enviar respuesta con los datos y la información de paginación
    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: comprobantesVenta.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de Comprobantes de Venta' });
  }
};


export const getTicketsVentas = async (req: Request, res: Response) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    // Consulta principal con la paginación y las relaciones
    const tickets = await Ticket.findAndCountAll({
      limit: pageSize,
      offset: offset,
      include: [
        { model: Empleado, as: 'Empleado' },
        { model: Pago, as: 'Pago' },
        {
          model: Prestamo, as: 'Prestamo', where: { estado: 'vencido' }, // Filtrar por préstamos en estado 'venta'
          include: [
            { model: Cliente, as: 'Cliente' },
            {
              model: Articulo, as: 'Articulo', include: [
                { model: Categoria, as: 'Categoria' },
                { model: Vehiculo, as: 'Vehiculo' },
                { model: Electrodomestico, as: 'Electrodomestico' },
              ]
            },
          ],
        }
      ],
    });

    // Calcular información de paginación
    const totalItems = tickets.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Enviar respuesta con los datos y la información de paginación
    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: tickets.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de Tickets' });
  }
};


export const getTicketsPagos = async (req: Request, res: Response) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    // Consulta principal con la paginación y las relaciones
    const tickets = await Ticket.findAndCountAll({
      limit: pageSize,
      offset: offset,
      include: [
        { model: Empleado, as: 'Empleado' },
        {
          model: Pago, as: 'Pago', where: { '$Pago.idPrestamo$': { [Op.col]: 'Ticket.idPrestamo' } }
        },
        {
          model: Prestamo, as: 'Prestamo', include: [
            { model: Cliente, as: 'Cliente' },
            {
              model: Articulo, as: 'Articulo', include: [
                { model: Categoria, as: 'Categoria' },
                { model: Vehiculo, as: 'Vehiculo' },
                { model: Electrodomestico, as: 'Electrodomestico' },
              ]
            },
          ],
        }
      ],
    });

    // Calcular información de paginación
    const totalItems = tickets.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Enviar respuesta con los datos y la información de paginación
    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: tickets.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de Tickets' });
  }
};


export const getTicketsPrestamos = async (req: Request, res: Response) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    // Consulta principal con la paginación y las relaciones
    const tickets = await Ticket.findAndCountAll({
      limit: pageSize,
      offset: offset,
      where: { // Asegura que solo se incluyan tickets con préstamos
        '$Prestamo.id$': { [Op.ne]: null }
      },
      include: [
        { model: Empleado, as: 'Empleado' },
        { model: Pago, as: 'Pago' },
        {
          model: Prestamo, as: 'Prestamo', include: [
            { model: Cliente, as: 'Cliente' },
            {
              model: Articulo, as: 'Articulo', include: [
                { model: Categoria, as: 'Categoria' },
                { model: Vehiculo, as: 'Vehiculo' },
                { model: Electrodomestico, as: 'Electrodomestico' },
              ]
            },
          ],
        }
      ],
    });

    // Calcular información de paginación
    const totalItems = tickets.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Enviar respuesta con los datos y la información de paginación
    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: tickets.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de Tickets' });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    // Consulta principal con la paginación y las relaciones
    const tickets = await Ticket.findAndCountAll({
      limit: pageSize,
      offset: offset,
      include: [
        { model: Empleado, as: 'Empleado' },
        { model: Pago, as: 'Pago' },
        {
          model: Prestamo, as: 'Prestamo', include: [
            { model: Cliente, as: 'Cliente' },
            {
              model: Articulo, as: 'Articulo', include: [
                { model: Categoria, as: 'Categoria' },
                { model: Vehiculo, as: 'Vehiculo' },
                { model: Electrodomestico, as: 'Electrodomestico' },
              ]
            },
          ],
        }
      ],
    });

    // Calcular información de paginación
    const totalItems = tickets.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Enviar respuesta con los datos y la información de paginación
    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: tickets.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de Tickets' });
  }
};


export const getTiposPago = async (req: Request, res: Response) => {
  try {
    // Parse pagination parameters from request query
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Fetch tiposPago with pagination
    const tiposPago = await TipoPago.findAndCountAll({
      limit: pageSize,
      offset: offset,
    });

    // Calculate total pages
    const totalPages = Math.ceil(tiposPago.count / pageSize);

    // Send paginated response
    res.json({
      page,
      pageSize,
      totalItems: tiposPago.count,
      totalPages,
      data: tiposPago.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de tipos de pago' });
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
      { estado: 'vencido' },
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
        ]
      });

      console.log('Detalles de préstamos actualizados:', prestamosActualizadosDetails); // Verificar los detalles de los préstamos actualizados

      const io = server.getIO(); // Obtener la instancia de io desde la instancia de Server

      // Emitir un evento para cada préstamo actualizado
      prestamosActualizadosDetails.forEach((prestamo: any) => {
        const { id, estado, Articulo, Cliente } = prestamo;

        let articuloDescripcion = 'No disponible';
        if (Articulo) {
          if (Articulo.Vehiculo) {
            articuloDescripcion = Articulo.Vehiculo.descripcion || 'No hay descripción de vehículo disponible';
          } else if (Articulo.Electrodomestico) {
            articuloDescripcion = Articulo.Electrodomestico.descripcion || 'No hay descripción de electrodoméstico disponible';
          }
        }

        const clienteNombre = Cliente ? Cliente.nombre : 'No disponible';

        const mensaje = `Se ha actualizado el préstamo a estado "venta" - Detalles del artículo: ${articuloDescripcion}`;
        const evento = {
          id: id,
          estado: estado,
          cliente: clienteNombre,
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

export const getTicketsPrestamosPendientes = async (req: Request, res: Response) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    // Consulta principal con la paginación y las relaciones
    const tickets = await Ticket.findAndCountAll({
      limit: pageSize,
      offset: offset,
      include: [
        { model: Empleado, as: 'Empleado' },
        { model: Pago, as: 'Pago' },
        {
          model: Prestamo, as: 'Prestamo', where: { estado: 'pendiente' }, // Filtrar por préstamos en estado 'pendiente'
          include: [
            { model: Cliente, as: 'Cliente' },
            {
              model: Articulo, as: 'Articulo', include: [
                { model: Categoria, as: 'Categoria' },
                { model: Vehiculo, as: 'Vehiculo' },
                { model: Electrodomestico, as: 'Electrodomestico' },
              ]
            },
          ],
        }
      ],
    });

    // Calcular información de paginación
    const totalItems = tickets.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Enviar respuesta con los datos y la información de paginación
    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: tickets.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la lista de Tickets' });
  }
};


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


export const getCronogramaPagosPendientes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;

    // Realiza la consulta paginada para obtener los cronogramas de pagos con préstamos en estado 'pendiente'
    const cronogramaPagosPendientes = await CronogramaPagos.findAndCountAll({
      include: [
        {
          model: Prestamo,
          as: 'Prestamo',
          where: { estado: 'pendiente' },
          include: [
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
        },
      ],
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],
    });

    const totalItems = cronogramaPagosPendientes.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: cronogramaPagosPendientes.rows,
    });
  } catch (error) {
    console.error('Error al obtener cronogramas de pagos con préstamos en estado "pendiente" con paginación:', error);
    res.status(500).json({ success: false, message: 'Error al obtener cronogramas de pagos con préstamos en estado "pendiente" con paginación.' });
  }
};

export const getPrestamosPendientes = async (req: Request, res: Response) => {
    try {
      // Parámetros de paginación
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
      const offset = (page - 1) * pageSize;
  
      // Consulta principal con la paginación y las relaciones
      const tickets = await Ticket.findAndCountAll({
        limit: pageSize,
        offset: offset,
        include: [
          { model: Empleado, as: 'Empleado' },
          { model: Pago, as: 'Pago' },
          {
            model: Prestamo, as: 'Prestamo', where: { estado: 'pendiente' }, // Filtrar por préstamos en estado 'pendiente'
            include: [
              { model: Cliente, as: 'Cliente' },
              {
                model: Articulo, as: 'Articulo', include: [
                  { model: Categoria, as: 'Categoria' },
                  { model: Vehiculo, as: 'Vehiculo' },
                  { model: Electrodomestico, as: 'Electrodomestico' },
                ]
              },
            ],
          }
        ],
      });
  
      // Calcular información de paginación
      const totalItems = tickets.count;
      const totalPages = Math.ceil(totalItems / pageSize);
  
      // Enviar respuesta con los datos y la información de paginación
      res.json({
        page,
        pageSize,
        totalItems,
        totalPages,
        data: tickets.rows
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error al obtener la lista de Tickets' });
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