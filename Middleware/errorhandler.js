const handleError =(err)=>{
    let errors = {email:"", password:""};

    if(err.message === "Incorrect Email"  || "Incorrect password")
    {
       errors.email = "Invalid Email or Password";
    }
    if(err.message==="notActive")
    {
        errors.email = "Please activate the Email";
    }
    if(err.message.includes("ValidatorError")){
        Object.values(err.errors).forEach(({properties})=>
        {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

module.exports = handleError;