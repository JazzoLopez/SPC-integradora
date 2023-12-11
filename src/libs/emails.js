import dotenv from 'dotenv';
dotenv.config({
  path: 'src/.env'
})
import nodemailer from 'nodemailer';
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const emailRegister = async (userData) => {
  const { name, email, token } = userData
  console.log(`Intentando enviar un correo electronico de activación al usuario ${email}`)
  //* ENVIANDO  EL  CORREO PARA ACTIVACION DE LA CUENTA
  await transport.sendMail({
    from: 'ServiciosSPC@gmail.com', //Emitente
    to: email, //Destinatario de la persona
    subject: "SPC-2.0: Verifica tu cuenta", //Asunto
    text: "Bienvenido a SPC, Para empezar a ver tus servicios por favor verifica tu cuenta.", //Cuerpo
    html:
    `<html>
    <head>
      <style>
        body {
          font-family:system-ui;
          margin: 0;
          padding: 0;
          background-color: #f0eae4;
          letter-spacing: 1px;
          font-size: 2em;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }

        header {
          text-align: center;
          background-color: #1f2937   ;
          color: #ffffff;
          padding: 10px 0;
        }


        span {
          font-size: 18px;
          font-weight: normal;
          color: #000000;
        }

        p {
          font-size: 14px;
          color: #000000;
          text-align: justify;
          margin: 10px 0;
        }

        a {
          display: block;
          width: 200px;
          margin: 0 auto;
          background-color: white;
          color: #000000;
          border: 2px solid #1f2937; 
          border-radius: 5px;
          padding: 10px 20px;
          text-align: center;
          font-size: 16px;
          text-decoration: none;
          margin-top: 20px;
        }

        a:hover{
          background-color:#1f2937;
          color: white;
          box-shadow: 2px 2px 2px black;
        }

        footer {
          text-align: center;
          background-color: #1f2937;
          color: #ffffff;
          padding: 10px 0;
        }

        .signature {
          font-size: 14px;
          text-align: left;
          margin: 20px 0;
        }

        .resaltado {
    color: red;
    font-weight: bold;
    
    
}

      </style>
    </head>
    <body>
      <div class="container">
      
      <header style="display: flex; justify-content: space-between; align-items: center; border-radius: 5px;">
<div style="display: flex; align-items: center; text-align: center;">
<h1 style="font-size: 28px; font-weight: bold; color: rgb(199, 101, 96);">SPC<span style="color: white;">2.0</span></h1>
</div>
<div>
</div>
</header>


        <fieldset>
          <legend align="center">Nuevo usuario</legend>
    
        <p style="font-size: 18px; margin-top: 20px;">Bienvenido al sistema de SPC, ${name}!</p>
        <p>Gracias por seleccionar nuestra empresa para el servicio de sus dispositivos, el siguiente boton te activara tu cuenta para que puedas :</p>
        <a href = "http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/login/confirmar-cuenta/${token}">Presiona aquí para activar tu cuenta.</a>
        <p aling="centrer">Con cariño,</p>
        <div class="signature" align="denter">
          <p>SPC 2.0 Soporte Tecnico Empresarial </p>
        </div>
        <p> <spam class="resaltado"><em>*Si tu no haz solicitado una cuenta, por favor omite este correo</em></spam></p>
       

      </div>
    </fieldset>
      <footer>
        &copy; SPC 2.0
      </footer>
    </body>
  </html>`

  })
}

const emailPasswordRecovery = async (userData) => {
  const { name, email, token } = userData
  console.log(`Intentando enviar un correo electronico dpara la recuperación de cuenta del usuario: ${email}`)
  //* ENVIANDO  EL  CORREO 
  await transport.sendMail({
    from: 'ServiciosSPC@gmail.com', //Emitente
    to: email, //Destinatario
    subject: "SPC-2.0: Solicitud de cambio de contraseña", //Asunto
    text: "Bienvenido a SPC, Este es el cambio de contraseña", //Cuerpo
   html:`
    <html>
    <head>
      <style>
        body {
          font-family:system-ui;
          margin: 0;
          padding: 0;
          background-color: #f0eae4;
          letter-spacing: 1px;
          font-size: 2em;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }

        header {
          text-align: center;
          background-color: #1f2937   ;
          color: #ffffff;
          padding: 10px 0;
        }


        span {
          font-size: 18px;
          font-weight: normal;
          color: #000000;
        }

        p {
          font-size: 14px;
          color: #000000;
          text-align: justify;
          margin: 10px 0;
        }

        a {
          display: block;
          width: 200px;
          margin: 0 auto;
          background-color: white;
          color: #000000;
          border: 2px solid #1f2937; 
          border-radius: 5px;
          padding: 10px 20px;
          text-align: center;
          font-size: 16px;
          text-decoration: none;
          margin-top: 20px;
        }

        a:hover{
          background-color:#1f2937;
          color: white;
          box-shadow: 2px 2px 2px black;
        }

        footer {
          text-align: center;
          background-color: #1f2937;
          color: #ffffff;
          padding: 10px 0;
        }

        .signature {
          font-size: 14px;
          text-align: left;
          margin: 20px 0;
        }

        .resaltado {
    color: red;
    font-weight: bold;
    
    
}

      </style>
    </head>
    <body>
      <div class="container">
      
      <header style="display: flex; justify-content: space-between; align-items: center; border-radius: 5px;">
<div style="display: flex; align-items: center; text-align: center;">
<h1 style="font-size: 28px; font-weight: bold; color: rgb(199, 101, 96);">SPC<span style="color: white;">2.0</span></h1>
</div>
<div>
</div>
</header>


        <fieldset>
          <legend align="center">Cambio de contraseña</legend>
    
        <p style="font-size: 18px; margin-top: 20px;">Saludos ${name}!</p>
        <p>Recibimos una solicitud para cambiar la contraseña, por favor presiona al boton para direccionarte al camnbio de contraseña</p>
        <a href = "http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/login/actualizar-contrase%C3%B1a/${token}">Presiona aquí para cambiar la contraseña</a>
        <p aling="centrer">Con cariño,</p>
        <div class="signature" align="denter">
          <p>SPC 2.0 Soporte Tecnico Empresarial </p>
        </div>
        <p> <spam class="resaltado"><em>*Si no haz solicitado un cambio de contraseña contactanos</em></spam></p>
       

      </div>
    </fieldset>
      <footer>
        &copy; SPC 2.0
      </footer>
    </body>
  </html>`
  })
}



const emailChangeStatus = async (userData) => {
  const { email, status } = userData
  console.log(`==========================================================================1: ${email}`)
  //* ENVIANDO  EL  CORREO 
  await transport.sendMail({
    from: 'ServiciosSPC@gmail.com', //Emitente
    to: email, //Destinatario
    subject: "SPC-2.0: Actualizacion del estatus del servicio", //Asunto
    text: "Bienvenido a SPC, Aviso", //Cuerpo
   html:`
    <html>
    <head>
      <style>
        body {
          font-family:system-ui;
          margin: 0;
          padding: 0;
          background-color: #f0eae4;
          letter-spacing: 1px;
          font-size: 2em;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }

        header {
          text-align: center;
          background-color: #1f2937   ;
          color: #ffffff;
          padding: 10px 0;
        }


        span {
          font-size: 18px;
          font-weight: normal;
          color: #000000;
        }

        p {
          font-size: 14px;
          color: #000000;
          text-align: justify;
          margin: 10px 0;
        }

        a {
          display: block;
          width: 200px;
          margin: 0 auto;
          background-color: white;
          color: #000000;
          border: 2px solid #1f2937; 
          border-radius: 5px;
          padding: 10px 20px;
          text-align: center;
          font-size: 16px;
          text-decoration: none;
          margin-top: 20px;
        }

        a:hover{
          background-color:#1f2937;
          color: white;
          box-shadow: 2px 2px 2px black;
        }

        footer {
          text-align: center;
          background-color: #1f2937;
          color: #ffffff;
          padding: 10px 0;
        }

        .signature {
          font-size: 14px;
          text-align: left;
          margin: 20px 0;
        }

        .resaltado {
    color: red;
    font-weight: bold;
    
    
}

      </style>
    </head>
    <body>
      <div class="container">
      
      <header style="display: flex; justify-content: space-between; align-items: center; border-radius: 5px;">
<div style="display: flex; align-items: center; text-align: center;">
<h1 style="font-size: 28px; font-weight: bold; color: rgb(199, 101, 96);">SPC<span style="color: white;">2.0</span></h1>
</div>
<div>
</div>
</header>


        <fieldset>
          <legend align="center">Actualizacion de estatus</legend>
    
        <p style="font-size: 18px; margin-top: 20px;">Saludos</p>
        <p>Saludos, te informamos que tu servicio a cambiado de estatus a: ${status}, te recomendamos estar al pendiente</p>
        <a href = "http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/home">Presiona aquí para ver tus servicios </a>
        <p aling="centrer">Con cariño,</p>
        <div class="signature" align="denter">
          <p>SPC 2.0 Soporte Tecnico Empresarial.</p>
        </div>
        <p> <spam class="resaltado"><em>*Si no haz solicitado algun servicio haz caso omiso.</em></spam></p>
       

      </div>
    </fieldset>
      <footer>
        &copy; SPC 2.0
      </footer>
    </body>
  </html>`
  })
}



const emailChangeFinal = async (userData) => {
  const { email, status } = userData
  console.log(`==============================================================================================2: ${email}`)
  //* ENVIANDO  EL  CORREO 
  await transport.sendMail({
    from: 'ServiciosSPC@gmail.com', //Emitente
    to: email, //Destinatario
    subject: "SPC-2.0: Servicio finalizado", //Asunto
    text: "Bienvenido a SPC, Aviso", //Cuerpo
   html:`
    <html>
    <head>
      <style>
        body {
          font-family:system-ui;
          margin: 0;
          padding: 0;
          background-color: #f0eae4;
          letter-spacing: 1px;
          font-size: 2em;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }

        header {
          text-align: center;
          background-color: #1f2937   ;
          color: #ffffff;
          padding: 10px 0;
        }


        span {
          font-size: 18px;
          font-weight: normal;
          color: #000000;
        }

        p {
          font-size: 14px;
          color: #000000;
          text-align: justify;
          margin: 10px 0;
        }

        a {
          display: block;
          width: 200px;
          margin: 0 auto;
          background-color: white;
          color: #000000;
          border: 2px solid #1f2937; 
          border-radius: 5px;
          padding: 10px 20px;
          text-align: center;
          font-size: 16px;
          text-decoration: none;
          margin-top: 20px;
        }

        a:hover{
          background-color:#1f2937;
          color: white;
          box-shadow: 2px 2px 2px black;
        }

        footer {
          text-align: center;
          background-color: #1f2937;
          color: #ffffff;
          padding: 10px 0;
        }

        .signature {
          font-size: 14px;
          text-align: left;
          margin: 20px 0;
        }

        .resaltado {
    color: red;
    font-weight: bold;
    
    
}

      </style>
    </head>
    <body>
      <div class="container">
      
      <header style="display: flex; justify-content: space-between; align-items: center; border-radius: 5px;">
<div style="display: flex; align-items: center; text-align: center;">
<h1 style="font-size: 28px; font-weight: bold; color: rgb(199, 101, 96);">SPC<span style="color: white;">2.0</span></h1>
</div>
<div>
</div>
</header>


        <fieldset>
          <legend align="center">Servicio finalizado</legend>
    
        <p style="font-size: 18px; margin-top: 20px;">Saludos</p>
        <p>Saludos, te informamos que tu servicio a cambiado de estatus a: ${status}, te recomendamos estar al pendiente e ir a recogerlo</p>
        <a href = "http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/home">Presiona aquí para ver tus servicios </a>
        <p aling="centrer">Con cariño,</p>
        <div class="signature" align="denter">
          <p>SPC 2.0 Soporte Tecnico Empresarial.</p>
        </div>
        <p> <spam class="resaltado"><em>*Si no haz solicitado algun servicio haz caso omiso.</em></spam></p>
       

      </div>
    </fieldset>
      <footer>
        &copy; SPC 2.0
      </footer>
    </body>
  </html>`
  })
}



export { emailRegister, emailPasswordRecovery, emailChangeFinal, emailChangeStatus }

