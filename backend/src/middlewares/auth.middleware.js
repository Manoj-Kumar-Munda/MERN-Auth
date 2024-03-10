import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"


const verifyJWT = async (req, res, next) => {
    console.log("Verifying Tokens")
    try{
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer","")

        console.log("token ", token);
    

        if( !token ){
            throw new ApiError(401, "Unauthorized request");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select("-password -refreshToken")

        if(!user){
            throw new Error(500, "Something went wrong");
        }
        req.user = user;
        next();
    } catch (error){
        // throw new ApiError(403, error?.message || "Invalid access token")
        next(error);
    }
}

export { verifyJWT }