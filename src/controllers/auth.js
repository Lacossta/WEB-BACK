const express = require("express");
const {createUser, loginUser, refresh, check, changePassword, logout} = require("../services/auth");
const authTokenR = require("../guards/authTokenR");
const authTokenA = require("../guards/authTokenA");
const router = express.Router();

router.post("/reg", createUser)
router.post("/login", loginUser)
router.post("/changePassword", authTokenA, changePassword)
router.get("/check",authTokenA, check)
router.get("/refresh", authTokenR, refresh)
router.post("/logout", authTokenA, logout)

module.exports = router;