const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
let app = express();
const Categoria = require('../models/categorias');
const _ = require("underscore");

//===========================
// mostrar todas las categorias 
//===========================

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        //primer param tabla,segundo campos
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                categoria: categoriaDB
            });

        });
})

//===========================
// mostrar categoria por id
//===========================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {

            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

})

//===========================
// crear categoria por id
//===========================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });
})

//===========================
// modificar categoria por id
//===========================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    //en el array le defino que varaibles quiero actualizar en este caso 
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };
    //{ new: true } me devuelve el usuario actualizado
    //{runValidators:true} me toma las validaciones realizadas en schema

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true },
        (err, categoriaDB) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            if (!categoriaDB) {

                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });

        });


})

//===========================
// borrar categoria por id
// solo admin
//===========================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDELETE) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDELETE) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: "el id no existe"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDELETE,
            message: "categoria borrada"
        });

    })
})



module.exports = app;