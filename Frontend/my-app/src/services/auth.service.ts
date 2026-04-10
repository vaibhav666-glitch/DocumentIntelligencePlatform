// /services/auth.service.ts
import axiosInstance from "@/lib/axios";
import { socket } from "@/lib/socket";

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
    try{
  const res = await axiosInstance.post("/auth/login", data);

  if(res?.data?.token)
{
  localStorage.setItem('token',res.data.token)
  localStorage.setItem('userId',res.data.userId)

   socket.connect();
  socket.emit("join", res.data.userId);
 console.log(res.data.userId,"youo")
} 
return res.data;
    }
    catch(err){
        console.error(err)
         throw err
    }
};

export const signupUser = async (data: {
  email: string;
  password: string;
}) => {
    try{
  const res = await axiosInstance.post("/auth/register", data);
   if(res?.data?.message=== "User created")
    await loginUser(data)

  console.log("am res",res)
  return res.data;
  }
    catch(err){
      console.log("yuo baba ki")
        console.log(err)
        throw err
    }
};