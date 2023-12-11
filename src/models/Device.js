// Importación del objeto 'DataTypes' y de la instancia de la base de datos ('db')
import { DataTypes } from "sequelize";
import db from '../configs/db.js';

// Definición del modelo 'Device' para la tabla 'tbb_devices'
const Device = db.define('tbb_devices', {
    // Definición de columnas y sus tipos de datos
    typeDevice: {
        type: DataTypes.ENUM('Impresora', 'Laptop', 'Fotocopiadora', 'Multifuncional', 'Desktop'),
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serialNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

// Exportación del modelo 'Device' para ser utilizado en otras partes de la aplicación
export default Device;
