const express=require("express");
const {Usermodel}=require("../models/user.model")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const {auth}=require("../middleware/auth");


const user=express.Router();

// register

user.post("/register",async(req,res)=>{
    

    const payload=req.body;
    const email=payload.email;
    const password=payload.password;

    const useravailable= await Usermodel.findOne({email:email});

    if(useravailable){
        res.send({msg:"user is already available",status:"error"});
    }else{

        bcrypt.hash(password, 5 , async function(err, hash) {
            if(err){
                res.send({msg:"something went wrong",status:"error"})
            }else{
                payload.password=hash;
                const user= new Usermodel(payload);
                await user.save();

                res.send({msg:"signup successfull",status:"success"});
            }
        });
        
    }

   
})

// login

user.post("/login",async(req,res)=>{
    

    const payload=req.body;
    const email=payload.email;
    const password=payload.password;

    const useravailable= await Usermodel.findOne({email:email});
    const hashpassword=useravailable?.password;
    const user_id=useravailable?._id

    if(useravailable){

        bcrypt.compare(password, hashpassword, function(err, result) {
            if(result){
                var token = jwt.sign({ userid:  user_id }, 'hush');

                res.send({msg:"login successfull", token:token,status:"success"});
            }else{
                res.send({msg:"wrong craditionals",status:"error"})
            }
        });
        
    }else{        
        res.send({msg:"please register first",status:"error"});
    }

    
})


//get all users users

user.get("/users",async(req,res)=>{
    try {
        let users=await Usermodel.find();

        res.send({user:users,status:"success"});
    } catch (error) {
        res.send({msg:"error while getting users",status:"error"});
        
    }
});


// get all the friend of spacific user;

user.get("/users/:id/friends",async(req,res)=>{

    let id=req.params.id
    try {
        let user=await Usermodel.findOne({_id:id});
        let friendlist=user.friends;
        res.send({friendlist:friendlist,status:"success"});

    } catch (error) {
        res.send({msg:"error while getting friendlist",status:"error"});
        
    }
})



// send friend req. (Protected Route)

user.post("/users/:id/friends",auth,async(req,res)=>{
    let id=req.params.id;
    const payload=req.body;
    const userid=payload.userid;
    try {
        await Usermodel.findByIdAndUpdate({_id:id},{$push:{friendRequests:userid}});
        res.send({msg:"friend req successfully send",status:"success"});
        
    } catch (error) {
        res.send({msg:"error while sending friend req.",status:"error"});
        
    }
});


module.exports={user}