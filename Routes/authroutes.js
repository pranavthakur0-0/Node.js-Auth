const { register, login } = require("../Controllers/authcontroller");
const { checkuser, activation } = require("../Middleware/authmiddleware");

const router = require("express").Router();

router.post("/", checkuser);
router.post("/register", register);
router.post("/login", login);
router.get('/confirmation/:token', activation)

module.exports = router;