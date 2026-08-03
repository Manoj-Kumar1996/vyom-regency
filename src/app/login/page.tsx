"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/admin");
    }
  }, [session, router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-800">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">Vyom Regency Management Portal</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#15803d',
                  brandAccent: '#166534',
                }
              }
            }
          }}
          providers={[]}
          theme="light"
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/admin`}
        />
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Authorized access only. All activities are logged.
          </p>
        </div>
      </div>
    </div>
  );
}