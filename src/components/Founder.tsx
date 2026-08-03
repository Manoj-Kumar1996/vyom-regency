"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Founder() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Our <span className="text-green-700">Founder</span></h2>
        <div className="w-20 h-1 bg-green-700 mx-auto mb-8 rounded-full"></div>

        <div className="flex flex-col md:flex-row items-center gap-8 text-left">
          <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-white flex-shrink-0 mx-auto md:mx-0">
            <img
              src="/Founder-img.jpg"
              alt="Mr. Sobaran Singh"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">Mr. Sobaran Singh</h3>
            <p className="text-green-600 font-semibold mb-4">Founder & Managing Director</p>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              With the discipline of an elite commando and over 15 years of real estate expertise,
              Mr. Sobaran Singh founded Vyom Regency to bring transparency and integrity to
              agricultural land development.
            </p>
            <Link
              href="/founder"
              className="inline-flex items-center gap-2 text-green-700 font-bold hover:text-green-800 transition group"
            >
              Read Full Story
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}