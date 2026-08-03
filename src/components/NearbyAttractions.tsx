"use client";

import {
  TreePine,
  Castle,
  Building2,
  Crown,
  Compass,
  Sprout,
  Building,
  Map,
  Clock,
  Navigation2
} from "lucide-react";

export default function NearbyAttractions() {
  const attractions = [
    {
      name: "Sariska Tiger Reserve",
      distance: "65 km",
      type: "Wildlife",
      icon: <TreePine className="w-6 h-6" />,
      description: "Famous tiger reserve & national park for weekend safaris.",
      duration: "50 min",
    },
    {
      name: "Neemrana Fort",
      distance: "48 km",
      type: "Heritage",
      icon: <Castle className="w-6 h-6" />,
      description: "16th-century stepwell fort & heritage destination.",
      duration: "1 hr 10 min",
    },
    {
      name: "Tijara Fort",
      distance: "25 km",
      type: "Heritage",
      icon: <Building2 className="w-6 h-6" />,
      description: "Historic fort with stunning views of the countryside.",
      duration: "35 min",
    },
    {
      name: "City Palace Alwar",
      distance: "28 km",
      type: "Palace",
      icon: <Crown className="w-6 h-6" />,
      description: "Royal palace housing a museum of rare artifacts.",
      duration: "40 min",
    },
    {
      name: "Bala Quila Fort",
      distance: "30 km",
      type: "Heritage",
      icon: <Map className="w-6 h-6" />,
      description: "Ancient fort perched atop the Aravalli hills.",
      duration: "45 min",
    },
    {
      name: "Krishi College",
      distance: "4 km",
      type: "Education",
      icon: <Sprout className="w-6 h-6" />,
      description: "Government Agriculture University nearby.",
      duration: "8 min",
    },
    {
      name: "District Center",
      distance: "7 km",
      type: "Urban",
      icon: <Building className="w-6 h-6" />,
      description: "Main market area with banks and essential shops.",
      duration: "12 min",
    },
    {
      name: "Aravalli Range",
      distance: "Local",
      type: "Nature",
      icon: <Compass className="w-6 h-6" />,
      description: "Beautiful hills surrounding the entire project area.",
      duration: "Walking",
    },
  ];

  return (
    <section id="nearby" className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header - Fixed width to prevent stretching */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-green-700 font-bold text-xs uppercase tracking-[0.2em] mb-3 block">
            Explore Your Surroundings
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 leading-tight">
            Nearby <span className="text-amber-600">Heritage</span> & Attractions
          </h2>
          <p className="text-gray-500 mt-4 text-lg font-medium leading-relaxed">
            Vyom Regency is strategically located within reach of Rajasthan's most iconic landmarks and essential hubs.
          </p>
          <div className="w-16 h-1 bg-green-700 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Attractions Grid - 3 Columns for better alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {attractions.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute -right-4 -bottom-4 text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-150 rotate-12">
                {item.icon}
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className="bg-green-50 text-green-700 p-3 rounded-2xl group-hover:bg-green-700 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <Navigation2 size={12} fill="currentColor" />
                    {item.distance}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                {item.name}
              </h3>

              <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-3">
                <span className="text-green-600">{item.type}</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} /> {item.duration}
                </span>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Progress Bar Style Distance UI */}
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden mr-4">
                  <div
                    className="h-full bg-green-600/30 group-hover:bg-green-600 transition-all duration-500"
                    style={{ width: idx % 2 === 0 ? '70%' : '45%' }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">View Route</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Feature Note */}
        <div className="mt-16 max-w-4xl mx-auto bg-green-900 rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden group">
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-10 group-hover:scale-110 transition-transform duration-1000">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.5" fill="white" />
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <p className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-3">Location Advantage</p>
            <h3 className="text-white text-xl md:text-2xl font-serif font-bold mb-4">
              Centrally located between wildlife and urban luxury.
            </h3>
            <p className="text-green-100/70 text-sm max-w-2xl mx-auto leading-relaxed">
              Khairthal Kishangarh Bas serves as the perfect base camp for Rajasthan's heritage circuit.
              Everything you need is within a comfortable 1-hour drive.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}