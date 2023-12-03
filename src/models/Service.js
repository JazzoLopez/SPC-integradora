import { DataTypes } from "sequelize";
import db from '../configs/db.js'
import User from "./User.js";
import Device from "./Device.js";

//tbb_services
const Service = db.define('tbb_services',{
    description:{
        type:DataTypes.STRING
    },
    status:{
        type:DataTypes.ENUM('No iniciado','En proceso','Finalizado'),
        default:'No iniciado'
    },
    typeService:{
        type:DataTypes.ENUM('Correctivo','Preventivo')
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    deviceID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Device,
            key: 'id'
        }
    }
});

// Define associations
Service.belongsTo(User, { foreignKey: 'userID' });
Service.belongsTo(Device, { foreignKey: 'deviceID' });  

export default Service;