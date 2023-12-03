import { DataTypes } from "sequelize";
import db from '../configs/db.js'

//tbb_devices
const Device = db.define('tbb_devices',{
    typeDevice:{
        type:DataTypes.ENUM('Impresora','Laptop','Fotocopiadora','Multifuncional','Desktop'),
        allowNull:false
    },
    brand:{
        type: DataTypes.STRING,
        allowNull:false
    },
    model:{
        type:DataTypes.STRING,
        allowNull:false
    },
    serialNumber:{
        type:DataTypes.STRING,
        allowNull:false
    },

});

export default Device;
