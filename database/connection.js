import mongoose from "mongoose"; 


export default async () => {
    return mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("Database connection established"));
} 
