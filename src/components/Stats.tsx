"use client";

import { TrendingUp, Users, MapPin, Award } from "lucide-react";

export default function Stats() {
  const stats = [
    { 
      label: "Land Parcels", 
      value: "50+", 
      icon: <TrendingUp className="text-amber-500" size={32} />,
      sub: "Successfully Delivered"
    },
    { 
      label: "Happy Families", 
      value: "200+", 
      icon: <Users className="text-amber-500" size={32} />,
      sub: "Trusting Our Vision"
    },
    { 
      label: "Projects Delivered", 
      value: "03", 
      icon: <MapPin className="text-amber-500" size={32} />,
      sub: "Successfully in Rajasthan"
    },
    { 
      label: "Experience", 
      value: "20+", 
      icon: <Award className="text-amber-500" size={32} />,
      sub: "Years of Expertise"
    },
  ];

  return (
    <section className="section-padding bg-emerald-950 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-800/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((item, idx) => (
            <div key={idx} className="text-center group">
              <div className="mb-6 inline-flex p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all duration-500">
                {item.icon}
              </div>
              <div className="text-5xl md:text-6xl font-bold text-amber-400 mb-2 tracking-tighter">
                {item.value}
              </div>
              <div className="text-xl font-bold text-white mb-1">{item.label}</div>
              <div className="text-emerald-200/60 text-sm font-medium">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}