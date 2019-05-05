const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require("underscore");
const { verificaToken, verificaAdminRole } = require("../middlewares/autenticacion");

app.get('/usuario', verificaToken, function(req, res) {

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

app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {

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
app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;
    //en el array le defino que varaibles quiero actualizar en este caso 
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado', 'google']);
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

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

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

});


module.exports = app;