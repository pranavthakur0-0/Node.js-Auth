const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv')
const  mongoose = require("mongoose");
const authRoutes = require("./Routes/authroutes")
const app = express();
const cookieparser  = require("cookie-parser");

dotenv.config({path : './config/config.env'});
const connectdb = async ()=>
{
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_URI,);
    console.log(`mongoos connected ${conn.connection.host}`);
}
connectdb();

app.use(cors({
    origin:["http://localhost:3000"],
    method : ["GET","POST"],
    credentials:true,
  })
)

app.use(cookieparser());
app.use(express.json());

app.use("/", authRoutes);


app.listen(4000, ()=>
{
    console.log("server started on port 4000");
})
