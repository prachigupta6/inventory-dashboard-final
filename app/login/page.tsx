"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react"; // Nice icon

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [data, setData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Access Denied.");
    } else {
      router.push("/"); 
      router.refresh();
    }
  };

  return (
    // FULL SCREEN BACKGROUND
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-black">
      
      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
        
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 p-3 rounded-full mb-4 shadow-lg">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Admin Portal</h1>
          <p className="text-gray-300 text-sm mt-2">Secure Access Only</p>
        </div>
        
        {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-6 text-sm text-center font-medium">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input 
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              value={data.email}
              onChange={(e) => setData({...data, email: e.target.value})}
              className="w-full bg-gray-800/50 border border-gray-600 p-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
              placeholder="admin@company.com"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input 
              id="password"
              name="password"
              type="password" 
              autoComplete="current-password"
              value={data.password}
              onChange={(e) => setData({...data, password: e.target.value})}
              className="w-full bg-gray-800/50 border border-gray-600 p-3 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}