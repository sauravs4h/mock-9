const mongoose=require("mongoose");

const connection=mongoose.connect("mongodb+srv://sauravsh:sauravsharma@cluster0.lb7eutx.mongodb.net/mock-9?retryWrites=true&w=majority");

module.exports={connection}