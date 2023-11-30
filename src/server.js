import  express  from "express";
import dotenv from 'dotenv';
import morgan from 'morgan'
import cookieParser from 'cookie-parser';
import db from "./configs/db.js";
const app = express();

dotenv.config({
    path: 'src/.env'
})

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));//*Estilizacion de peticiones de terminal

// HABILITAR COOKIEPARSER PARA LEER, ESCRIBIR Y ELIMINAR EN LAS COOKIES DEL NAVEGADOR.
app.use(cookieParser({
    cookie: true
}))

//TEMPLATE ENGINE
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