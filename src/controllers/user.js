const express = require("express");
const {createUser, loginUser, changePassword, check, refresh, logout} = require("../services/auth");
const authTokenA = require("../guards/authTokenA");
const authTokenR = require("../guards/authTokenR");
const {getInfo, updateInfo, getPayment, updatePayment, buyCourse, getBuyedCourses, unBuyCourse, getAllBuyedCourses} = require("../services/user");
const router = express.Router();

router.get("/info", authTokenA, getInfo)
router.post("/info", authTokenA, updateInfo)
router.get("/payment", authTokenA, getPayment)
router.post("/payment", authTokenA, updatePayment)
router.post("/buycourse", authTokenA, buyCourse)
router.get("/courses", authTokenA, getBuyedCourses)
router.get("/allCourses", authTokenA, getAllBuyedCourses)
router.post("/unBuyCourse", authTokenA, unBuyCourse)


module.exports = router;