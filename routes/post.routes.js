const express=require("express");

const {Postmodel}=require("../models/post.model")
const postt=express.Router();

const {auth}=require("../middleware/auth");


// get post

postt.get("/posts",async(req,res)=>{
    
    try {

        let pos=await Postmodel.find()
        
        res.send({posts:pos,status:"success"});
        
    } catch (error) {
        res.send({msg:"error while getting post",status:"error"});
        
    }
})

// post add
postt.post("/posts",auth,async(req,res)=>{
    const payload=req.body;
    try {

        let pos=new Postmodel(payload);
        await pos.save();
        res.send({msg:"post added successfully",status:"success"});
        
    } catch (error) {
        res.send({msg:"error while post",status:"error"});
        
    }
})

// update the post

postt.patch("/posts/:id",auth,async(req,res)=>{
    const payload=req.body;
    let id=req.params.id
    let img=payload.image;
    let text=payload.text;

    try {
        if(img==undefined){
            await Postmodel.findByIdAndUpdate({_id:id},{text:text})
        }else if(text==undefined){
            await Postmodel.findByIdAndUpdate({_id:id},{image:img})
        }
        res.send({msg:"post update successfully",status:"success"});
        
        
    } catch (error) {
        res.send({msg:"error while update",status:"error"});
        
    }
})


//delete the post

postt.delete("/posts/:id",auth,async(req,res)=>{
    let id=req.params.id;

    try {
        await Postmodel.findByIdAndDelete({_id:id});
        res.send({msg:"post delete successfully",status:"success"});

    } catch (error) {
        res.send({msg:"error while delete",status:"error"});
        
    }
})

// get the details of a specific post identified by its ID.

postt.get("/posts/:id",async(req,res)=>{
    let id=req.params.id;

    try {
       let pos= await Postmodel.findOne({_id:id});
        res.send({post:pos,status:"success"});

    } catch (error) {
        res.send({msg:"error while find",status:"error"});
        
    }
})

// post the likes 

postt.post("/posts/:id/like",auth,async(req,res)=>{
    let id=req.params.id;
    let payload=req.body;
    let userid=payload.userid

    try {

        await Postmodel.findByIdAndUpdate({_id:id},{$push:{likes:userid}});
        res.send({msg:"like the post successfully",status:"success"});

        
    } catch (error) {
        res.send({msg:"error while like",status:"error"});
        
    }
})


// post the comments

postt.post("/posts/:id/comment",auth,async(req,res)=>{
    let id=req.params.id;
    let payload=req.body;
    let userid=payload.userid;
    let ctext=payload.text;

    try {

        await Postmodel.findByIdAndUpdate({_id:id},{$push:{comments:{user:userid,text:ctext}}});
        res.send({msg:"comment on the post successfully",status:"success"});

        
    } catch (error) {
        res.send({msg:"error while comment",status:"error"});
        
    }
})

module.exports={postt}




 
