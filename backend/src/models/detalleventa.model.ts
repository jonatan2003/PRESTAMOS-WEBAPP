import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import Venta from './venta.model';
import Articulo from './articulo.model';


const DetalleVenta = db.define('DetalleVenta', {
  idventa: {
    type: DataTypes.INTEGER,
  },
  idarticulo: {
    type: DataTypes.INTEGER,
  },
  cantidad: {
    type: DataTypes.INTEGER,
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
  },
 
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'detalleventa',
});

// Definir la relación con la tabla Venta
DetalleVenta.belongsTo(Venta, { foreignKey: 'idventa', as: 'Venta' });
DetalleVenta.belongsTo(Articulo, { foreignKey: 'idarticulo', as: 'Articulo' });

export default DetalleVenta;
