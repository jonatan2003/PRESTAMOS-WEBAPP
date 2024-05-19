import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import DetalleVenta from './detalleventa.model';

const Boleta = db.define('Boleta', {
    igv: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      descuento: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
      iddetalleventa: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
}, {
    createdAt: false,
    updatedAt: false,
    tableName: 'boleta',
  });
  

Boleta.belongsTo(DetalleVenta, { foreignKey: 'iddetalleventa', as: 'Detalleventa' });

export default Boleta;