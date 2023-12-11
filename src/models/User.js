import { DataTypes } from "sequelize";
import db from '../configs/db.js'
import bcrypt from 'bcrypt';
//tbb_users
const User = db.define('tbb_users', {
    name:{
        type: DataTypes.STRING,
        allowNull:false //* Lo hace obligatorio
    },
    lastname:{
        type: DataTypes.STRING,
        allowNull:false //* Lo hace obligatorio
    },
    tel:{
        type: DataTypes.STRING,
        allowNull:false //Cammpo que se llena con el numero de telefono
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false
    },
    token: {
        type: DataTypes.STRING,
        unique: true,
        defaultValue: ""
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
type:{
    type: DataTypes.ENUM('Usuario','Administrador'),
    defaultValue: 'Usuario'
}

}, {
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

User.prototype.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

export default User;
