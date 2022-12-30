const express = require("express");
const router = express.Router();
const dataModel = require("../models/data");

router.post("/", async (req, res) => {
        try{
        let a =req.body.userName
        
        dataModel.findOne({userName:a},(err,data)=>{
            if(data){
                console.log(data);
                res.status(400).json({
                    status: 0,
                    message: "User alredy exists",
                });
            }
            else{
                dataModel.create(req.body,(err, dataModel)=>{
                    if (err) {
                        console.log(err);
                        res.status(400).json({status: 0, message: err});
                    }
                    console.log(dataModel);
                    res.status(200).json({status: 1, message: "Success"});
                })
            }
        });
        
    }catch(err){
        console.log(err);
        res.status(400).json({status: 0, message: err});
    }


});

module.exports = router;
