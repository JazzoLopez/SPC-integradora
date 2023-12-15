// Importación de los modelos 'User', 'Device' y 'Service'
import User from "./User.js";
import Device from "./Device.js";
import Service from "./Service.js";

// Definición de la relación: Un servicio (Service) pertenece a un usuario (User)
Service.belongsTo(User, {
    foreignKey: 'userID'
});

// Definición de la relación: Un dispositivo (Device) tiene uno o muchos servicios (Service)
Device.hasOne(Service, {
    foreignKey: 'deviceID'
});

export { User, Service };
