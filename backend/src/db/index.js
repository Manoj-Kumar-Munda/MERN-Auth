import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);

    } catch ( error ){
        console.log("Mongo DB connection failed", error)
        process.exit(1)
    }
}