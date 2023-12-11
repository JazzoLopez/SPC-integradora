// Importación de módulos y configuración de variables de entorno
import express, { urlencoded } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import User from './models/User.js';
import Log from './models/log.js';
import Service from './models/Device.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import Device from './models/Device.js';
import router from './routes/userRoutes.js';
import routerAdmin from './routes/adminRoutes.js';
import db from './configs/db.js'
import ApiRouter from './routes/apiRoutes.js';

dotenv.config({
    path: 'src/.env'
});

// Creación de una aplicación Express
const app = express();

// Configuración de middleware para procesar datos en formato JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// Configuración del middleware Morgan para el registro de solicitudes HTTP
app.use(morgan('dev'))
app.use(cookieParser());

// Configuración del motor de vistas Pug
app.set('view engine', 'pug');
app.set('views', './src/views');

// Configuración de Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('./src/public'));

// Configuración de Helmet para mejorar la seguridad de la aplicación mediante encabezados HTTP
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            // Configuración de las directivas de seguridad para diversos recursos
            // (scripts, estilos, fuentes, imágenes)
        },
    },
}));

// Configuración del servidor HTTP para escuchar en el puerto especificado en las variables de entorno
app.listen(process.env.SERVER_PORT, (request, response) => {
    console.log(`EL servicio HTTP ha sido iniciado... \n  El servicio esta escuchando por el puerto: ${process.env.SERVER_PORT}`)
});

// Autenticación y sincronización de la base de datos
try {
    await db.authenticate();
    console.log("La conexion a la base de datos ha sido exitosa");
    db.sync();
    console.log("Se ha sincronizado las tablas existentes en la base de datos")
} catch (err) {
    console.log(err)
    console.log("Ocurrio un error al intentar conectarse a la base de datos :c ");
}

// Configuración de rutas para la aplicación
app.use('/', router)
app.use('/admin-home', routerAdmin)
app.use('/api', ApiRouter)