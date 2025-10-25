const prisma = require("../models/prisma");
const getAllUsers = async (req, res) => {
    const {id} = req.params
    const users = await prisma.user.findMany({
        where: {},
        select: {
            id: true,
            login:true,
            email: true,
            role: true,
            userInfo: {
                select: {
                    phone: true,
                    firstName: true,
                    lastName: true,
                    birthdate: true,
                }
            }
        }
    })
    return res.send(users);
}


module.exports = {
    getAllUsers
}