require('dotenv').config();
import express from "express";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";


// Database Connection
import ConnectDB from "./database/connection";

// google authentication config
import googleAuthConfig from './config/google.config';

// private route authentication config
import privateRouteConfig from './config/route.config'

//API
import Auth from './API/Auth' 
import Restaurant from './API/Restaurant'
import Food from './API/Food'
import Menu from './API/Menu'
import Image from './API/Image'
import Order from './API/Order'
import Review from './API/Review'
import User from './API/User'
import Mail from "./API/Mail";

//passport config
googleAuthConfig(passport);
privateRouteConfig(passport);

const zomato = express();
zomato.use(express.json()); //to read json body request (middleware) 
zomato.use(cors());
zomato.use(helmet());
zomato.use(passport.initialize());

//Application Router
zomato.use("/auth", Auth)
zomato.use("/restaurant", Restaurant)
zomato.use("/food", Food)
zomato.use("/menu", Menu)
zomato.use("/image", Image)
zomato.use("/user", User)
zomato.use("/review", Review)
zomato.use("/order", Order)
zomato.use("/mail", Mail)

const PORT = process.env.PORT || 5000;

  zomato.listen(PORT, () => {
    ConnectDB().then(() =>{
      console.log("Server is running...")
    }).catch((e) =>{
      console.log("Server is running, but database connection failed")
      console.log(e)
    });
    });
    
  
