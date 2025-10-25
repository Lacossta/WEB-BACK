const prisma = require("../models/prisma");
const bcrypt = require("bcrypt");
const {writeFileSync} = require("fs");
const path = require("path");
const multer = require("multer");


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public'))

    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`)
    }
})
const imageUpload = multer({storage: storage})

const addCourse = async (req, res) => {

    const formatVars = ["online", "offline"];
    const langVars = ["En", "De", "Fra", "Esp", "Ita"]
    const {name,
        description,
        price,
        amountOfStudies,formatId,
        duration,
        durationOfCourse, langId} = req.body;
    let fileName = "none"
    if(req?.files?.file?.length > 0 && req?.files?.file[0]?.filename) {
        fileName = req?.files?.file[0]?.filename;
    }

    await prisma.langCourses.create({
        data: {
            title: name,
            description,
            price,
            amountOfLessons: amountOfStudies,
            format: formatVars[formatId],
            timeForLesson: duration,
            timeForAllCourse: durationOfCourse,
            imgURL: fileName,
            lang: langVars[langId]
        }
    })

    return res.send(200);
}

const editCourse = async (req, res) => {
    const {title,
        description,
        price,
        amountOfLessons,
        timeForLesson,format,
        id,
        timeForAllCourse, img, lang} = req.body;
    let fileName;


    await prisma.langCourses.update({
        where: {
            id,
        },
        data: {
            title,
            description,format,
            price,
            amountOfLessons,
            timeForLesson,
            timeForAllCourse,
            imgURL: fileName, lang
        }
    })

    return res.send(200);
}

const removeCourse = async (req, res) => {
    const {id} = req.body;

    await prisma.langCourses.delete({
        where: {
            id: id,
        },

    })
    return res.send(200);
}


const getCoursesByLang = async (req, res) => {
    const {id} = req.params
    const courses = await prisma.langCourses.findMany({
        where: {
            lang: id,
        }
    })
    return res.send(courses);
}


module.exports = {
    removeCourse,
    editCourse,
    addCourse,
    imageUpload,
    getCoursesByLang
}