const debug = require('debug')('app:inicio')
const express = require('express');
const logger = require('./logger')
const config = require('config')
const app = express();
const usuarios = require('./routes/usuarios')


const morgan = require('morgan')

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use('/api/usuarios', usuarios)
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




// app.get(); //Petición
// app.post(); //Envío de datos hacia el servidor
// app.put(); //Actualización
// app.delete(); //Eliminación

app.get('/', (req, res) => {
    res.send('HOLA MUNDO DESDE EXPRESS');
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
})
