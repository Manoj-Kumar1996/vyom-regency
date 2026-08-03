"use client";

import { useEffect, useRef, useState } from "react";

export default function CounterAnimation() {
  const [counts, setCounts] = useState({ parcels: 0, states: 0, satisfaction: 0 });
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          const animateValue = (start: number, end: number, duration: number, setter: (val: number) => void) => {
            let startTime: number | null = null;
            const step = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const value = Math.floor(progress * (end - start) + start);
              setter(value);
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          };

          animateValue(0, 50, 2000, (val) => setCounts(prev => ({ ...prev, parcels: val })));
          animateValue(0, 3, 1500, (val) => setCounts(prev => ({ ...prev, states: val })));
          animateValue(0, 100, 2000, (val) => setCounts(prev => ({ ...prev, satisfaction: val })));
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      
      {/* Card 1 - Land Parcels */}
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
        {/* Animated Border Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative bg-white rounded-2xl m-[1px] p-8 text-center transition-all duration-500">
          {/* Icon Circle with Glow */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          
          {/* Counter Number */}
          <div className="text-5xl md:text-6xl font-bold text-gray-800 mb-2 stat-number tracking-tight">
            {counts.parcels}+
          </div>
          
          <p className="text-gray-600 font-semibold text-lg mb-1">Land Parcels</p>
          <p className="text-gray-500 text-sm mb-4">Successfully Delivered</p>
          
          {/* Success Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            <span className="text-green-700 text-xs font-semibold">100% Success Rate</span>
          </div>
        </div>
      </div>

      {/* Card 2 - Projects Delivered */}
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative bg-white rounded-2xl m-[1px] p-8 text-center transition-all duration-500">
          {/* Icon Circle with Glow */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-amber-500 rounded-full opacity-20 animate-ping"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <div className="text-5xl md:text-6xl font-bold text-gray-800 mb-2 stat-number tracking-tight">
            {counts.states.toString().padStart(2, '0')}
          </div>
          
          <p className="text-gray-600 font-semibold text-lg mb-1">Projects Delivered</p>
          <p className="text-gray-500 text-sm mb-4">Successfully in Rajasthan</p>
          
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></span>
            <span className="text-amber-700 text-xs font-semibold">Expanding Rapidly</span>
          </div>
        </div>
      </div>

      {/* Card 3 - Client Satisfaction */}
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative bg-white rounded-2xl m-[1px] p-8 text-center transition-all duration-500">
          {/* Icon Circle with Glow */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 animate-ping"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
          </div>
          
          <div className="text-5xl md:text-6xl font-bold text-gray-800 mb-2 stat-number tracking-tight">
            {counts.satisfaction}%
          </div>
          
          <p className="text-gray-600 font-semibold text-lg mb-1">Client Satisfaction</p>
          <p className="text-gray-500 text-sm mb-4">From 50+ Happy Families</p>
          
          <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full">
            <span className="flex gap-0.5">
              {[1,2,3,4,5].map((star) => (
                <svg key={star} className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
            </span>
            <span className="text-emerald-700 text-xs font-semibold">5.0 Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}