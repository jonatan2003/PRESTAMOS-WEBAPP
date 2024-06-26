import { Request, Response } from 'express';
import Cliente from '../models/cliente.model';
import { Op } from 'sequelize'; // Agregar esta línea
import Empleado from '../models/empleado.model';
import Articulo from '../models/articulo.model';
import Prestamo from '../models/prestamo.model';
import Categoria from '../models/categoria.model';
import Usuario from '../models/usuario.model';
import Venta from '../models/venta.model';
import Vehiculo from '../models/vehiculo.model';
import Electrodomestico from '../models/electrodometisco.model';
import Pago from '../models/pago.model';
import DetalleVenta from '../models/detalleventa.model';
import CronogramaPagos from '../models/cronograma_pagos.model';
import Inventario from '../models/inventario.model';
import Ticket from '../models/ticket.model';
import ComprobanteVenta from '../models/comprobante_venta.model';
import TipoComprobante from '../models/tipo_comprobante.model';
import NotaCredito from '../models/notacredito.model';
//CLIENTES
export const searchClientes = async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const clientes = await Cliente.findAndCountAll({
      where: {
        [Op.or]: [
          { id: { [Op.like]: `%${searchTerm}%` } },
          { nombre: { [Op.like]: `%${searchTerm}%` } },
          { apellido: { [Op.like]: `%${searchTerm}%` } },
          { dni: { [Op.like]: `%${searchTerm}%` } },
          { telefono: { [Op.like]: `%${searchTerm}%` } },
          { ruc: { [Op.like]: `%${searchTerm}%` } },
          { razon_social: { [Op.like]: `%${searchTerm}%` } },
        ],
      },
      limit: pageSize,
      offset: offset,
    });

    const totalItems = clientes.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: clientes.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al realizar la búsqueda de clientes' });
  }
};
// EMPLEADOS
export const searchEmpleados = async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const empleados = await Empleado.findAndCountAll({
      where: {
        [Op.or]: [
          { id: { [Op.like]: `%${searchTerm}%` } },
          { nombre: { [Op.like]: `%${searchTerm}%` } },
          { apellidos: { [Op.like]: `%${searchTerm}%` } },
          { dni: { [Op.like]: `%${searchTerm}%` } },
         


        ],
      },
      limit: pageSize,
      offset: offset,
    });

    const totalItems = empleados.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: empleados.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al realizar la búsqueda de empleados' });
  }
};
// ARTICULOS
export const searchArticulos = async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const articulos = await Articulo.findAndCountAll({
      include: [
        { model: Categoria, as: 'Categoria' },
        { model: Vehiculo, as: 'Vehiculo' },
        { model: Electrodomestico, as: 'Electrodomestico' },
      ],
      where: {
        [Op.or]: [
          { id: { [Op.like]: `%${searchTerm}%` } },
          { '$Categoria.nombre$': { [Op.like]: `%${searchTerm}%` } },
          { '$Vehiculo.descripcion$': { [Op.like]: `%${searchTerm}%` } },
          { '$Electrodomestico.descripcion$': { [Op.like]: `%${searchTerm}%` } },
          { '$Electrodomestico.numero_serie$': { [Op.like]: `%${searchTerm}%` } },
          { '$Vehiculo.numero_serie$': { [Op.like]: `%${searchTerm}%` } },
          { '$Vehiculo.numero_motor$': { [Op.like]: `%${searchTerm}%` } },
          { '$Vehiculo.marca$': { [Op.like]: `%${searchTerm}%` } },
          { '$Vehiculo.modelo$': { [Op.like]: `%${searchTerm}%` } },
          { '$Vehiculo.color$': { [Op.like]: `%${searchTerm}%` } },
          { '$Electrodomestico.color$': { [Op.like]: `%${searchTerm}%` } },
          { '$Electrodomestico.marca$': { [Op.like]: `%${searchTerm}%` } },
          { '$Electrodomestico.modelo$': { [Op.like]: `%${searchTerm}%` } },
        ],
      },
      limit: pageSize,
      offset: offset,
    });

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
    res.status(500).json({ msg: 'Error al realizar la búsqueda de artículos' });
  }
};

export const searchInventario = async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const inventario = await Inventario.findAndCountAll({
      include: [
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
      where: {
        [Op.or]: [



        { id: { [Op.like]: `%${searchTerm as String}%` } },
        { idarticulo: { [Op.like]: `%${searchTerm as String}%` } },
        { estado_articulo: { [Op.like]: `%${searchTerm as String}%` } },
          { '$Articulo.id$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.Categoria.nombre$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.Vehiculo.descripcion$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.Electrodomestico.descripcion$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.Electrodomestico.numero_serie$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.Vehiculo.numero_serie$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.Vehiculo.numero_motor$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.Vehiculo.marca$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.Vehiculo.modelo$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.Vehiculo.color$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.Electrodomestico.color$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.Electrodomestico.marca$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.Electrodomestico.modelo$': { [Op.like]: `%${searchTerm}%` } },
        ],
      },
      limit: pageSize,
      offset: offset,
    });

    const totalItems = inventario.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: inventario.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al realizar la búsqueda de artículos en inventario' });
  }
};export const searchTicketsPrestamos = async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const tickets = await Ticket.findAndCountAll({
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
      where: {
        [Op.or]: [
          { id: { [Op.like]: `%${searchTerm}%` } },
          { '$Empleado.nombre$': { [Op.like]: `%${searchTerm}%` } },
          { '$Empleado.apellidos$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.estado$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.fecha_prestamo$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Cliente.dni$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Cliente.nombre$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Cliente.apellido$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Categoria.nombre$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Vehiculo.descripcion$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Electrodomestico.descripcion$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Electrodomestico.numero_serie$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Vehiculo.numero_serie$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Vehiculo.numero_motor$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Vehiculo.marca$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Vehiculo.modelo$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Vehiculo.color$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Electrodomestico.color$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Electrodomestico.marca$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Electrodomestico.modelo$': { [Op.like]: `%${searchTerm}%` } },
        ],
        '$Prestamo.id$': { [Op.ne]: null }, // Asegura que solo se incluyan tickets con préstamos
        idpago: { [Op.is]: null } // Asegura que solo se incluyan tickets donde idPago es null
      },
      limit: pageSize,
      offset: offset,
      order: [['id', 'DESC']],
    });

    const totalItems = tickets.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: tickets.rows,
    });
  } catch (error) {
    console.error('Error al realizar la búsqueda de tickets con préstamos:', error);
    res.status(500).json({ msg: 'Error al realizar la búsqueda de tickets con préstamos' });
  }
};

    // PRESTAMOS
    export const searchPrestamos = async (req: Request, res: Response) => {
      const { searchTerm } = req.query;
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
      const offset = (page - 1) * pageSize;
    
      try {
        const prestamos = await Prestamo.findAndCountAll({
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
          where: {
            [Op.or]: [
              { id: { [Op.like]: `%${searchTerm}%` } },
              { fecha_prestamo: { [Op.like]: `%${searchTerm as String}%` } },
              { fecha_devolucion: { [Op.like]: `%${searchTerm as String}%` } },
              { observacion: { [Op.like]: `%${searchTerm}%` } },
              { estado: { [Op.like]: `%${searchTerm}%` } },
              { '$Empleado.nombre$': { [Op.like]: `%${searchTerm}%` } },
              { '$Empleado.apellidos$': { [Op.like]: `%${searchTerm}%` } },
              { '$Cliente.nombre$': { [Op.like]: `%${searchTerm}%` } },
              { '$Cliente.apellido$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Categoria.nombre$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Vehiculo.descripcion$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Electrodomestico.descripcion$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Electrodomestico.numero_serie$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Vehiculo.numero_serie$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Vehiculo.numero_motor$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Vehiculo.marca$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Vehiculo.modelo$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Vehiculo.color$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Electrodomestico.color$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Electrodomestico.marca$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Electrodomestico.modelo$': { [Op.like]: `%${searchTerm}%` } },
              { '$Articulo.Electrodomestico.numero_serie$': { [Op.like]: `%${searchTerm}%` } },
            ],
          },
          limit: pageSize,
          offset: offset,
          
        });
    
        const totalItems = prestamos.count;
        const totalPages = Math.ceil(totalItems / pageSize);
    
        res.json({
          page,
          pageSize,
          totalItems,
          totalPages,
          data: prestamos.rows,
        });
      } catch (error) {
        console.error('Error al realizar la búsqueda de préstamos:', error);
        res.status(500).json({ msg: 'Error al realizar la búsqueda de préstamos' });
      }
    };


    export const searchComprobantesVentas = async (req: Request, res: Response) => {
      const { searchTerm } = req.query;
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
              model: NotaCredito, 
              as: 'NotaCredito' 
            },
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
              ],
            },
          ],
          where: {
            [Op.or]: [
              { id: { [Op.like]: `%${searchTerm}%` } }, // Buscar por ID de venta
              { num_serie: { [Op.like]: `%${searchTerm}%` } }, // Buscar por número de serie
              { '$Venta.Empleado.nombre$': { [Op.like]: `%${searchTerm}%` } }, // Buscar por nombre de empleado
              { '$Venta.Empleado.apellidos$': { [Op.like]: `%${searchTerm}%` } }, // Buscar por apellidos de empleado
              { '$Venta.Cliente.nombre$': { [Op.like]: `%${searchTerm}%` } }, // Buscar por nombre de cliente
              { '$Venta.Cliente.apellido$': { [Op.like]: `%${searchTerm}%` } }, // Buscar por apellido de cliente
              { '$NotaCredito.descripcion$': { [Op.like]: `%${searchTerm}%` } }, // Buscar por descripción de nota de crédito
              { estado: { [Op.like]: `%${searchTerm}%` } }, // Buscar por estado del comprobante de venta
            ]
          }
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
        res.status(500).json({ msg: 'Error al realizar la búsqueda de Comprobantes de Venta' });
      }
    };
    
    
  // CATEGORIA
  export const searchCategorias = async (req: Request, res: Response) => {
    const { searchTerm } = req.query;
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;
  
    try {
      const categorias = await Categoria.findAndCountAll({
        where: {
          [Op.or]: [
            { nombre: { [Op.like]: `%${searchTerm}%` } },
          ],
        },
        limit: pageSize,
        offset: offset,
      });
  
      const totalItems = categorias.count;
      const totalPages = Math.ceil(totalItems / pageSize);
  
      res.json({
        page,
        pageSize,
        totalItems,
        totalPages,
        data: categorias.rows,
      });
    } catch (error) {
      console.error('Error al realizar la búsqueda de categorías:', error);
      res.status(500).json({ msg: 'Error al realizar la búsqueda de categorías' });
    }
  };
  // USUARIOS
  export const searchUsuarios = async (req: Request, res: Response) => {
    const { searchTerm } = req.query;
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const offset = (page - 1) * pageSize;
  
    try {
      const usuarios = await Usuario.findAndCountAll({
        include: [{ model: Empleado, as: 'Empleado' }],
        where: {
          [Op.or]: [
            { '$Empleado.nombre$': { [Op.like]: `%${searchTerm}%` } },
            { usuario: { [Op.like]: `%${searchTerm}%` } },
            { permiso: { [Op.like]: `%${searchTerm}%` } },
          ],
        },
        limit: pageSize,
        offset: offset,
      });
  
      const totalItems = usuarios.count;
      const totalPages = Math.ceil(totalItems / pageSize);
  
      res.json({
        page,
        pageSize,
        totalItems,
        totalPages,
        data: usuarios.rows,
      });
    } catch (error) {
      console.error('Error al realizar la búsqueda de usuarios:', error);
      res.status(500).json({ msg: 'Error al realizar la búsqueda de usuarios' });
    }
  };
  //PAGOS
export const searchPagos = async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const pagos = await Pago.findAndCountAll({
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
      where: {
        [Op.or]: [
          { id: { [Op.like]: `%${searchTerm}%` } },
          { fecha_pago: { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Empleado.nombre$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Empleado.apellidos$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.fecha_prestamo$': { [Op.like]: `%${searchTerm}%` } },
          {'$Prestamo.fecha_devolucion$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.observacion$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Categoria.nombre$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Vehiculo.descripcion$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Electrodomestico.descripcion$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Electrodomestico.numero_serie$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Vehiculo.numero_serie$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Vehiculo.numero_motor$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Vehiculo.marca$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Vehiculo.modelo$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Vehiculo.color$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Electrodomestico.color$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Electrodomestico.marca$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Electrodomestico.modelo$': { [Op.like]: `%${searchTerm}%` } },
          { '$Prestamo.Articulo.Electrodomestico.numero_serie$': { [Op.like]: `%${searchTerm}%` } },

          // Aquí agrega las demás condiciones de búsqueda para cada campo que desees incluir
        ],
      },
      limit: pageSize,
      offset: offset,
    });

    const totalItems = pagos.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: pagos.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al realizar la búsqueda de pagos' });
  }
};
//VENTAS
export const searchVentas = async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const ventas = await Venta.findAndCountAll({
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
      where: {
        [Op.or]: [
          { '$Empleado.nombre$': { [Op.like]: `%${searchTerm}%` } },
          { '$Cliente.nombre$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.descripcion$': { [Op.like]: `%${searchTerm}%` } },
          { comprador: { [Op.like]: `%${searchTerm}%` } },
          { tipo_pago: { [Op.like]: `%${searchTerm}%` } },
          { fecha_venta: { [Op.like]: `%${searchTerm}%` } },
        ],
      },
      limit: pageSize,
      offset: offset,
    });

    const totalItems = ventas.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: ventas.rows,
    });
  } catch (error) {
    console.error('Error al obtener la lista de ventas:', error);
    res.status(500).json({ msg: 'Error al obtener la lista de ventas' });
  }
};
//DETALLEVENTAS
export const searchDetallesVenta = async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const detallesVenta = await DetalleVenta.findAndCountAll({
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
      where: {
        [Op.or]: [
          { '$Venta.comprador$': { [Op.like]: `%${searchTerm}%` } },
          { '$Articulo.descripcion$': { [Op.like]: `%${searchTerm}%` } },
          { cantidad: { [Op.like]: `%${searchTerm}%` } },
          { precio_unitario: { [Op.like]: `%${searchTerm}%` } },
        ],
      },
      limit: pageSize,
      offset: offset,
    });

    const totalItems = detallesVenta.count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: detallesVenta.rows,
    });
  } catch (error) {
    console.error('Error al obtener la lista de detalles de venta:', error);
    res.status(500).json({ msg: 'Error al obtener la lista de detalles de venta' });
  }
};


export const searchCronogramaPagos = async (req: Request, res: Response) => {
  const { searchTerm } = req.query;
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const { count, rows } = await CronogramaPagos.findAndCountAll({
      limit: pageSize,
      offset: offset,
      include: [
        {
          model: Prestamo,
          as: 'Prestamo',
          where: {
            estado: 'pendiente'
          },
          include: [
            {
              model: Cliente,
              as: 'Cliente',
              where: {
                dni: {
                  [Op.like]: `%${searchTerm}%`
                }
              }
            },
            {
              model: Articulo,
              as: 'Articulo',
              include: [
                { model: Categoria, as: 'Categoria' },
                { model: Vehiculo, as: 'Vehiculo' },
                { model: Electrodomestico, as: 'Electrodomestico' },
              ]
            }
          ]
        }
      ]
    });

    const totalItems = count;
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      page,
      pageSize,
      totalItems,
      totalPages,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching for payment schedules' });
  }
};