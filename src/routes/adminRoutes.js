import express from "express";
import { deleteUSer, editUser, formRegister, formService, insertUser, serviceControll, userControl } from "../controllers/adminController.js";


const router = express.Router()

router.get('/usuarios', userControl)//CRUD DE USUARIOS
router.get('/usuarios/nuevo-usuario', formRegister)
router.get('/servicios', serviceControll)
router.get('/usuarios/editar/:id', editUser)
router.get('/usuarios/borrar/:id', deleteUSer)
router.get('/servicios/nuevo-servicio', formService)



router.post("/usuarios/nuevo-usuario", insertUser)



export default router