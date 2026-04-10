import axiosInstance from "@/lib/axios";


export const postQuestion = async (data: any) => {
    try{
    const res = await axiosInstance.post(`/chats/ask`, data);
    return res.data;
    }
  
  catch(err){
    console.error(err)
    throw err
  }
};

export const getFollowUpSuggestion = async (documentId:string,data: any) => {
    try{
    const res = await axiosInstance.post(`/suggestion/followup/${documentId}`, data);
    return res.data;
    }
  
  catch(err){
    console.error(err)
    throw err
  }
};


export const getInitialSuggestion = async (documentId:string) => {
    try{
    const res = await axiosInstance.get(`/suggestion/initial/${documentId}`);
    return res.data;
    }
  
  catch(err){
    console.error(err)
    throw err
  }
};


export const getChatHistory = async (documentId:string) => {
    try{
       const res = await axiosInstance.get(`/chats/chatHistory/${documentId}` );
    return res.data;
    }
  
  catch(err){
    console.error(err)
    throw err
  }
};
