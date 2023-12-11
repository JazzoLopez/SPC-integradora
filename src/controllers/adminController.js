import User from "../models/User.js";
import Service from "../models/Service.js";
import { check, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import Log from "../models/log.js";
import { generateJwt, generateToken, decodeJwt } from "../libs/token.js";
import { emailChangeFinal, emailChangeStatus, emailRegister } from "../libs/emails.js";
import Device from "../models/Device.js";
import axios from "axios";


const insertUser = async (req, res) => {

    await check("name").notEmpty().withMessage("El nombre es obligatorii").run(req) //* Express checa el nombre que no venga vacio AHORA MISMO
    await check("lastname").notEmpty().withMessage("Los apellidos son obligatorios").run(req) //* Express checa el nombre que no venga vacio AHORA MISMO
    await check("tel").notEmpty().withMessage("El numero telefonico es obligatorio").run(req) //* Express checa el nombre que no venga vacio AHORA MISMO
    await check("email").notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Ese no es un formato valido").run(req) // Express checa que el email no venga vacio y que el formato sea el correcto
    await check("password").notEmpty().withMessage("La contraseña es obligatoria").isLength({ min: 8, max: 20 }).withMessage("La contraseña debe de ser de almenos 8 caracteres").run(req)// Express checa que la contraseña no venga vacia y que tenga almenos 8 caracteres
    await check("repeatPassword").notEmpty().withMessage("La contraseña es obligatoria").isLength({ min: 8, max: 20 }).withMessage("La contraseña debe de ser de almenos 8 caracteres").equals(req.body.password).withMessage("Las contraseñas no son iguales").run(req)//Express checa que al confirmar la contraseña no venga vacia, y que verifique que las contraseñas coincidan
    //res.json(validationResult(req));
    
    let resultValidate = validationResult(req);
    const userExists = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    const { name, lastname, tel, email, password } = req.body;

    if (userExists) {

        res.render("auth/register.pug", ({
            page:"Registro de usuarios",
            errors: [{ msg: `El usuario ${req.body.email} ya existe` }], //Si el usuario ya esta resgitrado, manda mensaje de que ya existe 
            user: {
                name: req.body.name,
                email: req.body.email,
                tel:req.body.tel
            },


        }))
    }
    else if (resultValidate.isEmpty()) {
        const token = generateToken();

        let newUser = await User.create({
            name, lastname, tel, email, password, token
        });

        const logs = await Log.create(
            {userId:newUser.id,
            action:`Se actualizaron los datos del usuario con el id ${newUser.id}`}
        )
        res.render("templates/message.pug", {
           page:"Registro de usuarios",
            message: email,
            type: "success"

        })

        emailRegister({ email, name, token });

    }

    else {
        res.render("auth/register.pug", ({
            page:"Registro de usuarios",
            errors: resultValidate.array(), user: {
                name: req.body.name,
                email: req.body.email,
                tel: req.body.tel
            },

        }))
    }


}


const adminHome = async (req, res) => {
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const name = adminData.type
    console.log(name);

    if (name !== "Administrador") {
        return res.redirect('/login');
    }
   

    const device = await Device.findAll({ where: {} })
    const deviceName = device.map(device => device.typeDevice)
    console.log(deviceName)
    const total = await Device.count({ where: {} })

    let cifras = 100 / total
    console.log(cifras)
    const laptop = await Device.count({ where: { typeDevice: "Laptop" } })
    const Impresora = await Device.count({ where: { typeDevice: "Impresora" } })
    const Fotocopiadora = await Device.count({ where: { typeDevice: "Fotocopiadora" } })
    const Multifuncional = await Device.count({ where: { typeDevice: "Multifuncional" } })
    const Desktop = await Device.count({ where: { typeDevice: "Desktop" } })
    const response = await fetch('http://worldtimeapi.org/api/ip');
    const data = await response.json();

    // Formatea la hora a un formato legible
    const horaActual = new Date(data.utc_datetime).toLocaleTimeString();
    let mensaje = '';
    if (horaActual >= 5 && horaActual < 12) {
      mensaje = '¡Buenos días!';
    } else if (horaActual >= 12 && horaActual < 18) {
      mensaje = '¡Buenas tardes!';
    } else {
      mensaje = '¡Buenas noches!';
    }
    res.render('admin/adminHome', {
        page: "Home",
        horaActual,
        mensaje,
        deviceName,
        laptop,
        Impresora,
        Fotocopiadora,
        Multifuncional,
        Desktop, cifras
    })



}
const userControl = async (req, res) => {
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const name = adminData.type
    if (name !== "Administrador") {
        return res.redirect('/login');
    }
    console.log(name);
 
    const response = await axios.get('http://localhost:3000/api/usuarios/getAll');
    const users = response.data;

    
    res.render("admin/userManagment", {
        page: "Gestion de usuarios",
        users
    })
}

const serviceControll = async (req, res) => {
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const name = adminData.type
    console.log(name);
    const services = await Service.findAll({ where: {},include:{model:Device} })

    if (name !== "Administrador") {
        return res.redirect('/login');
    }
    res.render("admin/serviceManagment", {
        page: "Gestion de servicios",
        services
    })
}

const formRegister = async (req, res) => {
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const name = adminData.type
    console.log(name);

    if (name !== "Administrador") {
        return res.redirect('/login');
    }
    res.render('auth/register',{
        page: "Registro de usuario"
    })
}

const editUser = async (req, res) => {

    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const name = adminData.type
    console.log(name);
    const users = await User.findAll({ where: {} })

    if (name !== "Administrador") {
        return res.redirect('/login');
    }
    
    const id = req.params.id;
    const userData = await User.findOne(({ where: { id } }))
    if (userData.id == 1) {
        return res.redirect('/admin-home/usuarios')
    }

    res.render('admin/editUser', {
        userData,
        page:"Editar usuario"
    })
}

const saveUser = async (req, res) => {
    //TODO: Post de actualizar 

    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const users = await User.findAll({ where: {} })

    if (adminData.name !== "Administrador" && adminData.id !== 1) {
        return res.redirect('/login');
    }
    
    await check("name").notEmpty().withMessage("El nombre es obligatorii").run(req) //* Express checa el nombre que no venga vacio AHORA MISMO
    await check("lastname").notEmpty().withMessage("Los apellidos son obligatorios").run(req) //* Express checa el nombre que no venga vacio AHORA MISMO
    await check("tel").notEmpty().withMessage("El numero telefonico es obligatorio").run(req) //* Express checa el nombre que no venga vacio AHORA MISMO
    await check("email").notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Ese no es un formato valido").run(req)
    await check("password").notEmpty().withMessage("La contraseña es obligatoria").isLength({ min: 8, max: 20 }).withMessage("La contraseña debe de ser de almenos 8 caracteres").run(req)
    await check("repeatPassword").notEmpty().withMessage("La contraseña es obligatoria").isLength({ min: 8, max: 20 }).withMessage("La contraseña debe de ser de almenos 8 caracteres").equals(req.body.password).withMessage("Las contraseñas no son iguales").run(req)
    await check("type").notEmpty().withMessage("Selecciona almenos uno").run(req)
const resultValidate = validationResult(req)
const data = req.body
const {name, tel, lastname, email, password, repeatPassword, type} = data
    if (resultValidate.isEmpty()) {
        const user = await User.findOne({where:{email}})
        user.name = name
        user.tel = tel
        user.email = email
        user.password = repeatPassword,
        user.type = type
        user.lastname = lastname
        user.save()
        console.log("Ususario actualizado satisfactoriamente")
        const logs = await Log.create(
            {userId:user.id,
            action:`Se actualizaron los datos del usuario con el id ${user.id}`}
        )
        res.redirect("/admin-home/usuarios")
}
else{
    res.render("admin/editUser", ({
        page:"Editar usuario",
        errors: resultValidate.array(), 
        user: {
            name: req.body.name,
            email: req.body.email,
            tel: req.body.tel
        },
        userData:{
            name, tel, lastname, email, password, repeatPassword, type
        }

    }))
}

}

const formService = async (req, res) => {

    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const name = adminData.type
    console.log(name);
    const users = await User.findAll({ where: {} })

    if (name !== "Administrador") {
        return res.redirect('/login');
    }
    res.render('admin/formService',{
        page: "Registro de servicios"
    })
}




const deleteUSer = async (req, res) => {
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const name = adminData.type
    console.log(name);
    const users = await User.findAll({ where: {} })

    if (name !== "Administrador") {
        return res.redirect('/login');
    }

    const id = req.params.id;
    const userData = await User.findOne(({ where: { id } }))
    if (userData.type == "Administrador") {
        return res.redirect('/admin-home/usuarios')
    }

    const serviceData = await Service.findAll({ where: { userID: id } })
    await Log.create({
        userId: id,
        action: "Usuario y servicios ligados eliminados"
    })
    serviceData.userID = null
    Service.destroy({ where: { userID: id } })
    User.destroy({ where: { id } })
    return res.redirect('/admin-home/usuarios')
}

const deleteService = async (req, res) => {
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const name = adminData.type
    console.log(name);
    const users = await User.findAll({ where: {} })

    if (name !== "Administrador") {
        return res.redirect('/login');
    }

    const id = req.params.id
    Service.destroy({ where: { id } })
    res.redirect('/admin-home/servicios')

}   


const formSaveService = async (req, res) => {
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const name = adminData.type
    console.log(name);
    const users = await User.findAll({ where: {} })

    if (name !== "Administrador") {
        return res.redirect('/login');
    }

    await check("email").notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Ese no es un formato valido").run(req)
    await check("description").notEmpty().withMessage("La descripcion es obligatoria").run(req)
    await check("typeService").notEmpty().withMessage("Selecciona almenos uno").run(req)
    await check("typeDevice").notEmpty().withMessage("Selecciona almenos uno").run(req)
    await check("status").notEmpty().withMessage("Selecciona almenos uno").run(req)
    await check("brand").notEmpty().withMessage("LA marca es obligatoria").isLength({ min: 2, max: 50 }).withMessage("Debe tener minimo 2 y maximo 50 caracteres").run(req)
    await check("model").notEmpty().withMessage("El modelo es obigatorio").isLength({ min: 2, max: 50 }).withMessage("Debe tener minimo 2 y maximo 50 caracteres").run(req)
    await check("serialNumber").notEmpty().withMessage("EL numero de serie es obligatorio").isLength({ min: 6, max: 20 }).withMessage("Debe tener minimo 6 y maximo 20 caracteres").run(req)
    const resultValidate = validationResult(req)
    const data = req.body
    const { email, description, typeService, typeDevice, status, brand, model, serialNumber } = req.body
    //res.json(resultValidate)
    if (resultValidate.isEmpty()) {

        const userData = await User.findOne({ where: { email } })
        if (!userData) {
            res.render('admin/formService',{
                page:"Registro de servicios",
                errors:[{msg:`El usuario asociado con el correo: ${email} no existe`}],
                formData:{email, description, typeService, typeDevice, status, brand, model, serialNumber }
            })
        }
        else {
            const saveDevice = await Device.create({
                typeDevice, brand, model, serialNumber
            })
            const saveService = await Service.create({
                description, status, typeService, userID: userData.id, deviceID: saveDevice.id
            })
            res.redirect('/admin-home/servicios')
        }
    }else{
        res.render('admin/formService',{
            page: "Registro de servicios",
            errors:resultValidate.array(),
            formData:{email, description, typeService, typeDevice, status, brand, model, serialNumber }
        })
    }
}

const updateService = async(req, res) => {
    const id = req.params.id
    const ServiceData = await Service.findOne({where:{id}, include:{model:Device}})
    const {userID} = ServiceData
    const userData = await User.findOne({where:{id:userID}})
    res.render('admin/editService',{
    page:"Editar servicio",
    ServiceData,
    userData
        })
}

const saveService = async (req, res) => {
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const name = adminData.type
    console.log(name);
    const users = await User.findAll({ where: {} })

    if (name !== "Administrador") {
        return res.redirect('/login');
    }

    await check("email").notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Ese no es un formato valido").run(req)
    await check("description").notEmpty().withMessage("La descripcion es obligatoria").run(req)
    await check("typeService").notEmpty().withMessage("Selecciona almenos uno").run(req)
    await check("typeDevice").notEmpty().withMessage("Selecciona almenos uno").run(req)
    await check("status").notEmpty().withMessage("Selecciona almenos uno").run(req)
    await check("brand").notEmpty().withMessage("LA marca es obligatoria").isLength({ min: 2, max: 50 }).withMessage("Debe tener minimo 2 y maximo 50 caracteres").run(req)
    await check("model").notEmpty().withMessage("El modelo es obigatorio").isLength({ min: 2, max: 50 }).withMessage("Debe tener minimo 2 y maximo 50 caracteres").run(req)
    await check("serialNumber").notEmpty().withMessage("EL numero de serie es obligatorio").isLength({ min: 6, max: 20 }).withMessage("Debe tener minimo 6 y maximo 20 caracteres").run(req)
    const resultValidate = validationResult(req)
    const data = req.body
    const { email, description, typeService, typeDevice, status, brand, model, serialNumber } = req.body

    if (resultValidate.isEmpty()) {

        const userData = await User.findOne({ where: { email } })
        if (!userData) {
            res.render('admin/editService',{
                page:"Editar servicio",
                errors:[{msg:`El usuario asociado con el correo: ${email} no existe`}],
                userData:email,
                ServiceData:{
                    id:req.params.id,
                    description,
                    typeService,
                    status,
                    description,
                    tbb_device:{
                        brand,
                        model,
                        serialNumber,
                        typeDevice
                    }}
            })
        }
        else {
            
            console.log(email)
        
            const id = req.params.id
            console.log(id)
            const dataService = await Service.findOne({where:{id}})

            dataService.description = description
            dataService.status = status
            dataService.typeService = typeService
            dataService.userID = userData.id
            dataService.save();
            
            const dataDevice = await Device.findOne({where:{id:dataService.deviceID}})
            dataDevice.brand = brand;
            dataDevice.model = model;
            dataDevice.serialNumber = serialNumber
            dataDevice.typeDevice = typeDevice
            dataDevice.save();

            if(dataService.status == "En proceso"){
                emailChangeStatus({email, status});
            }else if(dataService.status == "Finalizado"){
                emailChangeFinal( {email, status});
            }
    
            res.redirect('/admin-home/servicios')
        }
    }else{
        res.render('admin/editService',{
            page: "Editar servicio",
            errors:resultValidate.array(),
            userData:{email},
                ServiceData:{
                    id:req.params.id,
                    description,
                    typeService,
                    status,
                    description,
                    tbb_device:{
                        brand,
                        model,
                        serialNumber,
                        typeDevice
                    }}
        })
    }
}



    export {saveService, updateService, adminHome, userControl, serviceControll, formRegister, insertUser, editUser, deleteUSer, deleteService,formService, formSaveService, saveUser }
