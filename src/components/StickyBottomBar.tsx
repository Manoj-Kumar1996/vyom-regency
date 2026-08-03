"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StickyBottomBar() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-2xl border-t-4 border-amber-500 z-50 py-2 px-4">
      <div className="container mx-auto flex justify-center gap-4">
        <a
          href="tel:+918955311031"
          className="bg-green-700 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-green-800 transition text-sm md:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Call Now
        </a>
        <Link
          href="/#lead-form"
          className="bg-amber-500 text-gray-900 px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-amber-400 transition text-sm md:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Book Site Visit
        </Link>
      </div>
    </div>
  );
}