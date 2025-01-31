let authentication = (req, res, next) => {
    if (req.session && req.session.usuario)
        return next();
    else
        res.render('login');
};

let rol = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.session.rol))
            next();
        else
            res.render('forbidden');
    }
}

module.exports = { authentication, rol };
