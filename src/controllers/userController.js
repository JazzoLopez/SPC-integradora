import User from "../models/User.js";
import Service from "../models/Service.js";
import Device from "../models/Device.js";
import { check, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import { generateJwt, generateToken, decodeJwt } from "../libs/token.js";

const index = (request, response ) => {
    response.render("auth/home", {
        page:"Welcome"
    })
}

const formLogin = (req, res) => {
    res.render("auth/login",{
        page:"Iniciar sesion"
    })
}

const formPassRecovery = (req, res) => {
    res.render('auth/password-update')
}



const authenticateUser = async (request, response) => {
    //Verificar los campos de correo y contraseña
    await check("email").notEmpty().withMessage("El correo es requerido").isEmail().withMessage("Ese no es un formato valido").run(request)
    await check("password").notEmpty().withMessage("La contraseña es requerida").isLength({ max: 20, min: 8 }).withMessage("La contraseña contiene almenos 8 caracteres").run(request)

    // En caso de errores mostrarlos en pantalla
    let resultValidation = validationResult(request);
    if (resultValidation.isEmpty()) {
        const { email, password } = request.body;
        

        const userExists = await User.findOne({ where: { email } })

        if (!userExists) {
            console.log("El ususario no existe")
            response.render("auth/login.pug", {
                page: "Login",
                errors: [{ msg: `The user associated to: ${email} was not found` }],
                user: {
                    email
                }
            })
        } else {
            console.log("El usuario existe")
            if (!userExists.verified) {
                console.log("Existe, pero no esta verificado");

                response.render("auth/login.pug", {
                    page: "Login",
                    errors: [{ msg: `The user associated to: ${email} was found but not verified` }],
                    user: {
                        email
                    }
                })
            } else {
                if (!userExists.verifyPassword(password)) {
                    response.render("auth/login.pug", {
                        page: "Login",
                        errors: [{ msg: `User and password does not match` }],
                        user: {
                            email
                        }
                    })
                } else {
                    
                    if(userExists.type === 'Usuario'){
                        console.log(`El usuario: ${email} Existe y esta autenticado`);
                        //Generar el token de accesso
                        console.log(userExists.type)
                        const token = generateJwt(userExists.id);
                        response.cookie('_token', token, {
                            httpOnly: true,//Solo via navegador, a nivel API no
                            //secure:true  //Esto solo se habilitara en caso de conta con un certificado https
                             }).redirect('/home');
    
                    }
                    else if(userExists.type === 'Administrador'){
                        console.log(`El usuario: ${email} Existe y esta autenticado`);
                        //Generar el token de accesso
                        console.log(userExists.type)
                        const token = generateJwt(userExists.id);
                        response.cookie('_token', token, {
                            httpOnly: true,//Solo via navegador, a nivel API no
                            //secure:true  //Esto solo se habilitara en caso de conta con un certificado https
                             }).redirect('/admin-home');
                    }
                }
            }
        }

    } else {
        response.render("../views/auth/login.pug", {
            page: "Login",
            errors: resultValidation.array(),
            user: {
                email: request.body.email
            }
        })
    }

    return 0;
}

const userHome = async (req, res) => {
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;
    
    //console.log(userID);

    const userData = await User.findOne({ where: { id: userID } });
    //console.log(userData);
    if (userData.type !== "Usuario") {
        return res.redirect('login');
    }
//Include es como un join conectando con su llave foranea
    const servicesData = await Service.findAll({ where: { userID }, include:Device /*Incluye los datos del dispositivo relacionados*/ });
//imprimo en json para ver la jerarquia del objeto
//res.json(serviceData)
    res.render('user/userhome', {
        user: userData.name,
        servicesData,
      
    });
};




const logout = (req, res) => {
    res.clearCookie('_token');
    res.redirect('/login');
}

const confirmAccount = async (req, res) => {
const tokenRecived = req.params.token
const userOwner = await User.findOne({
    where: {
        token: tokenRecived
    }
})
if (!userOwner) {

    console.log("El token no existe")
    res.render('auth/confirm-account', {
        page: 'Verificacion de cuenta',
        error: true,
        msg: 'Lo sentimos, el token no existe o ya ha expirado',
        button: 'Volver al inidio de sesion'

    })
}
else {
    console.log("El token existe");
    userOwner.token = null;
    userOwner.verified = true;
    await userOwner.save();
    // ESTA OPERACION REALIZA EL UPDATE EN LA BASE DE DATOS.
    res.render('auth/confirm-account', {
        page: 'Verificación de cuenta.',
        error: false,
        msg: 'Tu cuenta ha sido activada correctamente.',
        button: 'Ahora tu puedes iniciar sesion',

    });

};


}


export {index, formLogin, formPassRecovery, userHome, authenticateUser, logout, confirmAccount};