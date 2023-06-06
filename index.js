const express=require("express");
const app=express();
var cors = require('cors')

const {connection}=require("./config/db");

const {user}=require("./routes/user.routes");
const {postt}=require("./routes/post.routes");

app.use(express.json());
app.use(cors());
app.use("/",user);
app.use("/",postt);


app.get("/",(req,res)=>{


    res.send({msg:"base api"});
})



app.listen(8080,async(req,res)=>{

    try {
        await connection;
        console.log("connected to db")
        console.log("running on 8080")
        
    } catch (error) {
        console.log("error while connection");
        console.log(error)
    }
})