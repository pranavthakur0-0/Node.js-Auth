const User = require("../Models/usermodel")
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
const nodemailer = require('nodemailer');
dotenv.config({path : './config/config.env'});


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    }
  });

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
            }
            else{
                const user = await User.findById(decodedtoken.id);
                if(user)res.json({status:true, user: user.email});
                else res.json({status:false});
            }
        })
    }
    else{
        res.json({status:false});
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

module.exports.checkemail = async(req,res,next)=>{
   
    const {email} = req.body;  
    if(email)
    {
        const user = await User.findOne({email: email})
        if(user)
        {
           const payload = {
            email : user.email,
            id : user._id,
           }
           const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn : '15m'})
           const link = `http://localhost:3000/reset_password/${user.id}/${token}`
           req.email = email;
           req.link = link;
           next();
           return res.status(200).json({status : true, message : "Request Accepted"});
        }
    }
   return res.status(400).json({status:false, message:"Invalid Email"});
}

module.exports.sendback = (req,res,next)=>{

    const link = req.link;
    try{
        transporter.sendMail({
            from : process.env.EMAIL_ID,
            to: req.email,
            subject: 'Password Reset',
            html: `Please click this email to reset your passowrd: <a href="${link}">${link}</a>`,
          });
      }catch(err)
      {
            console.log(err);
      }
} 