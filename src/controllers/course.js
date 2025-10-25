const express = require("express");
const {createUser, loginUser, changePassword, check, refresh, logout} = require("../services/auth");
const authTokenA = require("../guards/authTokenA");
const authTokenR = require("../guards/authTokenR");
const {addCourse, imageUpload,getCourses, getCoursesByLang, removeCourse} = require("../services/course");
const {roleGuard} = require("../guards/roleGuard");
const router = express.Router();

router.post("/create", authTokenA, roleGuard(["Admin"]),
    imageUpload.fields([
        { name: 'file', maxCount: 1 },
    ]),    addCourse)
router.post("/remove", authTokenA, roleGuard(["Admin"]), removeCourse)
router.get("/getAll", getCoursesByLang)
router.get("/get/:id", getCoursesByLang)

module.exports = router;