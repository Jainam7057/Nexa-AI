import User from "../model/user.models.js"
import bcrypt from "bcrypt"
import  config  from "../config.js"
import jwt from "jsonwebtoken"


const singupUser = async (req,res) =>  {
    try {

        const { firstName,lastName,email,password }=req.body
        const user= await User.findOne({email:email})
        if(user){
            return res.status(401).json({message:"User already exist!"})
        }
        const hashPassword = await bcrypt.hash(password,10)

        const newUser= new User({ firstName,lastName,email,password:hashPassword })
        await newUser.save();
        return res.status(201).json({message:"User singup successfully!"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error!"})
        
    }
}

const loginUser = async (req,res) => {
    const { email,password }=req.body
    try {
         const isUser= await User.findOne({email:email})
         if(!isUser){
            return res.status(403).json({message:"Invalid Credentials!"})
         }

         const isPasswordCorret = await bcrypt.compare(password,isUser.password)

         if(!isPasswordCorret){
            return res.status(403).json({message:"Invalid Credentials!"})
         }
         
         //JWT TOKEN

         const token= jwt.sign({id:isUser._id},config.JWT_USER_PASSWORD,{
            expiresIn:"1d"
         })
         const cookieOptions ={
            expires:new Date(Date.now() + 24*60*60*1000),
            httpOnly: true,
            secure:process.env.NODE_ENV === "production",
             sameSite: 'strict',
         } 
         res.cookie("jwt",token,cookieOptions)
             return res.status(201).json({message:"User loggedin successfully!",isUser,token})
             
    } catch (error) {
        console.log(error)
         return res.status(500).json({message:"Server error!"})
    }
       
}

const logout = async (req,res) => {
      try {
        res.clearCookie("jwt")
         return res.status(200).json({message:"User logout successfully!"})
      } catch (error) {
        console.log(error)
         return res.status(500).json({message:"Server error!"})
      }
}

export {singupUser ,loginUser, logout};