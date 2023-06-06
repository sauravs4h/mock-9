var jwt = require('jsonwebtoken');


const auth=async(req,res,next)=>{

    const token=req.headers.authorization?.split(" ")[1];
    const payload=req.body;


    if(token){

        jwt.verify(token, 'hush', function(err, decoded) {
            if(err){
                res.send({msg:err.message,status:"error"})
            }

            const userid=decoded.userid;
            payload.userid=userid;
            next();
          });

    }else{
        res.send({msg:"please login , you are not authorize for this",status:"error"})

    }
}

module.exports={auth}