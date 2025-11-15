const jwt = require('jsonwebtoken')

const jwtAuthMiddleware = (req, res, next) => {

    // first check request headers has authorization or not
    const authorization = req.headers.authorization
    if(!authorization) res.status(401).json({error: 'Token not found'})

    // Extract the jwt token from the reuest headers
    const token = authorization.split(' ')[1]
    if(!token) return res.status(401).json({error: 'Unauthorization'})

    try{
        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()

    }catch(err){
        console.log(err)
        res.status(401).json({ error: 'Invalid token'})
    }
}

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET)
}

module.exports = {jwtAuthMiddleware, generateToken}