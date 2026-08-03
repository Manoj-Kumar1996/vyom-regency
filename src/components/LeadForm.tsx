"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    otherCity: "",
    project: "",
  });
  const [projects, setProjects] = useState<{ name: string; slug: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("properties")
        .select("name, slug")
        .order("sort_order", { ascending: true });
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const cityValue = formData.city === "other" ? formData.otherCity : formData.city;

    const leadPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      city: cityValue || null,
      project: formData.project || null,
      source: "website",
      status: "new",
    };

    if (!leadPayload.name || !leadPayload.phone || !cityValue) {
      toast.error("Please fill all required fields.");
      setStatus("error");
      return;
    }

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadPayload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Failed to submit lead");
      }
    } catch (error) {
      console.error("Lead API submission failed, trying direct Supabase insert:", error);

      const { error: fallbackError } = await supabase.from("leads").insert([leadPayload]);

      if (fallbackError) {
        console.error("Direct lead submission failed:", fallbackError);
        toast.error("Submission failed", {
          description: "Please try again or call us directly.",
        });
        setStatus("error");
        return;
      }
    }

    toast.success("Success!", {
      description: "We have received your request. Our team will call you shortly.",
    });

    setStatus("success");
    setFormData({ name: "", phone: "", email: "", city: "", otherCity: "", project: "" });
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div id="lead-form" className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl mx-auto border-t-4 border-amber-500">
      <div className="bg-gradient-to-r from-green-50 to-amber-50 p-3 rounded-lg text-center mb-6 border border-green-200">
        <p className="text-green-800 font-semibold">
          ✅ <strong>Exclusive Site Visit Experience</strong>
        </p>
        <p className="text-sm text-gray-600">
          ✔ One-to-One Property Consultation | ✔ Limited Plots – Priority Access
        </p>
      </div>
      
      <h3 className="text-2xl font-serif font-bold text-center text-gray-800 mb-2">
        Book Your <span className="text-amber-600">Site Visit</span>
      </h3>
      <p className="text-center text-gray-500 mb-6">Limited plots available — Don't miss out!</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
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
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500" 
          />
          <div className="relative">
            <select 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select City *</option>
              <option value="delhi">Delhi NCR</option>
              <option value="noida">Noida</option>
              <option value="gurgaon">Gurgaon</option>
              <option value="alwar">Alwar</option>
              <option value="other">Other</option>
            </select>
            {formData.city === "other" && (
              <input
                type="text"
                name="otherCity"
                value={formData.otherCity}
                onChange={handleChange}
                placeholder="Enter your city name *"
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 mt-2"
              />
            )}
          </div>
        </div>
        
        <select 
          name="project" 
          value={formData.project} 
          onChange={handleChange} 
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Project Interested In</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>{p.name}</option>
          ))}
          <option value="individual-land">Individual Premium Farm Land</option>
        </select>
        
        <button 
          type="submit" 
          disabled={status === "loading"} 
          className="w-full bg-amber-500 text-gray-900 py-3 rounded-lg font-bold text-lg hover:bg-amber-400 transition disabled:opacity-50"
        >
          {status === "loading" ? "Submitting..." : "📅 Book Site Visit →"}
        </button>
        
        {status === "success" && <p className="text-green-600 text-center font-semibold">✅ We will call you shortly!</p>}
      </form>
      
      <p className="text-xs text-gray-400 text-center mt-4">By submitting, you agree to receive updates. Your privacy is respected.</p>
    </div>
  );
}
