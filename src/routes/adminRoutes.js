import express from "express";
import { deleteService, deleteUSer, editUser, formRegister, formSaveService, formService, insertUser, saveService, saveUser, serviceControll, updateService, userControl } from "../controllers/adminController.js";


const router = express.Router()

router.get('/usuarios', userControl)//CRUD DE USUARIOS
router.get('/usuarios/nuevo-usuario', formRegister)
router.get('/servicios', serviceControll)
router.get('/usuarios/editar/:id', editUser)
router.get('/usuarios/eliminar/:id', deleteUSer)
router.get('/servicios/nuevo-servicio', formService)
router.get('/servicios/eliminar/:id', deleteService)
router.get('/servicios/editar/:id', updateService)

router.post('/servicios/editar/:id', saveService)
router.post('/usuarios/editar/:id', saveUser)
router.post("/usuarios/nuevo-usuario", insertUser)
router.post('/servicios/nuevo-servicio', formSaveService)



export default router