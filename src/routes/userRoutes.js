// Importación del módulo 'express' y de funciones específicas desde el controlador
import express from "express";
import {
    index,
    formLogin,
    formPasswordRecovery,
    userHome,
    authenticateUser,
    logout,
    confirmAccount,
    formPasswordUpdate,
    emailChangePassword,
    updatePassword
} from "../controllers/userController.js";
import {
    adminHome
} from "../controllers/adminController.js";

// Creación del enrutador utilizando express.Router()
const router = express.Router();

//* PARA PRUEBAS: Redirección de la raíz a '/inicio'
router.get('/', (req, res) => {
    res.redirect('/inicio');
});

// Definición de rutas para peticiones GET
router.get('/inicio', index); //  LA PAGINA GENERAL
router.get('/login', formLogin); //  EL FORMULARIO DE LOGIN
router.get('/home', userHome); //  EL INICIO DE USUARIOS
router.get('/admin-home', adminHome); //  EL INICIO DE ADMIN JUNTO AL DASHBOARD
router.get('/logout', logout); // CIERRA SESIÓN 
router.get('/login/confirmar-cuenta/:token', confirmAccount); // CONFIRMA LA CUENTA
router.get('/login/cambiar-contrase%C3%B1a', formPasswordRecovery);  // RESTABLECE COONTRASENIA
router.get('/login/actualizar-contrase%C3%B1a/:token', formPasswordUpdate);  // ACTUALIZA CONTRASENIA

// Definición de rutas para peticiones POST
router.post('/login', authenticateUser); // VALIDA EL LOGIN
router.post('/login/cambiar-contrase%C3%B1a', emailChangePassword);
router.post('/login/actualizar-contrase%C3%B1a/:token', updatePassword);

export default router;
