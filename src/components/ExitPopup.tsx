"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ExitPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isVisible && !submitted) {
        setIsVisible(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [isVisible, submitted]);

  // Don't show on admin pages
  if (!isMounted || pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            We've received your request. Our team will call you within 10 minutes.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setLoading(true);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          source: "exit-popup",
          message: "Interested in discount offer",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit lead");
      }
      setSubmitted(true);
      setIsVisible(false);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-600 via-amber-500 to-green-600"></div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 z-10 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-6 text-center">
          <div className="relative inline-block mb-3">
            <div className="absolute inset-0 animate-ping bg-amber-400 rounded-full opacity-30"></div>
            <div className="relative w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-md">
              <span className="text-2xl">🎁</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-1">
            Wait! <span className="text-green-700">Don't Leave</span>
          </h3>
          
          <p className="text-gray-600 text-sm mb-3">
            Get <span className="font-bold text-green-700">₹50,000 OFF</span> on your booking
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 mb-3">
            <input
              type="text"
              placeholder="Full Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-700 to-green-800 text-white py-2.5 rounded-xl font-semibold text-sm hover:from-green-800 hover:to-green-900 transition shadow-md disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Claim Discount →"}
            </button>
          </form>

          <div className="flex justify-center gap-1 mb-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-500">Only 2 plots left at this price</span>
          </div>
        </div>
      </div>
    </div>
  );
}
