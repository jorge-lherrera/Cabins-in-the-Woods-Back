const { verify } = require('jsonwebtoken')

async function auth(req, res, next) {
    try {
        const { authorization } = req.headers

        const payload = verify(authorization, process.env.SECRET_JWT)

        req.userId = payload.sub
    
        next()

    } catch (error) {
        return res.status(401).json({
            message: 'A autenticação falhou, tente novamente.',
            cause: error.message
        })
    }
}

module.exports = { auth }