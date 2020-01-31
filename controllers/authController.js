const passport = require('passport');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect : '/administracion',
    failureRedirect: '/iniciar-sesion', 
    failureFlash : true,
    badRequestMessage : 'Ambos campos son obligatorios'
});

// Revisa si el usuario está autenticado o no
exports.usuarioAutenticado = (req, res, next) => {
    // si el usuario está autenticado, adelante
    if(req.isAuthenticated() ) {
        return next();
    }

    // sino está autenticado
    return res.redirect('/iniciar-sesion');
}

// Cerrar sesión
exports.cerrarSesion = (req, res, next) => {
    req.logout();
    req.flash('exito', 'Cerraste sesión correctamente');
    res.redirect('/iniciar-sesion');
    next();
}