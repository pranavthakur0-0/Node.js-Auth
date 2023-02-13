const { register, login } = require("../Controllers/authcontroller");
const { checkuser } = require("../Middleware/authmiddleware");

const router = require("express").Router();

router.post("/", checkuser);
router.post("/register", register);
router.post("/login", login);

module.exports = router;