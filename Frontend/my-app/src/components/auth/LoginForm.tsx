"use client";

import { useState } from "react";
import InputField from "../common/InputField";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Loader from "../common/Loader";
const LoginForm = ({ onSubmit }: any) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });


const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
 const router = useRouter();
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // clear error on typing
    setErrors((prev: any) => ({
      ...prev,
      [e.target.name]: "",
      backend: "",
    }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
     const resp= await onSubmit(form, isSignup);
     //console.log(resp,"baley")
     router.push("/dashboard");
    } catch (err: any) {
      setErrors({ backend: err?.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  if(loading)
    return <Loader/>
 return (
  <div className="p-6 max-w-md mx-auto space-y-6 text-white">

  {/* Title */}
  <div className="text-center">
    <h2 className="text-xl font-semibold tracking-wide">
      {isSignup ? "Create your IntelliDocs account" : "Login to IntelliDocs"}
    </h2>

    <p className="text-gray-400 text-sm mt-1">
      {isSignup
        ? "Upload, analyze & chat with your documents using AI"
        : "Continue exploring your documents with AI"}
    </p>
  </div>

  {/* Email */}
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-300">
      Email <span className="text-red-400">*</span>
    </label>

    <InputField
      name="email"
      value={form.email}
      onChange={handleChange}
      placeholder="Enter your email"
      className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 
      text-white placeholder-gray-400 outline-none 
      focus:ring-2 focus:ring-blue-400 focus:border-transparent 
      transition shadow-sm focus:shadow-blue-500/20"
    />

    {errors.email && (
      <p className="text-red-400 text-xs">{errors.email}</p>
    )}
  </div>

  {/* Password */}
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-300">
      Password <span className="text-red-400">*</span>
    </label>

    <div className="relative">
      <InputField
        name="password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange}
        placeholder="Enter your password"
        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 
        text-white placeholder-gray-400 outline-none 
        focus:ring-2 focus:ring-indigo-400 focus:border-transparent 
        transition shadow-sm focus:shadow-indigo-500/20"
      />

      {/* Eye Icon */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>

    {errors.password && (
      <p className="text-red-400 text-xs">{errors.password}</p>
    )}
  </div>

  {/* Backend Error */}
  {errors.backend && (
    <div className="bg-red-500/10 border border-red-400/40 text-red-300 text-sm p-3 rounded-xl backdrop-blur-sm">
      {errors.backend}
    </div>
  )}

  {/* Button */}
  <button
    onClick={handleSubmit}
    disabled={loading}
    className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 
    text-white py-2.5 rounded-xl font-semibold tracking-wide 
    hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/30 
    active:scale-95 transition-all duration-200 disabled:opacity-50"
  >
    {loading
      ? "Processing..."
      : isSignup
      ? "Create Account"
      : "Login"}
  </button>

  {/* Divider */}
  <div className="flex items-center gap-3">
    <div className="flex-1 h-px bg-white/20" />
    <span className="text-xs text-gray-400">or</span>
    <div className="flex-1 h-px bg-white/20" />
  </div>

  {/* Toggle */}
  <p
    className="text-center text-sm text-gray-400 cursor-pointer hover:text-white transition"
    onClick={() => setIsSignup(!isSignup)}
  >
    {isSignup
      ? "Already have an account? "
      : "New to IntelliDocs? "}
    <span className="text-blue-400 font-medium">
      {isSignup ? "Login" : "Sign Up"}
    </span>
  </p>

  {/* Footer hint */}
  <p className="text-center text-xs text-gray-500">
    Secure • AI-powered • Private document insights
  </p>
</div>
);
};

export default LoginForm;