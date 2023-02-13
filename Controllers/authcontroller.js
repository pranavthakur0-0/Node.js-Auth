const usermodel = require("../Models/usermodel");
const jwt = require("jsonwebtoken");

const maxage = 3 * 24 * 60 * 60;

const createtoken = (id)=>
{
    return jwt.sign({id}, "pranavthakur secret key",{
        expiresIn : maxage,
    });
}


const handleError =(err)=>{
    let errors = {email:"", password:""};

    if(err.message === "Incorrect Email"  || "Incorrect password")
    {
       errors.email = "Invalid Email or Password";
    }
    if(err.message.includes("ValidatorError")){
        Object.values(err.errors).forEach(({properties})=>
        {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}
module.exports.register = async (req,res,next)=>{
    try{
        const {email, password} = req.body;
        const user = await usermodel.create({email, password});
        const token = createtoken(user._id);
        res.cookie("jwt", token, {
            withCredentials : true,
            httpOnly : false,
            maxage : maxage * 1000
        })
        res.status(201).json({user : user._id, created : true})
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
