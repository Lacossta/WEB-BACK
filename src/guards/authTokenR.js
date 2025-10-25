const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma")
const authTokenR = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.REFRESH_TOKEN_KEY, async (err, user) => {
            if (err) {
                await prisma.userSessions.deleteMany({
                    where: {
                        refresh_token: token,
                    }
                })
                return res.sendStatus(403);
            }
            const refreshToken = await prisma.userSessions.findFirst({
                where: {
                    refresh_token: token,
                }
            })
            if(!refreshToken) return res.sendStatus(403);
            req.user = user;
            next()
        })
    } else {
        return res.sendStatus(403);
    }
}

module.exports = authTokenR;