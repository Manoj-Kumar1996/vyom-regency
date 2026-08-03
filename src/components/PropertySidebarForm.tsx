"use client";

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User, Phone, Mail, ShieldCheck, Zap, PhoneCall, CheckCircle2 } from "lucide-react";

interface PropertySidebarFormProps {
  propertyName: string;
}

export default function PropertySidebarForm({ propertyName }: PropertySidebarFormProps) {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim() || null;

    if (!name || !phone) {
      toast.error("Please fill your name and mobile number.");
      return;
    }

    setLoading(true);
    const leadPayload = {
      name,
      phone,
      email,
      project: propertyName,
      source: "property_sidebar",
      status: "new",
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Failed to submit");
      }
    } catch (error) {
      console.error("Lead API submission failed, trying direct Supabase insert:", error);
      const { error: fallbackError } = await supabase.from("leads").insert([leadPayload]);
      if (fallbackError) {
        toast.error("Submission failed", { description: "Please try again or call us directly." });
        setLoading(false);
        return;
      }
    }

    toast.success("Thank you!", { description: "Our team will get in touch shortly." });
    setLoading(false);
    setSuccess(true);
    setFormData({ name: "", phone: "", email: "" });
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-green-100">
      <div className="bg-gradient-to-r from-green-700 to-green-800 px-5 py-4 text-white">
        <div className="flex items-center gap-2">
          <PhoneCall size={18} className="text-amber-300" />
          <h3 className="font-bold">Get a Callback</h3>
        </div>
        <p className="text-xs text-green-100 mt-0.5 flex items-center gap-1">
          <Zap size={12} className="text-amber-300" /> Our team calls within 10 minutes
        </p>
      </div>

      <div className="bg-white p-5">
        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 className="text-green-600 mx-auto mb-2" size={36} />
            <p className="text-gray-800 text-sm font-semibold">Thanks! We&apos;ll call you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number *"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 text-gray-900 py-3 rounded-lg font-bold text-sm hover:bg-amber-400 transition disabled:opacity-50 shadow-md"
            >
              {loading ? "Submitting..." : "Request Callback →"}
            </button>
            <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-green-600" /> 100% Privacy. No spam, ever.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
