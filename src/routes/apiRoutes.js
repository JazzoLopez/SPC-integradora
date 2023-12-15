// Importación del módulo 'express' y de funciones específicas desde el controlador
import express from 'express';
import {
    getAllUsers,
    getOneUser,
    insertOneUser,
    updateOneUser,
    deleteOneUser
} from '../controllers/apiController.js';

// Creación del enrutador utilizando express.Router()
const router = express.Router();

// Definición de rutas para peticiones GET
router.get('/usuarios/getAll', getAllUsers); // Obtiene todos los usuarios
router.get('/usuarios/getOne/:id', getOneUser); // Obtiene un usuario por su ID
// Definición de ruta para peticiones POST
router.post('/usuarios/insertOne', insertOneUser); // Inserta un nuevo usuario
// Definición de ruta para peticiones PUT
router.put('/usuarios/updateOne/:id', updateOneUser); // Actualiza un usuario por su ID
// Definición de ruta para peticiones DELETE
router.delete('/usuarios/deleteOne/:id', deleteOneUser); // Elimina un usuario por su ID

// Exportación del enrutador para ser utilizado en otras partes de la aplicación
export default router;
