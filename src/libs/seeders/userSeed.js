import bcrypt from 'bcrypt'
const users = [{
    name: "SPC",
    lastname: "Corporacion",
    tel: "7641106843",
    email: "SPC@corporacion.org",
    type:'Administrador',
    password: bcrypt.hashSync('Relojdearena1', 10),
    verified: 1,
    token: null 
},{
    name: "Jazziel",
    lastname: "Rodriguez Lopez",
    tel: "6677339120",
    email: "jazzielLopez@gmail.com",
    password: bcrypt.hashSync('Gatotocapi4no', 10),
    verified: 1,
    token: null
},
{
    name: "Luis Ivan",
    lastname: "Marquez Azuara",
    tel: "81 2909 38 76",
    email: "LuisMarquez@gmail.com",
    password: bcrypt.hashSync('', 10),
    verified: 1,
    token: null
},
{
    name: "Juan Alberto",
    lastname: "Vazquez Hernandez",
    tel: "764 119 25 20",
    email: "JuanVazquez@gmail.com",
    password: bcrypt.hashSync('Juan123VE', 10),
    verified: 1,
    token: null
}
]


export default users;