const express = require("express");
const {createUser, loginUser, changePassword, check, refresh, logout} = require("../services/auth");
const authTokenA = require("../guards/authTokenA");
const authTokenR = require("../guards/authTokenR");
const {getAllUsers} = require("../services/admin");
const {roleGuard} = require("../guards/roleGuard");
const router = express.Router();

router.get("/users", authTokenA, roleGuard(["Admin"]), getAllUsers)

module.exports = router;