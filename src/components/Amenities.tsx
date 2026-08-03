"use client";

import { 
  Droplets, 
  ShieldCheck, 
  Sprout, 
  Building, 
  Gamepad2, 
  Cctv 
} from "lucide-react";

const amenities = [
  { 
    icon: <Droplets size={24} />, 
    title: "24/7 Water Supply", 
    desc: "Uninterrupted water supply for your farmhouse." 
  },
  { 
    icon: <ShieldCheck size={24} />, 
    title: "Secure Gated Area", 
    desc: "Round‑the‑clock security with gated entry." 
  },
  { 
    icon: <Sprout size={24} />, 
    title: "Smart Farming Infrastructure", 
    desc: "Modern tools and infrastructure for agriculture." 
  },
  { 
    icon: <Building size={24} />, 
    title: "Clubhouse", 
    desc: "Exclusive community clubhouse for residents." 
  },
  { 
    icon: <Gamepad2 size={24} />, 
    title: "Children's Play Area", 
    desc: "Safe and fun play zone for kids." 
  },
  { 
    icon: <Cctv size={24} />, 
    title: "CCTV Surveillance", 
    desc: "24/7 monitoring for enhanced security." 
  },
];

export default function Amenities() {
  return (
    <section id="amenities" className="section-padding bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-emerald-950 mb-6">
            Elite Living-<span className="text-amber-600 italic">Amenities</span>
          </h2>
          <p className="text-lg text-slate-600">
            Experience a lifestyle of comfort and security with our premium facilities.
          </p>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {amenities.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:-translate-y-1"
            >
              <div className="mb-6 inline-flex p-4 bg-green-50 rounded-xl group-hover:bg-green-700 transition-colors duration-300">
                <div className="text-green-700 group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}