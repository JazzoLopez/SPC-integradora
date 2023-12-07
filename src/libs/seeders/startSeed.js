/*Para insertar multiples datos en la base jaja */
import {exit} from 'node:process'
import users from './userSeed.js'
import User from '../../models/User.js'
import devices from './deviceSeed.js'
import Device from '../../models/Device.js'
import Service from '../../models/Service.js'
import services from './serviceSeed.js'
import db from '../../configs/db.js'


const importData = async () => {
    try{
        await db.authenticate()

        await db.sync()

        await Promise.all([User.bulkCreate(users),Device.bulkCreate(devices), Service.bulkCreate(services) ])
        console.log("Se importaron los datos correctamente");
        exit;
    }catch(err){
        console.log("Hubo un problema")
        console.log(err);
        exit(1);
    }
}

if(process.argv[2] === "-i"){
    importData();
}


const deleteData = async () => {
    try{
        const queryResetUser = "ALTER TABLE tbb_users AUTO_INCREMENT = 1"
        const queryResetDevice = "ALTER TABLE tbb_devices AUTO_INCREMENT = 1"
        const queryResetService = "ALTER TABLE tbb_services AUTO_INCREMENT = 1"
        await Promise.all([
            Service.destroy({
                where: {},
                truncate: false
            }),
            User.destroy({
            where: {},
            truncate: false
        }),Device.destroy({
            where: {},
            truncate: false
        })])

        await Promise.all([
            db.query(queryResetUser, {
                raw: true
            }),
            db.query(queryResetDevice, {
                raw:true
            }),db.query(queryResetService, {
                raw:true
            })   
        ])
    }catch(err){
        console.log("Hubo un problema al borrar carnalito");
        console.log(err);
    }
} 


if(process.argv[2] === "-d"){
    deleteData();
}