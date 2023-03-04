const { register, login } = require("../Controllers/authcontroller");
const { checkuser, activation } = require("../Middleware/authmiddleware");
const {checkemail, sendback} = require("../Middleware/authmiddleware")
const User = require("../Models/usermodel")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const router = require("express").Router();

router.post("/", checkuser);
router.post("/register", register);
router.post("/login", login);
router.get('/confirmation/:token', activation)
router.route('/forgot_password').post(checkemail, sendback);

router.post('/reset_password', async (req,res,next)=>
{
    const {password} = req.body;
    if(req.headers.id)
    {
      jwt.verify(req.headers.auth, process.env.SECRET_KEY, async(err, decodedtoken)=>
       {
        if(err)
        {
            return res.status(400).json({status:false, message : "Sesson Expired"});
        }
        else{
            const user = await User.findById(decodedtoken.id);
            if(user)
            {
                const salt = await bcrypt.genSalt();
                const hashpassword = await bcrypt.hash(password, salt);
                const reset = await User.updateOne({_id : req.headers.id}, {$set : {password: hashpassword }});
                return res.status(200).json({status:true, message : "Password changed"})

            }
            else{
               return res.status(400).json({status:false, message : "User not found"})
            }
        }
       })
    }

});

module.exports = router;