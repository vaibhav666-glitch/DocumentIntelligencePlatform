import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import * as userRepo from "../repository/user.repository";

export const registerUser=async (email:string,password:string)=>{
    const existingUser=await userRepo.findUserByEmail(email);
    if(existingUser)
        throw new Error("User already exists");
    const hashedPassword=await bcrypt.hash(password,10);
    const user=await userRepo.createUser({
        email,password:hashedPassword,
    });
    return user;
}

export const loginUser=async (email:string,password:string)=>{
    const user =await userRepo.findUserByEmail(email);
    if(!user)
        throw new Error("Invalid Email");

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("Invalid Password");
    }

    const token=jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET as string,
        {expiresIn: "7d"}
    );

    return token;
}
