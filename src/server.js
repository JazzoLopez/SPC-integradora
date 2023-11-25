import  express  from "express";
import dotenv from 'dotenv';
import morgan from 'morgan'
import cookieParser from 'cookie-parser';
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