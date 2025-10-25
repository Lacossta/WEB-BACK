const {checkSchema} = require("express-validator");
const createUserValidator = checkSchema({
    login: {
        errorMessage: 'Логин указан некорректно',
        notEmpty: true,
        isLength: {
            options: { min: 4, max: 16 },
            errorMessage: 'Длина логина должна быть от 4 до 16 символов',
        },
    },
    email: {
        errorMessage: 'Почта указана некорректно',
        notEmpty: true,
        isEmail: true,
    },
    password: {
        errorMessage: 'Пароль указан некорректно',
        notEmpty: true,
        isLength: {
            options: { min: 6 },
            errorMessage: 'Длина пароль должна быть от 6 символов',
        },
    },
});

const loginValidator = checkSchema({
    login: {
        errorMessage: 'Логин указан некорректно',
        notEmpty: true,
    },
    password: {
        errorMessage: 'Пароль указан некорректно',
        notEmpty: true,
    },
});

const changePasswordValidator = checkSchema({
    oldPassword: {
        errorMessage: 'Старый пароль указан некорректно',
        notEmpty: true,
    },
    password: {
        errorMessage: 'Новый пароль указан некорректно',
        notEmpty: true,
        isLength: {
            options: { min: 6 },
            errorMessage: 'Длина пароль должна быть от 6 символов',
        },
    },
});

module.exports = {
    createUserValidator,
    loginValidator,
    changePasswordValidator
}