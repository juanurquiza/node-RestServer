require("./config/config");
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json())


//importar todas las rutas 
app.use(require("./routs/index"));

//habilitar la carpeta public (middleware de expres)
app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.static(path.resolve(__dirname, '../views')));

//coneccion a la base de datos 
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        else
            console.log('base de datos online');
    });

// puerto de la aplicacion    
app.listen(process.env.PORT, () => {

    console.log("escuchando el puerto: ", process.env.PORT);
});