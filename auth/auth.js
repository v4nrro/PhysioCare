const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secreto = process.env.SECRETO;

let generarToken = (id, login, rol) => {
    return jwt.sign({id: id, login: login, rol: rol}, secreto, 
                    {expiresIn: "2 hours"});
};

let validarToken = token => {
    try {
        let resultado = jwt.verify(token, secreto);
        return resultado;
    } catch (e) {}
}

let protegerRuta = roles => {
    return (req, res, next) => {
    let token = req.headers['authorization'];

    const idPatient = req.params.id

    if (token) {
        token = token.substring(7);
        let resultado = validarToken(token);

        if(resultado){
            if (roles.length === 0 || roles.includes(resultado.rol)) {
                
                if(resultado.rol === 'patient' && resultado.id === idPatient) {
                    return next();
                }

                if (resultado.rol === 'patient' && resultado.id !== idPatient) {
                    return res.status(403)
                    .send({ error: "Acceso no autorizado" });
                }

                next();
            }
            else
                res.status(403)
                .send({error: "Acceso no autorizado"});
        }
        else
            res.status(403)
            .send({error: "Acceso no autorizado"});           
    } else 
        res.status(403)
        .send({error: "Acceso no autorizado"});        
}};
    
module.exports = {
    generarToken: generarToken,
    validarToken: validarToken,
    protegerRuta: protegerRuta,
};