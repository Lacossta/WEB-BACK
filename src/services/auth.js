const prisma = require("../models/prisma")
const bcrypt = require("bcrypt");
const {sign} = require("jsonwebtoken");
const {validationResult} = require("express-validator");

const cryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const createUser = async (req, res) => {
    const {role, login, email} = req.body;
    const oldUser = await prisma.user.findFirst({
        where: {
            OR: [
                {login}, {email}
            ]
        }
    })

    if(oldUser) return res.status(400).send("Пользователь с таким логином или почтой уже существует")

    const {password,firstName,lastName, phone, birthDate} = req.body;

    const cryptedPassword = await cryptPassword(password);

    const user = await prisma.user.create({
        data: {
            login, email, password: cryptedPassword, role: "User", userInfo: {
                create: {
                    firstName,
                    lastName,
                    phone,
                    birthdate: birthDate
                }
            }
        }
    })

    const session = await prisma.userSessions.create({
        data: {
            userId: user.id,
            refresh_token: "",
        }
    })
    const tokens = getTokens(user.id, login, user.role, session.id);
    await prisma.userSessions.update({
        where: {
            id: session.id,
        },
        data: {
            refresh_token: tokens.refresh_token,
        }
    })
    return res.send(tokens);

}

const loginUser = async (req, res) => {
    const {login, password} = req.body;

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {login}, {email: login}
            ]
        },
    })

    if(!user || !await bcrypt.compareSync(password, user.password)) {
        return res.status(400).send("Введен не верный логин или пароль")
    }

    const session = await prisma.userSessions.create({
        data: {
            userId: user.id,
            refresh_token: "",
        }
    })
    const tokens = getTokens(user.id, login, user.role, session.id);
    await prisma.userSessions.update({
        where: {
            id: session.id,
        },
        data: {
            refresh_token: tokens.refresh_token,
        }
    })
    return res.send(tokens);
}

const changePassword = async (req, res) => {
    const {oldPassword, password} = req.body;
    const {sub} = req.user;

    const user = await prisma.user.findFirst({
        where: {
            id: sub,
        }
    })
    if(!user || !await bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(400).send("Введен не верный cтарый пароль")
    }

    const cryptedPassword = await cryptPassword(password);

    await prisma.user.update({
        where: {
            id: sub,
        },
        data: {
            password: cryptedPassword,
        }
    })
    return res.status(200).send("Пароль успешно изменен")
}

const refresh = async (req, res) => {
    const { sub, sessionId } = req.user;
    const userDB = await prisma.user.findFirst({
        where: {
            id: sub,
        }
    })
    const {login, role} = userDB;
    const access_token = sign(
        { sub, login, role, sessionId },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: "5m",
        }
    );
    return res.send({
        access_token
    })
}

const getTokens = (sub, login, role, sessionId) => {
    const access_token = sign(
        { sub, login, role, sessionId },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: "5m",
        }
    );

    const refresh_token = sign(
        { sub, login, role, sessionId },
        process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: "7d",
        },
    );
    return {
        access_token,
        refresh_token
    }
}

const check = (req, res) => {
    return res.sendStatus(200);
}

const logout = async (req, res) => {
    const {sessionId} = req.user;
    await prisma.userSessions.deleteMany({
        where: {
            id: +sessionId,
        }
    })
    return res.sendStatus(200)
}

module.exports = {
    createUser,
    loginUser,
    refresh,
    check,
    changePassword,
    logout
}