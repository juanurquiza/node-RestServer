const express = require('express');

const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require("underscore");
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        //si no encontro el usuario
        if (!usuarioDB) {

            return res.status(400).json({
                ok: false,
                usuarioDB,
                err: {
                    messaje: "(usuario) o contraseña incorrecto"
                }
            });

        }

        //evaluo si la contraseña es igual
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    messaje: "usuario o (contraseña) incorrecto"
                }
            });

        }

        //configuramos el token de nuestra aplicacion
        let token = jwt.sign({
                usuario: usuarioDB
            },
            process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })

})

/*
app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    // find:{google: true} primer objeto es filtro 
    // el string nombre email son los campos que deseo mostrar 
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // find:{google:true} primer objeto es filtro 
            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    //cant: usuarios.length,
                    usuarios,
                    conteo
                });

            })

        });

});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

});

//========================
//  put actualiza registro
//========================
// documentacion https://mongoosejs.com/docs/api.html#Schema
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    //en el array le defino que varaibles quiero actualizar en este caso 
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    //{ new: true } me devuelve el usuario actualizado
    //{runValidators:true} me toma las validaciones realizadas en schema
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })


    /*
        Usuario.findByIdAndRemove(id, (err, usuarioDELETE) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioDELETE) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "usuario no encontrado"
                    }
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDELETE
            })

        });*/

//});


module.exports = app;