// Library
import express from "express";
import passport from "passport";

// Models
import { UserModel } from "../../database/allModels";

//Validation
import { ValidateSignin, ValidateSignup } from "../../validation/auth";

// Create a router
const Router = express.Router();

/**
 * Route           /signup
 * Des              Register new user
 * Params           none
 * Access           Public
 * Method           POST
 */

 Router.post("/signup", async (req,res) =>{
    try{
        await ValidateSignup(req.body.credentials);
       await UserModel.findByEmailAndPhone(req.body.credentials);
       const newUser = await UserModel.create(req.body.credentials);
       const token = newUser.generateJWT();
       return res.status(200).json({token, status: "success"});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
});

/**
 * Route           /signin
 * Des              Sign in with email and password
 * Params           none
 * Access           Public
 * Method           POST
 */

Router.post("/signin", async (req,res)=>{
    try{
        await ValidateSignin(req.body.credentials);
        const user = await UserModel.findByEmailAndPassword(req.body.credentials);
        const token = user.generateJWT();
        return res.status(200).json({token, status: "success"})
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});

/**
 * Route           /google
 * Des              Google signin 
 * Params           none
 * Access           Public
 * Method           GET
 */

Router.get("/google", passport.authenticate("google",{
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ],
})
);

/**
 * Route           /google/callback
 * Des              Google signin callback
 * Params           none
 * Access           Public
 * Method           GET
 */

Router.get("/google/callback",passport.authenticate("google", {failureRedirect: "/"}),
    (req,res) => {
        return res.status(200).redirect(`http://localhost:3000/google/${req.session.passport.user.token}`)
    }
)

export default Router;

// Router.post("/signup", async (req,res) =>{
//     try{
//         const {email, password, fullName, phoneNumber, address} = req.body.credentials;
//         const checkUserByEmail = await UserModel.findOne({email});
//         const checkUserByPhone = await UserModel.findOne({phoneNumber});

//         if(checkUserByEmail || checkUserByPhone){
//             return res.json({message:"User already exists!"});
//         }

//         //hash password
//         const bcryptSalt = await bcrypt.genSalt(8) 
//         const hashedPassword = await bcrypt.hash(password, bcryptSalt)

//         //save data to database
//         await UserModel.create({...req.body.credentials, password:hashedPassword})

//         //genreate JWT auth token (package-jsonwebtoken)
//         const token = jwt.sign({user : {fullName, email, address}}, "ZomatoApp");
//         return res.status(200).json({token, status:"success"});

//     }catch(error){
//         return res.status(500).json({error: error.message});
//     }
// });