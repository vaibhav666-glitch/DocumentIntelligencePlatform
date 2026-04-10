"use client";
import { useEffect } from "react";
import "./globals.css";
import { socket } from "@/lib/socket";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

   useEffect(() => {
    console.log("hello man")
    const userId = localStorage.getItem("userId");
   
    if (!userId) return;

    socket.connect();
    socket.emit("join", userId);
    console.log(userId,"youo")
    
 return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <html lang="en">
      <body className="bg-gray-50 flex flex-col min-h-screen">
        
        

        <main >
          {children}
        </main>

      
        
      </body>
    </html>
  );
}