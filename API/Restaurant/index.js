// Libraries
import express from "express";

//Database model
import { RestaurantModel } from "../../database/allModels";

//Validation
import { ValidateRestaurantCity, ValidateRestaurantSearchString } from "../../validation/restaurant";
import { validateId } from "../../validation/common";

const Router = express.Router();

/**
 * Route            /
 * Des              get all the restaurants based on a city
 * Params           none
 * Access           Public
 * Method           GET
 */

Router.get("/",async (req,res) => {
    try{
        //http://localhost:5000/restaurant/?city=coimbatore

        await ValidateRestaurantCity(req.query); 
        const {city} = req.query;
        const restaurants = await RestaurantModel.find({city});
        
        if(restaurants.length===0){
            return res.json({error: "No restaurants found in the city"});
        }
        return res.json({ restaurants })
    }catch(error){
        return res.status(500).json({ error: error.message});
    }
})

/**
 * Route            /:_id
 * Des              get individual restaurants details based on id
 * Params           none
 * Access           Public
 * Method           GET
 */

//http://localhost:5000/restaurant/234tger4444323
Router.get("/:_id", async(req,res) =>{
    try{
        await validateId(req.params);
        const {_id} = req.params;
        const restaurant = await RestaurantModel.findById(_id);

        if(!restaurant) return res.status(400).json({error: "Restaurant not found"});

        return res.json({ restaurant });
    }catch(error){
        return res.status(500).json({ error: error.message});
    }
})

/**
 * Route            /search
 * Des              get restaurants details based on search string
 * Params           none
 * Access           Public
 * Method           GET
 */


Router.get("/search/:searchString", async(req,res) =>{
    try{
        await ValidateRestaurantSearchString(req.params);
        const {searchString} = req.params;
        const restaurants = await RestaurantModel.find({
            name: {$regex: searchString, $options: "i"}, //i- ignores case sensitivity and regex- regular expression-gives all possible result based on searchString
        });

        if(!restaurants) return res.status(404).json({error: `No restaurants matched with ${searchString}`});

        return res.json({restaurants});
    }catch(error){
        return res.status(500).json({ error: error.message});
    }
})

export default Router;