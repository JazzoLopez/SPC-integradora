import express, {urlencoded} from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import User from './models/User.js';
import Log from './models/log.js';
import Service from './models/Device.js';
import cookieParser from 'cookie-parser';
import Device from './models/Device.js';
import router from './routes/userRoutes.js';
import routerAdmin from './routes/adminRoutes.js';
import db from './configs/db.js'
import ApiRouter from './routes/apiRoutes.js';
dotenv.config({
    path: 'src/.env'
})
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended:false
}));

app.use(morgan('dev'))
app.use(cookieParser());

app.set('view engine', 'pug');
app.set('views', './src/views');
app.use(express.static('./src/public'));

app.listen(process.env.SERVER_PORT, (request, response) => {
    console.log(`EL servicio HTTP ha sido iniciado... \n  El servicio esta escuchando por el puerto: ${process.env.SERVER_PORT}`)
});

try{
    await db.authenticate();
     console.log("La conexion a la base de datos ha sido exitosa");
     db.sync();
     console.log("Se ha sincronizado las tablas existentes en la base de datos")
 }
 catch(err){
    console.log(err)
     console.log("Ocurrio un error al intentar conectarse a la base de datos :c ");
 
 }



app.use('/',router)
app.use('/admin-home', routerAdmin)
app.use('/api', ApiRouter)
