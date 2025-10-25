const express = require('express');
const path = require('path');
require("dotenv").config()
const cookieParser = require('cookie-parser');
const authController = require('./controllers/auth');
const userController = require('./controllers/user');
const courseController = require('./controllers/course');
const adminController = require('./controllers/admin');
const cors = require("cors");

const app = express();
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser());
app.use(cors());
app.use("/api/public", express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authController);
app.use('/api/user', userController);
app.use('/api/admin', adminController);
app.use('/api/course', courseController);

const port = process.env.PORT | 5000


app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`)
})

