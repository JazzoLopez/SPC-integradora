import User from "../models/User.js";
import Service from "../models/Service.js";
import { Chart } from "chart.js";
import { check, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import Log from "../models/log.js";
import { generateToken, generateJwt, decodeJwt } from "../lib/token.js";
import Device from "../models/Device.js";
import { emailRegister } from "../lib/emails.js";



const insertUser = async (req, res) => {

    
    console.log(`Nombre: ${req.body.name}`);
    //*Validando
    await check("name").notEmpty().withMessage("El nombre es obligatorii").run(req) //* Express checa el nombre que no venga vacio AHORA MISMO
    await check("lastname").notEmpty().withMessage("Los apellidos son obligatorios").run(req) //* Express checa el nombre que no venga vacio AHORA MISMO
    await check("tel").notEmpty().withMessage("El numero telefonico es obligatorio").run(req) //* Express checa el nombre que no venga vacio AHORA MISMO
    await check("email").notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Ese no es un formato valido").run(req)
    await check("password").notEmpty().withMessage("La contraseña es obligatoria").isLength({ min: 8, max: 20 }).withMessage("La contraseña debe de ser de almenos 8 caracteres").run(req)
    await check("repeatPassword").notEmpty().withMessage("La contraseña es obligatoria").isLength({ min: 8, max: 20 }).withMessage("La contraseña debe de ser de almenos 8 caracteres").equals(req.body.password).withMessage("Las contraseñas no son iguales").run(req)
    //res.json(validationResult(req));//*PARA VER EL JSON
    console.log(`El total de errores fueron de: ${validationResult.length} errores de validación`)

    let resultValidate = validationResult(req);
    const userExists = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    const { name, lastname, tel, email, password } = req.body;

    if (userExists) {

        res.render("auth/register.pug", ({
            page: "New account",
            errors: [{ msg: `the user ${req.body.email} already exist` }],
            user: {
                name: req.body.name,
                email: req.body.email
            },


        }))
    }
    else if (resultValidate.isEmpty()) {
        const token = generateToken();
        //*Creando usuario */

        let newUser = await User.create({
             name, lastname, tel, email, password, token
        });
        res.render("templates/message.pug", {
            page: "Cuenta creada satisfactoriamente",
            message: email,
            type: "success"

        }) //* Esta linea es la que inserta

        emailRegister({ email, name, token });

    }

    else {
        res.render("auth/register.pug", ({
            page: "Nueva cuenta",
            errors: resultValidate.array(), user: {
                name: req.body.name,
                email: req.body.email
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
    function obtenerSaludo() {
        const horaActual = new Date().getHours();
        const minutos = new Date().getMinutes()
        let saludo;

        if (horaActual >= 5 && horaActual < 12) {
            saludo = 'Buenos días, son las ' + horaActual + " horas con " + minutos + " minutos";
        } else if (horaActual >= 12 && horaActual < 18) {
            saludo = 'Buenas tardes, son las ' + horaActual + " horas con " + minutos + "minutos";
        } else {
            saludo = 'Buenas noches, son las ' + horaActual + " horas con " + minutos + " minutos";
        }

        return saludo;
    }
    
    const device = await Device.findAll({where: {}})
    const deviceName = device.map(device => device.typeDevice)
    console.log(deviceName)
    const total = await Device.count({where:{}})
    
    let cifras = 100 / total
    console.log(cifras)
    const laptop =await  Device.count({ where:{ typeDevice:"Laptop" }})
    const Impresora =await  Device.count({ where:{ typeDevice:"Impresora" }})
    const Fotocopiadora =await  Device.count({ where:{ typeDevice:"Fotocopiadora" }})
    const Multifuncional =await  Device.count({ where:{ typeDevice:"Multifuncional" }})
    const Desktop = await  Device.count({ where:{ typeDevice:"Desktop" }})
    const saludo = obtenerSaludo();

    res.render('admin/adminHome', {
        page: "Home",
        saludo,
        deviceName,
        laptop,
        Impresora,
        Fotocopiadora,
        Multifuncional,
        Desktop,cifras
        })



}
const userControl = async(req, res) => {
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const name = adminData.type
    console.log(name);
    const users = await User.findAll({where:{}})
   
    if (name !== "Administrador") {
        return res.redirect('/login');
    }
    res.render("admin/userManagment",{
        page:"Gestion de usuarios",
        users
    })
}

const serviceControll = async(req, res) => {
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('/login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    const adminData = await User.findOne({ where: { id: userID } })
    const name = adminData.type
    console.log(name);
    const services = await Service.findAll({where:{}})
   
    if (name !== "Administrador") {
        return res.redirect('/login');
    }
    res.render("admin/serviceManagment",{
        page:"Gestion de servicios",
        services
    })
}

const formRegister = async(req, res) => {
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
    res.render('auth/register')
}

const editUser = async(req, res) => {
    const id = req.params.id;
    const userData = await User.findOne({where:{id}})   
    res.render('admin/editUser',{
        userData    
    })
}

const saveUser = async (req, res) => {
    //TODO: Post de actualizar 
}

//TODO: fORMULARIO DE SERVICIOS
const formService = (req, res ) => {
    res.render('admin/formService')
}
//TODO: VALIDACION DEL FORMULARIO 
//TODO: INSERSION A LA BD




const deleteUSer = async (req, res) => {
    const id = req.params.id;
    const userData = await User.findOne(({where: {id}}))
    if(userData.type =="Administrador"){
        return res.redirect('/admin-home/usuarios')
    }

    const serviceData = await Service.findAll({where:{userID:id}})
    await Log.create({
        userId:id,
        action:"Usuario y servicios ligados eliminados"
    })
    serviceData.userID = null
    Service.destroy({where:{userID:id}})
    User.destroy({where:{id}})
return res.redirect('/admin-home/usuarios')
}


export { adminHome, userControl, serviceControll, formRegister, insertUser, editUser, deleteUSer, formService}