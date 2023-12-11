// Importación de Sequelize y dotenv
import Sequelize from 'sequelize';
import dotenv from 'dotenv';

// Configuración de las variables de entorno utilizando dotenv
dotenv.config({
    path: 'src/.env'
});

// Creación de una instancia Sequelize para la conexión a la base de datos MySQL
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Puerto con el que se conecta la BD
    dialect: "mysql",
    define: {
        timestamps: true,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

// Exportación de la instancia Sequelize para ser utilizada en otras partes de la aplicación
export default db;
