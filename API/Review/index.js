// Libraries
import express from "express";
import passport from "passport";

//Database model
import { ReviewModel } from "../../database/allModels";

const Router = express.Router();

/**
 * Route            /:resid  
 * Des              GET all reviews for a particular restaurant
 * Params           resid
 * Access           Public
 * Method           GET
 */

Router.get("/:resid",async (req,res) => {
    try{
        const {resid} = req.params;
        const reviews = await ReviewModel.find({restaurants: resid})
        return res.status(200).json({reviews});
    }catch(error){
        return res.status(500).json({ error: error.message});
    }
});

/**
 * Route            /new  
 * Des              POST new food/restaurant review and rating
 * Params           NONE    
 * Access           Private
 * Method           POST
 */

 Router.post("/new", passport.authenticate("jwt"), async (req,res) => {
    try{
        const {_id} = req.session.passport.user._doc;
        const {reviewData} = req.body;

        await ReviewModel.create({ ...reviewData, user:_id });
        
        return res.json({reviews: "successfully created review"});
    }catch(error){
        return res.status(500).json({ error: error.message});
    }
});

/**
 * Route            /delete  
 * Des              DELETE a review 
 * Params           _id
 * Access           Public
 * Method           DELETE
 */

 Router.get("/delete/:_id", async (req,res) => { 
    try{
        const {_id} = req.params;
        await ReviewModel.findByIdAndDelete(_id)
        return res.json({review: "Successfully deleted the review"});
    }catch(error){
        return res.status(500).json({ error: error.message});
    }
});

export default Router;