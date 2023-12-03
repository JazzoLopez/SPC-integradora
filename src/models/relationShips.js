import User from "./User.js";
import Device from "./Device.js";
import Service from "./Service.js";

Service.belongsTo(User,{
    foreignKey: 'userID'
});

Device.hasOne(Service, {
    foreignKey: 'deviceID'
})

export {User, Service}