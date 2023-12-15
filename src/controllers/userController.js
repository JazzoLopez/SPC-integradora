// Importación de modelos y módulos necesarios
import User from "../models/User.js";
import Service from "../models/Service.js";
import Device from "../models/Device.js";
import { check, validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import axios from "axios";
import { generateJwt, generateToken, decodeJwt } from "../libs/token.js";
import { emailPasswordRecovery } from "../libs/emails.js";

// Página de inicio
const index = (request, response) => {
    response.render("auth/home", {
        page: "Welcome"
    })
}

// Formulario de inicio de sesión
const formLogin = async (req, res) => {
    res.render("auth/login", {
        page: "Iniciar sesión"
    })
}

// Formulario de recuperación de contraseña
const formPasswordRecovery = (request, response) => {
    response.render("auth/recovery.pug", {
        page: "Password Recovery",
    })
}

// Autenticación del usuario
const authenticateUser = async (request, response) => {
    // Validación de campos utilizando express-validator
    await check("email").notEmpty().withMessage("El correo es requerido").isEmail().withMessage("Ese no es un formato válido").run(request);
    await check("password").notEmpty().withMessage("La contraseña es requerida").isLength({ max: 20, min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres").run(request);

    let resultValidation = validationResult(request);
    if (resultValidation.isEmpty()) {
        const { email, password } = request.body;
        const userExists = await User.findOne({ where: { email } })

        if (!userExists) {
            // Renderiza la página de inicio de sesión con un mensaje de error si el usuario no existe
            response.render("auth/login.pug", {
                page: "Login",
                errors: [{ msg: `El usuario asociado al correo: ${email} no fue encontrado` }],
                user: { email }
            })
        } else {
            if (!userExists.verified) {
                // Renderiza la página de inicio de sesión con un mensaje de error si el usuario no está verificado
                response.render("auth/login.pug", {
                    page: "Login",
                    errors: [{ msg: `El usuario con el correo ${email} aún no está verificado` }],
                    user: { email }
                })
            } else {
                if (!userExists.verifyPassword(password)) {
                    // Renderiza la página de inicio de sesión con un mensaje de error si la contraseña es incorrecta
                    response.render("auth/login.pug", {
                        page: "Login",
                        errors: [{ msg: `El correo o la contraseña es incorrecto` }],
                        user: { email }
                    })
                } else {
                    if (userExists.type === 'Usuario') {
                        // Autenticación exitosa para usuarios
                        const token = generateJwt(userExists.id);
                        response.cookie('_token', token, {
                            httpOnly: true,
                        }).redirect('/home');
                    } else if (userExists.type === 'Administrador') {
                        // Autenticación exitosa para administradores
                        const token = generateJwt(userExists.id);
                        response.cookie('_token', token, {
                            httpOnly: true,
                        }).redirect('/admin-home');
                    }
                }
            }
        }
    } else {
        // Renderiza la página de inicio de sesión con mensajes de error de validación
        response.render("../views/auth/login.pug", {
            page: "Login",
            errors: resultValidation.array(),
            user: { email: request.body.email }
        })
    }

    return 0;
}

// Página de inicio del usuario
const userHome = async (req, res) => {
    // Verificación del token del usuario y redirección si no hay token
    const userToken = req.cookies._token;
    if (!userToken) {
        return res.redirect('login');
    }

    const decodedToken = decodeJwt(userToken);
    const { userID } = decodedToken;

    // Obtención de datos del usuario y servicios asociados
    const userData = await User.findOne({ where: { id: userID } });
    if (userData.type !== "Usuario") {
        return res.redirect('login');
    }

    const servicesData = await Service.findAll({ where: { userID }, include: Device });
    const response = await axios.get('https://theaudiodb.com/api/v1/json/2/discography.php?s=coldplay');
    const discografia = response.data;
    const numeroAleatorio = Math.floor(Math.random() * 9) + 1;
    const albumName = discografia.album[numeroAleatorio].strAlbum;

    // Renderiza la página de inicio del usuario con los datos obtenidos
    res.render('user/userhome', {
        user: userData.name,
        servicesData,
        albumName
    });
};

// Cierre de sesión
const logout = (req, res) => {
    res.clearCookie('_token');
    res.redirect('/login');
}

// Confirmación de la cuenta del usuario
const confirmAccount = async (req, res) => {
    const tokenReceived = req.params.token;
    const userOwner = await User.findOne({
        where: {
            token: tokenReceived
        }
    });

    if (!userOwner) {
        // Renderiza la página de confirmación con un mensaje de error si el token no existe o ha expirado
        res.render('auth/confirm-account', {
            page: 'Verificación de cuenta',
            error: true,
            msg: 'Lo sentimos, el token no existe o ya ha expirado',
            button: 'Volver al inicio de sesión'
        });
    } else {
        console.log("El token existe");
        userOwner.token = null;
        userOwner.verified = true;
        await userOwner.save();
        // Renderiza la página de confirmación con un mensaje de éxito
        res.render('auth/confirm-account', {
            page: 'Verificación de cuenta.',
            error: false,
            msg: 'Tu cuenta ha sido activada correctamente.',
            button: 'Ahora puedes iniciar sesión'
        });
    }
}

const formPasswordUpdate = async (request, response) => {
    const { token } = request.params;
    const user = await User.findOne({ where: { token } })
 
    if (!user) {
        response.render('auth/confirm-account', {
            page: 'Cambio de contraseña',
            error: true,
            msg: 'Hemos encontrado detalles y no podemos hacer la accion que deseas.',
            button: 'Regresar al login'

        })
    }

    response.render("auth/password-update", {
        page: "Cambio de contraseña",

    })
}

const emailChangePassword = async (req, res) => {
    await check("email").notEmpty().withMessage("El email es obligatorio").isEmail().withMessage("Eso no es un formato valido").run(req);
    let resultValidate = validationResult(req);
    const { name, email } = req.body;

    if (resultValidate.isEmpty()) {
        const userExists = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!userExists) { //Si no existe
            
            res.render("templates/message.pug", {
                page: "Usuario no encontrado",
                part1: `El usuario con la cuneta asociada a: `,
                part2: ` No existe en nuestra base de datos.`,
                message: `${email}`,
                type: "error"

            });
        }
        else {
           
            const token = generateToken();
            userExists.token = token;
            userExists.save();

            //enviar el correo con el nuevo token

            emailPasswordRecovery({ name: userExists.name, email: userExists.email, token: userExists.token })

            res.render('templates/message', {
                page: 'Correo enviado',
                message: `${email}`,
                type: "password"

                // button:'Now you can login',

            });
        }
    }
    else {
        res.render('auth/recovery', {
            page: 'Verificacion de cuenta.',
            error: false,
            msg: 'Tu cuenta se ha confirmado correctamente.',
            button: 'Now you can login',
            errors: resultValidate.array(), user: {
                name: req.body.name,
                email: req.body.email
            },
        });
    }
    return 0;
}

const updatePassword = async (req, res) => {

    await check("password").notEmpty().withMessage("La contraseña es obligatoria").isLength({ min: 8 }).withMessage("La contraseña almenos tiene 8 caracteres").run(req)
    await check("confirmPassword").notEmpty().withMessage("La contraseña es obligatoria").isLength({ min: 8 }).withMessage("La contraseña almenos tiene 8 caracteres").equals(req.body.password).withMessage("Ambas contraseñas deben ser las mismas").run(req)
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
            page: "Cambio de contraseña",
            button: "Regresa al login",
            msg: "La contraseña se ha cambiado satisfactoriamente."
        })
    }

    else {
        res.render("auth/password-update.pug", ({
            page: "Cambio de contraseña",
            errors: resultValidate.array()

        }))
    }



}

export { index, updatePassword, formLogin, formPasswordRecovery, formPasswordUpdate, userHome, authenticateUser, logout, confirmAccount, emailChangePassword };