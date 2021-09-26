const express = require("express");
const router = express.Router();

const { register, verify } = require("../controller/auth");

router.post("/register", register);
router.post("/verify", verify);

module.exports = router;
