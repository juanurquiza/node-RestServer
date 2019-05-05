const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
let app = express();
const Producto = require('../models/producto');
const _ = require("underscore");

//===========================
// mostrar producto
// usuario
//categoria 
//===========================
app.get('/producto', verificaToken, (req, res) => {

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                producto: productoDB
            });
        })


});

//===========================
// crear producto
// grabar usuario y categoria
//===========================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({

        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        usuario: req.usuario._id,
        categoria: body.categoria

    });

    producto.save((err, productoDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })

    });

});


//===========================
// actualizar producto por id
//===========================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let producto = {

        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        categoria: body.categoria,
        disponible: body.disponible,

    };
    //{ new: true } me devuelve el usuario actualizado
    //{runValidators:true} me toma las validaciones realizadas en schema

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true },
        (err, productoDB) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            if (!productoDB) {

                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });


});


//===========================
// borrar un producto por id
// cambiar disponible a false
//===========================
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let cambiaDisponibilidad = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, cambiaDisponibilidad, { new: true },
        (err, productoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });


        })

});


//===========================
// borrar un producto por id
// cambiar disponible a false
//===========================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //es como un like
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        })

});


module.exports = app;