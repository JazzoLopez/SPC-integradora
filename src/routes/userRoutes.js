import express from "express";
import { index, formLogin, formPasswordRecovery, userHome, authenticateUser, logout, confirmAccount, formPasswordUpdate, emailChangePassword, updatePassword} from "../controllers/userController.js";
import { adminHome } from "../controllers/adminController.js";
const router = express.Router();

//* PARA PRUEBAS:
router.get('/', (req, res) => {
    res.redirect('/inicio')
})


//PETICIONES GET
router.get('/inicio',index) //PINTA LA PAGINA GENERAL
router.get('/login', formLogin) //PINTA EL FORMULARIO DE LOGIN
router.get('/home', userHome) //PINTA EL INICIO DE USUARIOS
router.get('/admin-home', adminHome) //PINTA EL INICIO DE ADMIN JUNTO AL DASHBOARD
router.get('/logout', logout) //CIERRA SESION BORRANDO LA COOKIE
router.post('/login', authenticateUser) //VALIDA EL LOGIN
router.get('/login/confirmar-cuenta/:token', confirmAccount)
router.get('/login/cambiar-contrase%C3%B1a', formPasswordRecovery)
router.post('/login/cambiar-contrase%C3%B1a', emailChangePassword)

router.get('/login/actualizar-contrase%C3%B1a/:token', formPasswordUpdate)
router.post('/login/actualizar-contrase%C3%B1a/:token',updatePassword)



export default router