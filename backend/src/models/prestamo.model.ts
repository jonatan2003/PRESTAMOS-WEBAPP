import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import Articulo from './articulo.model';
import Cliente from './cliente.model';

const Prestamo = db.define('Prestamo', {
  idcliente: {
    type: DataTypes.INTEGER,
  },
  idarticulo: {
    type: DataTypes.INTEGER,
  },
  fecha_prestamo: {
    type: DataTypes.DATE,
  },
  fecha_devolucion: {
    type: DataTypes.DATE,
  },
  monto_prestamo: {
    type: DataTypes.DECIMAL(10, 2),
  },
  monto_pago: {
    type: DataTypes.DECIMAL(10, 2),
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'prestamo',
});

// Definir las relaciones con las tablas Empleado, Articulo y Cliente
Prestamo.belongsTo(Articulo, { foreignKey: 'idarticulo', as: 'Articulo' });
Prestamo.belongsTo(Cliente, { foreignKey: 'idcliente', as: 'Cliente' });

export default Prestamo;
