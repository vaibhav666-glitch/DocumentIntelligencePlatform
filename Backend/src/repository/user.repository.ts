import { User } from "../models/user.models";

export const findUserByEmail=async(email:string)=>{
    return await User.findOne({email});
}

export const createUser=async(data:{
    email:string,
    password:string,
})=>{
    return await User.create(data);
};