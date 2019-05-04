const jwt = require('jsonwebtoken');

//================
//  verifica token
//================

//middlewares para realizar validaciones, en este caso,el token 

let verificaToken = (req, res, next) => {

    //obtener las varaibles del header
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
    //es valido

}



let verificaAdminRole = (req, res, next) => {

    //obtener las varaibles del header
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {

        next();
    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: "el usuario no es administrador"
            }
        });

    }


    //es valido

}

module.exports = {
    verificaToken,
    verificaAdminRole
}