import { DataTypes } from 'sequelize';
import db from '../db/connection.db';

const TipoSerie = db.define('TipoSerie', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  createdAt: false,
  updatedAt: false,
  tableName: 'tipo_serie',
});

export default TipoSerie;
