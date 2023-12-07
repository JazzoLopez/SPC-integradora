import express from "express";
import { index, formLogin, formPassRecovery, userHome, authenticateUser, logout, confirmAccount} from "../controllers/userController.js";
import { adminHome } from "../controllers/adminController.js";
const router = express.Router();

//* PARA PRUEBAS:
router.get('/', (req, res) => {
    res.redirect('/inicio')
})


//PETICIONES GET
router.get('/inicio',index) //PINTA LA PAGINA GENERAL
router.get('/login', formLogin) //PINTA EL FORMULARIO DE LOGIN
router.get('/login/password-recovery', formPassRecovery) //PINTA EL FORMULARIO DE RECUPERAR CONTRASEÑA
router.get('/home', userHome) //PINTA EL INICIO DE USUARIOS
router.get('/admin-home', adminHome) //PINTA EL INICIO DE ADMIN JUNTO AL DASHBOARD
router.get('/logout', logout) //CIERRA SESION BORRANDO LA COOKIE
//POST
router.post('/login', authenticateUser) //VALIDA EL LOGIN
router.get('/login/confirmar-cuenta/:token', confirmAccount)



export default router