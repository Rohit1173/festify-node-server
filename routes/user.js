const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const verify = require("./verify_token");

router.get("/token", (req, res) => {
    try {
        User.findOne({userName: req.params.name}, (err, user) => {
            if (err) {
                console.error(err);
                res.status(400).json({status: 0, message: err});
            }
            console.log(user);
            if (user === null) {
                res.status(404).json({status: 0, message: "User not found"});
            } else {
                res.status(200).json({status: 1, data: user});
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({status: 0, message: error});
    }
});

router.get("/:name", (req, res) => {
    try {
        User.findOne({userName: req.params.name}, (err, user) => {
            if (err) {
                console.log(err);
                res.status(400).json({status: 0, message: err});
            }
            console.log(user);
            if (user === null) {
                res.status(404).json({status: 0, message: "User not found"});
            } else {
                res.status(200).json({status: 1, message: user});
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 0, message: error});
    }
});



router.post("/login", async (req, res) => {
    try {
        let usernameOrEmail = await req.body.usernameOrEmail;
        let password = await req.body.password;
        let user;
        if (usernameOrEmail.includes("@")) {
            user = await User.findOne({userEmail: usernameOrEmail, userPassword: password});
        } else {
            user = await User.findOne({userName: usernameOrEmail, userPassword: password});
        }
        if (user === null) {
            res.status(404).json({status: 0, message: "User not found"});
        } else
            jwt.sign({user}, process.env.TOKEN_SECRET, (err, token) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({status: 0, message: err});
                }
                res.header('auth-token', token).status(200).json({status: 1, message: "User is logged in"});
            });
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 0, message: error});
    }
});

router.post("/signup", async (req, res) => {
    try {
        let a1, a2;
        a1 = await User.findOne({userEmail: req.body.userEmail});
        a2 = await User.findOne({userName: req.body.userName});

        if (a1 !== null) {
            res.status(400).json({
                status: 0,
                message: "User alredy exists please use a different email",
            });
        } else if (a2 !== null) {
            res.status(400).json({
                status: 0,
                message: "User alredy exists please use a different username",
            });
        } else {
            await User.create(req.body, (err, user) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({status: 0, message: err});
                }
                console.log(user);
                res.status(200).json({status: 1, message: "user is successfully created "});
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({status: 0, message: error});
    }
});


router.post("/register", (req,res)=>{
try{
    console.log(req.body)
    const e =req.body.eventId
    User.findOne({userName:req.body.userName},(err,user)=>{
        
        if(err){
            console.log(err)
            res.status(400).json({status:1,message:err});
        }
        else if(!user){
            res.status(400).json({status:0,message:"User is Null"})
        }
        else{
      user.registeredEvents.push(e);          
      user.save((err)=>{
        if(err){
               console.log(err);
               res.status(400).json({status:1,message:err});
        }
        else{
        console.log("Successfully Saved");
        res.status(200).json({status: 1,message:"Added"})
        }
      });
    }
    });
    

}catch(error) {
    console.log(error);
    res.status(400).json({status: 0, message: error});
}
});

router.post("/delete",(req,res)=>{
    try{
        const e =req.body.eventId
    User.findOne({userName:req.body.userName},(err,user)=>{
        console.log(req.body)
        if(err){
            console.log(err)
            res.status(400).json({status:1,message:err});
        }
        else{
            let n=user.registeredEvents.length
            for(let i=0;i<n;i++){
                if(user.registeredEvents[i]==e){
                    user.registeredEvents.splice(i);
                }

            }      
      user.save((err)=>{
        if(err){
               console.log(err);
               res.status(400).json({status:1,message:err});
        }
        else{
            console.log("Successfully Updated");
            res.status(200).json({status: 1,message:"Deleted"})
            }
          });
        }
        });
    }catch(error){
    console.log(error);
    res.status(400).json({status: 0, message: error});
    }
})

module.exports = router;
