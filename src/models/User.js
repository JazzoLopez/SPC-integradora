// Importación del objeto 'DataTypes', de la instancia de la base de datos ('db'), y de la librería 'bcrypt'
import { DataTypes } from "sequelize";
import db from '../configs/db.js';
import bcrypt from 'bcrypt';

// Definición del modelo 'User' para la tabla 'tbb_users'
const User = db.define('tbb_users', {
    // Definición de columnas y sus tipos de datos
    name: {
        type: DataTypes.STRING,
        allowNull: false //* Lo hace obligatorio
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false //* Lo hace obligatorio
    },
    tel: {
        type: DataTypes.STRING,
        allowNull: false // Campo que se llena con el número de teléfono
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false // Campo para llenar con email
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false // Se llena con contraseña
    },
    token: {
        type: DataTypes.STRING,
        unique: true,
        defaultValue: ""
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    type: {
        type: DataTypes.ENUM('Usuario', 'Administrador'),
        defaultValue: 'Usuario'
    }
}, {
    // Hooks para ejecutar funciones antes de la creación del usuario
    hooks: {
        beforeCreate: async (user) => {
            // Generación de un hash para la contraseña antes de almacenarla
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

// Método personalizado para verificar la contraseña del usuario
User.prototype.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

// Exportación del modelo 'User' para ser utilizado en otras partes de la aplicación
export default User;