import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import Empleado from './empleado.model';
import Cliente from './cliente.model';
import Articulo from './articulo.model';

const Venta = db.define('Venta', {
  idempleado: {
    type: DataTypes.INTEGER,
  },
  idcliente: {
    type: DataTypes.INTEGER,
  },
  idarticulo: {
    type: DataTypes.INTEGER,
  },
  fecha_venta: {
    type: DataTypes.DATE,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
  },
  tipo_pago: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'venta',
});

// Definir la relación con la tabla Empleado
Venta.belongsTo(Empleado, { foreignKey: 'idempleado', as: 'Empleado' });

// Definir la relación con la tabla Prestamo
Venta.belongsTo(Cliente, { foreignKey: 'idcliente', as: 'Cliente' });

Venta.belongsTo(Articulo, { foreignKey: 'idarticulo', as: 'Articulo' });

export default Venta;
