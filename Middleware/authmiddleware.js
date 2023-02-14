const User = require("../Models/usermodel")
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config({path : './config/config.env'});

module.exports.checkuser = (req,res,next)=>
{
    const token = req.cookies.jwt;
    if(token)
    {
        jwt.verify(token, process.env.SECRET_KEY, async(err, decodedtoken)=>
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

module.exports.activation =(req,res,next)=>
{
    let token = req.params.token
    if(token)
    {
        jwt.verify(token, process.env.SECRET_KEY, async(err, decodedtoken)=>{
            if(err)
            {
                res.json({status:false});
                next();
            }
            else{
                const user = await User.findById(decodedtoken.id);
                if(user){
                    try{
                        await User.findByIdAndUpdate(user._id,{confirmed : true},{new:true});
                        res.redirect("http://localhost:3000/login");
                        next();
                    }
                 catch(err)
                 {
                    console.log(err);
                 }
                }
            }
        })
    }
}