var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutentication = require('../middlewares/autenticacion');


var app = express();

var Usuario = require('../models/usuario');

// ===============================
// Obtener Todos los usuarios
// ===============================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(

            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            });

});



// ===============================
// Actualizar usuario
// ===============================
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error obteniendo usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'usuario con id:' + id + ' No Existe',
                errors: { message: 'No Existe un usuario con ese Id' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error actualizando usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });


});

// ===============================
// Crear nuevo usuario
// ===============================
app.post('/', mdAutentication.verificaToken, (req, res, next) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error salvando usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });


});

// ===============================
// Delete usuario por el id
// ===============================

app.delete('/:id', mdAutentication.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error Borrando usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'usuario con id:' + id + ' No Existe',
                errors: { message: 'No Existe un usuario con ese Id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    })

})

module.exports = app;