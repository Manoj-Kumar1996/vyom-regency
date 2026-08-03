"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin/dashboard");
    }
    setLoading(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 px-4 py-12">
      {/* Decorative depth — soft glow orbs so the background reads intentional, not a flat cutoff */}
      <div className="pointer-events-none fixed -top-32 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="pointer-events-none fixed -bottom-32 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 p-8 sm:p-10 border border-white/10">
          <div className="flex flex-col items-center text-center mb-8">
            <Image
              src="/vyom-regency-logo.jpg"
              alt="Vyom Regency Pvt Ltd"
              width={1717}
              height={259}
              className="h-10 w-auto mb-4"
              priority
            />
            <h1 className="text-2xl font-bold text-gray-800">
              Vyom <span className="text-green-700">Regency</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-green-600" /> Admin Panel Login
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-gray-50/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 border border-gray-200 bg-gray-50/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 border border-red-100 rounded-lg py-2 px-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3.5 rounded-xl font-semibold hover:bg-green-800 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : null}
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">
          Authorized access only. All activities are logged.
        </p>
      </div>
    </div>
  );
}
