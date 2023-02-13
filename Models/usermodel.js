const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userschema = mongoose.Schema({
    email :{
        type: String,
        unique: true,
        required: [true, "Email is required"],
   
    },
    password : {
        type: String,
        required: [true, "Password is required"],
    }
})


userschema.pre("save", async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})


userschema.statics.login = async function(email, password)
{   
    const user = await this.findOne({email})
    if(user)
    {
        const auth = await bcrypt.compare(password, user.password);
        if(auth)
        {
            return user;
        }
        else{
            throw Error("Incorrect password");
        }
       
    }
    else{
        throw Error("Incorrect Email");
    }
  
}

module.exports = mongoose.model("Users", userschema);