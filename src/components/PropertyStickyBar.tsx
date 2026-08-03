"use client";

import { Phone, MessageCircle } from "lucide-react";

interface PropertyStickyBarProps {
  onEnquire: () => void;
}

export default function PropertyStickyBar({ onEnquire }: PropertyStickyBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-2xl border-t-4 border-amber-500 z-40 py-2 px-4 flex gap-3">
      <a
        href="tel:+918955311031"
        className="flex-1 bg-white border-2 border-green-700 text-green-700 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 text-sm"
      >
        <Phone size={16} /> Call Now
      </a>
      <button
        onClick={onEnquire}
        className="flex-1 bg-green-700 text-white py-2.5 rounded-full font-bold flex items-center justify-center gap-2 text-sm"
      >
        <MessageCircle size={16} /> Enquire Now
      </button>
    </div>
  );
}
