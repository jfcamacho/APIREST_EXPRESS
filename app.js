const debug = require('debug')('app:inicio')
const express = require('express');
const joi = require('joi');
const logger = require('./logger')
const config = require('config')
const app = express();



const morgan = require('morgan')

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

//Configuración de entornos

console.log('Aplicación', config.get('nombre'));
console.log('Data Base Server', config.get('configDB'));

// Uso de un middleware de terceros - MOrgan

if(app.get('env') === 'development'){
    app.use(morgan('tiny'))
    //console.log('Morgan habilitado');
    debug('Morgan esta habiliotado')
}

debug('Conectando con la base de datos')

// app.use(function log(req, res, next ){
//     console.log('Autenticando...');
//     next()
// })

// app.use(logger)


const usuarios = [
    {id: 1, nombre:"JEFF"},
    {id: 2, nombre:"RAFA"},
    {id: 3, nombre:"RAQUEL"}
]


// app.get(); //Petición
// app.post(); //Envío de datos hacia el servidor
// app.put(); //Actualización
// app.delete(); //Eliminación

app.get('/', (req, res) => {
    res.send('HOLA MUNDO DESDE EXPRESS');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios)
})

app.get('/api/usuarios/:id', (req, res) => {
    // res.send("El año es.: " + req.params.year + " y el mes es.: " + req.params.month)
    let usuario = existeUsuario(req.params.id)
    if(!usuario) res.status(404).send("El usuario no existe");
    res.send(usuario);
})

app.post('/api/usuarios', (req, res) => {

    const {error, value} = validaUsuario(req.body.nombre)

    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        }
        usuarios.push(usuario);
        res.send(usuario)
    } else {
        const mensaje = error.details[0].message
        res.status(400).send(mensaje);
    }
})

app.put('/api/usuarios/:id', (req, res) => {
    // let usuario = usuarios.find(user => user.id === parseInt(req.params.id));

    let usuario = existeUsuario(req.params.id)

    if(!usuario) {
        res.status(400).send("El usuario no fue encontrado");
        return
    }

    // const schema = joi.object({
    //     nombre: joi.string().min(3).required()
    // })

    const {error, value} = validaUsuario(req.body.nombre)

    if(error){
        const mensaje = error.details[0].message
        res.status(400).send(mensaje);
        return
    }

    usuario.nombre = value.nombre
    res.send(usuario)
})

app.delete('/api/usuarios/:id', (req, res) =>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(400).send('El usuario no fue encontrado')
        return
    }

    const index = usuarios.indexOf(usuario)
    usuarios.splice(index, 1)

    res.status(200).send(usuario)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
})

function existeUsuario(id) {
    return (usuarios.find(user => user.id === parseInt(id)))
}

function validaUsuario(nom) {
    const schema = joi.object({
        nombre: joi.string().min(3).required()
    })

    return schema.validate({nombre: nom})
}
