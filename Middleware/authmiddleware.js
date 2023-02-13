const User = require("../Models/usermodel")
const jwt = require("jsonwebtoken");

module.exports.checkuser = (req,res,next)=>
{
    const token = req.cookies.jwt;
    if(token)
    {
        jwt.verify(token, "pranavthakur secret key", async(err, decodedtoken)=>
        {
            if(err)
            {       
                res.json({status:false});
                next();
            }
            else{
                const user = await User.findById(decodedtoken.id);
                if(user)res.json({status:true, user: user.email});
                else res.json({status:false});
                next();
            }
        })
    }
    else{
        res.json({status:false});
        next();
    }
}