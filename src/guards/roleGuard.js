const prisma = require("../models/prisma")
const roleGuard = function(roles){
    return async (req, res, next) => {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: req.user.sub,
                }
            })

            let isAccess = false;
            for(let role in roles) {
                if(user.role === roles[role]) {
                    isAccess = true;
                }
            }
            if(isAccess) {
                next()
            } else {
                return res.sendStatus(402);
            }

        }
        catch (error) {
            next(error)
        }
    }
}

module.exports = {
    roleGuard
}