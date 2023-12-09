import User from "../models/User.js";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
        console.log('Obteniendo todos los usuarios de la base de datos');
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

const getOneUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({
            where: { id }
        });
        res.json({ user });
        console.log(`Obteniendo datos del usuario con id: ${id}`);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

const insertOneUser = async (req, res) => {
    const { name, lastname, email, tel, password, token, verified } = req.body;
    console.log(`El nombre es ${name}`);
    console.log(`El apellido es ${lastname}`);
    console.log(`El correo electrónico es ${email}`);
    console.log(`El teléfono es ${tel}`);
    console.log(`La contraseña es ${password}`);
    console.log(`El token es ${token}`);
    console.log(`El estado de verificación es ${verified}`);

    try {
        const newUser = await User.create({
            name,
            lastname,
            email,
            tel,
            password,
            token,
            verified
        });
        res.json(newUser);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

const updateOneUser = async (req, res) => {
    const { name, lastname, email, tel, password, token, verified } = req.body;
    const id = req.params.id;

    let newData = { name, lastname, email, tel, password, token, verified };

    try {
        const result = await User.update(newData, {
            where: { id }
        });

        if (result[0] === 1) {
            res.status(200).json({ message: 'Usuario actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

const deleteOneUser = async (req, res) => {
    const id = req.params.id;
    try {
        await User.destroy({
            where: { id }
        });
        console.log(`El usuario con id: ${id} fue eliminado`);
        res.json("Usuario eliminado correctamente");
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

export { getAllUsers, getOneUser, insertOneUser, updateOneUser, deleteOneUser };
