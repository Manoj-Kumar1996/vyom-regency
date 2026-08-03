"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  propertyName?: string;
  source: string;
  submitLabel?: string;
  onSuccess?: () => void;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  title,
  subtitle,
  propertyName,
  source,
  submitLabel = "Submit →",
  onSuccess,
}: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

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
      project: propertyName || null,
      source,
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
    setFormData({ name: "", phone: "", email: "" });
    onSuccess?.();
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <h3 className="text-2xl font-serif font-bold text-gray-800 mb-1">{title}</h3>
        {subtitle && <p className="text-gray-500 text-sm mb-6">{subtitle}</p>}
        {propertyName && (
          <p className="text-green-700 font-semibold text-sm mb-4">Regarding: {propertyName}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number *"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-gray-900 py-3 rounded-lg font-bold text-lg hover:bg-amber-400 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : submitLabel}
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">
          By submitting, you agree to receive updates. Your privacy is respected.
        </p>
      </div>
    </div>,
    document.body
  );
}
