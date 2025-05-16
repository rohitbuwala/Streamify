import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {upsertStreamUse } from "../lib/stream.js";
  

export async function signup (req , res ) {
   try {
    const {email, password, fullName} = req.body;
 
    if(!fullName || !email || !password){
     return res.status(400).json({message: "All fields are required"})
    }
 
    if(password.length < 6){
     return res.status(400).json({message: "Password must be at least 6 characters"})
    }
 
    // check mail
 
    const emailRegex = /^[^/s@]+@[^\s@]+\.[^\s@]+$/;
 
    if(!emailRegex.test(email)){
     return res.status(400).json({message: "Invalid email format"})
    }
 
    const existingUser = await User.findOne({ email });

    if (existingUser) {
     return res.status(400).json({ message: "Email already exists. Please use a different one." });
    }

    const idx = Math.floor(Math.random() *100) + 1 ; 
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`



    const newUser = await User.create({
    email,
    password,
    fullName,
    profilePic: randomAvatar,
        });


    await upsertStreamUse({
        id: newUser._id.toString(),
        name: newUser.fullName,
        Image: newUser.profilePic || ""
    })


    const token = jwt.sign({useId:newUser._id}, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d"        
    }) 

    res.cookie("jwt", token, {
         maxAge: 7 *24 * 60 * 60 * 1000,
         httpOnly : true,
         sameSite: "strict",
         secure: process.env.NODE_ENV === "production"
    } )

    res.status(201).json({success: true, user: newUser})

   } catch (error) {
    console.log("Error in signUp controller" , error)
    res.status(500).json({message : "internal server error"})
   }

}


export async function login(req , res ) {
    try {
        const {email , password} = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required"})
        };

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({message: "Invalid email "})
        }

       // const isPasswordCorrect = await User.matchPassword(password)
         const isPasswordCorrect = await user.matchPassword(password); // ✅ FIXED

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid password"})

    //     const token = jwt.sign({useId:newUser._id}, process.env.JWT_SECRET_KEY, {
    // expiresIn: "7d"        
    // }) 

     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
         maxAge: 7 *24 * 60 * 60 * 1000,
         httpOnly : true,
         sameSite: "strict",
         secure: process.env.NODE_ENV === "production"
    } )

    return res.status(200).json({success: true, user})

    } catch (error) {
        
        console.log("Error in login controller", error.message);
        return res.status(500).json({message: "Internal server error in login"})
    }
}


export function  logout(req , res ) {
    res.clearCookie("jwt")
    res.status(200).json({success: true, message: "logout successfull"})
}

export async function onboard (req, res ) {
    try {
        //const {userId} = req.user._id;
        const userId = req.user._id; // ✅


        const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

         if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            // fullName,
            // bio,
            // nativeLanguage,
            // learningLanguage,
            // location,

            ...req.body,
            isOnboarded: true
        }, {new: true})

        if(!updatedUser) {
            return res.status(404).json({message: "User not found"})
        }

        //todo : create stream user
       try {
         await upsertStreamUse({
             id: updatedUser._id.toString(),
             name: updatedUser.fullName.toString,
             Image: updatedUser.profilePic || "",
         })
         console.log(`Stream user created updated after onboard for ${updatedUser.fullName}`);
       } catch (error) {
        console.log("Error updating stream user after onboard", error.message);
       }
        
       res.status(200).json({success: true, user: updatedUser})
    } catch (error) {
        console.error("Error in onboard controller", error.message);
        return res.status(500).json({message: "Internal server error in onboard"})
    }
}