import User from "../models/User.js";
import Service from "../models/Service.js";
import Device from "../models/Device.js";
import { check, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import { generateJwt, generateToken, decodeJwt } from "../libs/token.js";
import { emailPasswordRecovery } from "../libs/emails.js";

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

const formPasswordRecovery = (request, response) => {

    response.render("auth/recovery.pug", {
        page: "Password Recovery",

    })
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


const formPasswordUpdate = async (request, response) => {
    const { token } = request.params;
    const user = await User.findOne({ where: { token } })
    console.log(user);
    if (!user) {
        response.render('auth/confirm-account', {
            page: 'password recovery',
            error: true,
            msg: 'We have found some issues and could not verify your account.',
            button: 'Access denied'

        })
    }

    response.render("auth/password-update", {
        page: "Cambio de contraseña",

    })
}

const emailChangePassword = async (req, res) => {
    console.log(`El usuario ha solicitado cambiar su contraseña por lo que se le enviara un correo electronico a ${req.body.email} con la liga para actualizar su contraseña.`)
    await check("email").notEmpty().withMessage("YOUR EMAIL IS REQUIRED").isEmail().withMessage("THIS IS NOT EMAIL FORMAT").run(req);
    let resultValidate = validationResult(req);
    const { name, email } = req.body;

    if (resultValidate.isEmpty()) {
        const userExists = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!userExists) { //Si no existe
            console.log(`El usuario: ${email} que esta intentando recuperar su contraseña no existe`);
            res.render("templates/message.pug", {
                page: "User not found",
                part1: `The user associated with: `,
                part2: ` does not exist in database.`,
                message: `${email}`,
                type: "error"

            });
        }
        else {
            console.log("envio de correo");
            const token = generateToken();
            userExists.token = token;
            userExists.save();

            //enviar el correo con el nuevo token

            emailPasswordRecovery({ name: userExists.name, email: userExists.email, token: userExists.token })

            res.render('templates/message', {
                page: 'Email Send',
                message: `${email}`,
                type: "password"

                // button:'Now you can login',

            });
        }
    }
    else {
        res.render('auth/recovery', {
            page: 'Status verification.',
            error: false,
            msg: 'Your account has been confirmed successfuly.',
            button: 'Now you can login',
            errors: resultValidate.array(), user: {
                name: req.body.name,
                email: req.body.email
            },
        });
    }
    return 0;
}

const updatePassword = async(req ,res) =>{
    console.log(`Guardando password`);

    await check("password").notEmpty().withMessage("YOUR PASSWORD IS REQUIRED").isLength({ min: 8 }).withMessage("YOUR PASSWORD MUST HAVE 8 CHARACTERS AT LEAST").run(req)
    await check("confirmPassword").notEmpty().withMessage("YOUR PASSWORD IS REQUIRED").isLength({ min: 8 }).withMessage("YOUR PASSWORD MUST HAVE 8 CHARACTERS AT LEAST").equals(req.body.password).withMessage("BOTH PASSWORDS FIELDS MUST BE THE SAME").run(req)
    let resultValidate = validationResult(req);
    if (resultValidate.isEmpty()) {
        const { token } = req.params
        const { password } = req.body
        const user = await User.findOne({ where: { token } })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.token = null;
        await user.save();
        res.render('auth/confirm-account.pug', {
            page: "Password recovery",
            button: "Back to login",
            msg: "The password has been change succesfully"
        })
    }

    else {
        res.render("auth/password-update.pug", ({
            page: "New account",
            errors: resultValidate.array()

        }))
    }

}

export {index, updatePassword, formLogin, formPasswordRecovery,formPasswordUpdate, userHome, authenticateUser, logout, confirmAccount, emailChangePassword};