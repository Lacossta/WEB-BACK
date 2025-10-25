const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma")

const authTokenA = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(authHeader) {

        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {

            if(err) return res.sendStatus(403);
            req.user = user;
            next()
        })
    } else {
        return res.sendStatus(403);
    }
}

module.exports = authTokenA;