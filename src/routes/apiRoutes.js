import express from 'express';
import { getAllUsers, getOneUser, insertOneUser, updateOneUser, deleteOneUser } from '../controllers/apiController.js';

const router = express.Router();

router.get('/usuarios/getAll', getAllUsers);
router.get('/usuarios/getOne/:id', getOneUser);
router.post('/usuarios/insertOne', insertOneUser);
router.put('/usuarios/updateOne/:id',updateOneUser);
router.delete('/usuarios/deleteOne/:id',deleteOneUser);

export default router;
