// Importación del objeto 'DataTypes' y de la instancia de la base de datos ('db')
import { DataTypes } from "sequelize";
import db from '../configs/db.js';
import User from "./User.js";
import Device from "./Device.js";

// Definición del modelo 'Service' para la tabla 'tbb_services'
const Service = db.define('tbb_services', {
    // Definición de columnas y sus tipos de datos
    description: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('No iniciado', 'En proceso', 'Finalizado'),
        default: 'No iniciado'
    },
    typeService: {
        type: DataTypes.ENUM('Correctivo', 'Preventivo')
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Definición de la clave foránea que referencia la tabla 'User'
        references: {
            model: User,
            key: 'id'
        }
    },
    deviceID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Definición de la clave foránea que referencia la tabla 'Device'
        references: {
            model: Device,
            key: 'id'
        }
    }
});

// Define asociaciones entre modelos
Service.belongsTo(User, { foreignKey: 'userID' });
Service.belongsTo(Device, { foreignKey: 'deviceID' });

export default Service;
