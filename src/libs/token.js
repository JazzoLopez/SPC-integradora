// Importación de módulos y configuración de variables de entorno
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 } from "uuid";
import { UUID } from "sequelize";

// Configuración de variables de entorno utilizando dotenv
dotenv.config({
    path: 'src/.env'
});

console.log(UUID); // Imprime información sobre UUID (esto parece ser una línea de depuración)

// Generación de un token propio
const generateToken = () => Math.random().toString(32).substring(3) + Date.now().toString(32) + Math.random().toString(32).substring(3);
// La función anterior utiliza números aleatorios y la fecha actual para generar un token único

// Generación de un token JWT
const generateJwt = (userID) =>
    jwt.sign({
        domain: process.env.JWT_DOMAIN,
        signature: process.env.JWT_SIGNATURE,
        author: process.env.JWT_AUTHOR,
        year: process.env.JWT_YEAR,
        userID,
    }, process.env.JWT_SECRET_HASH_STRING, {
        expiresIn: '1d' // Token expira en 1 día
    });

// Decodificación de un token JWT
const decodeJwt = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_HASH_STRING); // Verifica el token con la clave secreta
    } catch (error) {
        console.error(error);
        return null;
    }
};


export {
    generateToken, generateJwt, decodeJwt
};
