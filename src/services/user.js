const prisma = require("../models/prisma");
const unBuyCourse = async (req, res) => {
    const {id} = req.body;
    const {sub} = req.user;
    await prisma.buyedCouse.deleteMany({
        where: {
            courseId: id,
        }
    })
    return res.send(200);
}
const buyCourse = async (req, res) => {
    const {id} = req.body;
    const {sub} = req.user;

    const payment = await prisma.paymentMethod.findFirst({
        where: {
            userId: sub,
        }
    })
    if(!payment) {
        return res.status(402).send("Укажите метод оплаты в профиле")
    }
    const info = await prisma.userInfo.findFirst({
        where: {
            userId: sub,
        }
    })
    if(!info) {
        return res.status(402).send("Укажите инфо в профиле")
    }
    const old = await prisma.buyedCouse.findFirst({
        where: {
            userId: sub,
            courseId: id,
        }
    })
    if(old) {
        return res.status(402).send("Вы уже заказали этот курс")
    }
    await prisma.buyedCouse.create({
        data: {
            userId: sub,
            courseId: id,
        }
    })
    return res.send(200);
}

const getBuyedCourses = async (req, res) => {
    const {id} = req.body;
    const {sub} = req.user;

    const courses = await prisma.buyedCouse.findMany({
        where: {
            userId: sub,
        },
        include: {
            course: true
        }
    })

    return res.send(courses);
}

const getAllBuyedCourses = async (req, res) => {
    const {id} = req.body;
    const {sub} = req.user;

    const courses = await prisma.buyedCouse.findMany({
        where: {},
        include: {
            course: true,
            user: true,
        }
    })

    return res.send(courses);
}

const getInfo = async (req, res) => {
    const {sub} = req.user;

    const info = await prisma.userInfo.findFirst({
        where: {
            userId: Number(sub),
        },

    })
    return res.send(info);
}

const updateInfo = async (req, res) => {
    const {sub} = req.user;
    const {firstName,
        lastName,
        birthDate,
        phone} = req.body;
    const info = await prisma.userInfo.update({
        where: {
            userId: Number(sub),
        },
        data: {
            firstName,
            lastName,
            birthdate: birthDate,
            phone
        },
    })
    return res.send(200);
}

const getPayment = async (req, res) => {
    const {sub} = req.user;

    const info = await prisma.paymentMethod.findFirst({
        where: {
            userId: Number(sub),
        },

    })
    return res.send(info);
}

const updatePayment = async (req, res) => {
    const {sub} = req.user;
    const {cardNumber,
        cardHolder,
        date,
        cvv} = req.body;
    const info = await prisma.user.update({
        where: {
            id: Number(sub),
        },
        data: {
            payment: {
                upsert: {
                    where: {
                        userId: sub,
                    },
                    create: {
                        cardNumber: cardNumber,
                        cardHolder: cardHolder,
                        cardDate: date,
                        cvv: cvv,
                    },
                    update: {
                        cardNumber: cardNumber,
                        cardHolder: cardHolder,
                        cardDate: date,
                        cvv: cvv,
                    },

                },
            }
        },
    })
    return res.send(200);
}

module.exports = {
    buyCourse,
    getInfo, updateInfo,
    getPayment,
    updatePayment,
    getAllBuyedCourses,
    getBuyedCourses, unBuyCourse,
}