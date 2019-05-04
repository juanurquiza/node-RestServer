const express = require('express');
const app = express();

//==========================
//  rutas de la app
//==========================
app.use(require("./usuario"));
app.use(require("./login"));
//app.use(require("../middlewares/autenticacion"));


module.exports = app;