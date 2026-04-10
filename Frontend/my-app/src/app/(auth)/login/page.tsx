"use client";

import LoginForm from "@/components/auth/LoginForm";
import { loginUser, signupUser } from "@/services/auth.service";

const LoginPage = () => {
  const handleAuth = async (form: any, isSignup: boolean) => {
    if (isSignup) {
      await signupUser(form);
    } else {
      await loginUser(form);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-indigo-900 relative overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-500 opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      {/* Card */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md z-10">

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome to IntelliDocs 🧠
        </h1>

        

        <LoginForm onSubmit={handleAuth} />

        {/* Optional footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Secure • Fast • AI-Powered Insights
        </p>
      </div>
    </div>
  );
};

export default LoginPage;