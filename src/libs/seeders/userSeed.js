import bcrypt from 'bcrypt'
const users = [{
    name: "Jazziel",
    lastname: "Rodriguez Lopez",
    tel: "7641106843",
    email: "jazzo@lopez.com",
    type:'Administrador',
    password: bcrypt.hashSync('11111111', 10),
    verified: 1,
    token: null 
},{
    name: "Pedro",
    lastname: "Santos Guerrero",
    tel: "6677339120",
    email: "pedro@gmail.com",
    password: bcrypt.hashSync('11111111', 10),
    verified: 1,
    token: null
},
{
    name: "Jesus",
    lastname: "Arroyo Rangel",
    tel: "9876543210",
    email: "jesusA@gmail.com",
    password: bcrypt.hashSync('11111111', 10),
    verified: 1,
    token: null
},
{
    name: "Brayan",
    lastname: "Bernabe Garcia",
    tel: "8763829126",
    email: "brayan@gmail.com",
    password: bcrypt.hashSync('11111111', 10),
    verified: 1,
    token: null
},
{
    name: "Octavio",
    lastname: "Lopez Martinez",
    tel: "9933994483",
    email: "OctavioLM@gmail.com",
    password: bcrypt.hashSync('11111111', 10),
    verified: 1,
    token: null
},
]


export default users;