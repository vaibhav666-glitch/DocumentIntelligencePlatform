import axiosInstance from "@/lib/axios";


export const postDocument = async (file: any) => {
    try{
        
         const formData = new FormData();
      console.log("am fiel",file)
    // assuming data.file is your file
    formData.append("file", file);
    const res = await axiosInstance.post(`/documents/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;

}
  
  catch(err){
    console.error(err)
    throw err
  }
};


export const deleteDocument = async (documentId: string) => {
    try{
    const res = await axiosInstance.delete(`/documents/${documentId}`);
    return res.data;
    }
  
  catch(err){
    console.error(err)
    throw err
  }
};


export const getAllDocument = async () => {
    try{
    const res = await axiosInstance.get(`/documents`);
    return res.data;
    }
  
  catch(err){
    console.error(err)
    throw err
  }
};



export const getDocumentById = async (documentId:string) => {
    try{
    const res = await axiosInstance.get(`/documents/${documentId}`);
    return res.data;
    }
  
  catch(err){
    console.error(err)
    throw err
  }
};