import { DataTypes } from 'sequelize';
import db from '../db/connection.db';

const Categoria = db.define('Categoria', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'categoria',
});

export default Categoria;
