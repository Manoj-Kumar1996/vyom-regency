"use client";

import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const phoneNumber = "918955311031";
  const message = "Hi, I'm interested in Vyom Regency farmhouse plots. Please share more details.";

  return (
    <div className="fixed bottom-6 right-4 md:bottom-6 md:right-14 lg:right-16 z-50 flex items-center justify-center pointer-events-auto">
      {/* Continuous pulsing aura ripple effect */}
      <span className="absolute inline-flex h-14 w-14 rounded-full bg-green-500/40 animate-ping" />
      <span className="absolute inline-flex h-16 w-16 rounded-full bg-green-400/20 animate-pulse" />

      {/* Main Floating Button with smooth continuous float/bounce */}
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-3.5 rounded-full shadow-[0_4px_25px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 group flex items-center justify-center animate-bounce"
        style={{ animationDuration: "3s" }}
        aria-label="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
          className="group-hover:rotate-12 transition-transform duration-300"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.298-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.298-.765.967-.938 1.165-.173.198-.347.223-.645.074-.298-.149-1.259-.464-2.399-1.48-.887-.79-1.486-1.766-1.66-2.064-.173-.298-.019-.459.13-.607.134-.134.297-.347.446-.521.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.241-.579-.487-.5-.669-.51-.173-.01-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.478 0 1.462 1.065 2.874 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413z"/>
        </svg>

        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg">
          Chat on WhatsApp
          <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></span>
        </span>
      </a>
    </div>
  );
}