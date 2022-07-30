const express = require('express')
const joi = require('joi');
const ruta = express.Router();

const usuarios = [
    {id: 1, nombre:"JEFF"},
    {id: 2, nombre:"RAFA"},
    {id: 3, nombre:"RAQUEL"}
]

ruta.get('/', (req, res) => {
    res.send(usuarios)
})

ruta.get('/:id', (req, res) => {
    // res.send("El año es.: " + req.params.year + " y el mes es.: " + req.params.month)
    let usuario = existeUsuario(req.params.id)
    if(!usuario) res.status(404).send("El usuario no existe");
    res.send(usuario);
})

ruta.post('/', (req, res) => {

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

ruta.put('/:id', (req, res) => {
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

ruta.delete('/:id', (req, res) =>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(400).send('El usuario no fue encontrado')
        return
    }

    const index = usuarios.indexOf(usuario)
    usuarios.splice(index, 1)

    res.status(200).send(usuario)
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

module.exports = ruta