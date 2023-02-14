const usermodel = require("../Models/usermodel");
const jwt = require("jsonwebtoken");
const handleError = require("../Middleware/errorhandler");
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
  
const maxage = 3 * 24 * 60 * 60;

const createtoken = (id)=>
{  
    return jwt.sign({id}, process.env.SECRET_KEY,{
        expiresIn : maxage,
    });
}

const emailtoken = (id, email)=>
{  
    jwt.sign({id}, process.env.SECRET_KEY,{
        expiresIn : maxage,
  
    },
        (err, emailToken) => {
          const url = `http://localhost:4000/confirmation/${emailToken}`;

          try{
            transporter.sendMail({
                from : process.env.EMAIL_ID,
                to: email,
                subject: 'Confirm Email',
                html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
              });
          }catch(err)
          {
                console.log(err);
          }
         
        },
      );
    
}


module.exports.register = async (req,res,next)=>{
    try{
        const {email, password} = req.body;
        const user = await usermodel.create({email, password});
        emailtoken(user._id,email);
        res.status(201).json({user : user._id, created : true});

    }catch(err){
        handleError(err);
        res.json({err, created:false});
    }
}
module.exports.login = async (req,res,next)=>{
    try{
        const {email, password} = req.body;
        const user = await usermodel.login(email, password);
        const token = createtoken(user._id);
        res.cookie("jwt", token, {
            withCredentials : true,
            httpOnly : false,
            maxage : maxage * 1000
        })
        res.status(200).json({user : user._id, created : true})
    }catch(err){
        let error =  handleError(err);
         res.json({error, created : false})
    }
}
