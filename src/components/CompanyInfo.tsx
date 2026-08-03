"use client";

import { Handshake, Clock, Leaf } from "lucide-react";

export default function CompanyInfo() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Welcome to <span className="text-green-700">Vyom Regency Pvt Ltd</span>
        </h2>
        <p className="text-green-600 text-lg mb-6">
          Crafting Trust. Developing Nature.
        </p>
        <div className="w-20 h-1 bg-green-700 mx-auto mb-8"></div>
        
        <p className="text-gray-700 text-lg mb-6">
          Established in <strong className="text-green-700">2017</strong>, Vyom Regency Pvt Ltd has emerged as a trusted name in agricultural land development, delivering not just land — but a vision of peaceful, sustainable living.
        </p>
        
        <p className="text-gray-600 mb-6">
          We specialize in premium agricultural plots equipped with essential amenities, thoughtfully designed for farmhouse development and authentic rural experiences. Every project reflects our commitment to transparency, legal clarity, and long-term value.
        </p>
        
        <p className="text-gray-600 mb-6">
          With deep industry experience, we understand market dynamics and prioritize what truly matters — your trust, your investment, and your future.
        </p>
        
        <p className="text-gray-600">
          👉 Whether you're looking for a serene farmhouse retreat or a secure land investment, Vyom Regency ensures a seamless and reliable journey.
        </p>
      </div>
    </section>
  );
}