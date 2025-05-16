import jwt from "jsonwebtoken";
import User from "../models/User.js"

export const protectRoute = async (req , res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message: "Unauthorized  - No token provided"})
        }

    } catch (error) {
        
    }
}