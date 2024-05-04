import { DataTypes } from 'sequelize';
import db from '../db/connection.db';
import Empleado from './empleado.model';

const Usuario = db.define('Usuario', {
  id_empleado: {
    type: DataTypes.INTEGER,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Asegura que el nombre de usuario sea único
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  permiso: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  modelName: 'Usuario',
  tableName: 'usuario',
});

// Establece la relación con Empleado
Usuario.belongsTo(Empleado, { foreignKey: 'id_empleado', as: 'Empleado' });

export default Usuario;