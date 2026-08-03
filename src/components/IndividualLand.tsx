"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, MapPin, ChevronRight } from "lucide-react";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { getPropertiesByType, type Property } from "@/lib/properties";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export default function IndividualLand() {
  const [lands, setLands] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeLands();
  }, []);

  const fetchHomeLands = async () => {
    setLands(await getPropertiesByType("individual", { homeOnly: true, order: "sort_order" }));
    setLoading(false);
  };

  if (loading || lands.length === 0) return null;

  // Always lay out as a plain grid based on how many lands there are — a fixed
  // per-property "display mode" caused earlier bugs (some lands got silently
  // hidden, or an unwanted carousel showed up). Grid always shows everything.
  const gridClass =
    lands.length === 1
      ? "max-w-3xl mx-auto"
      : lands.length === 2
      ? "grid md:grid-cols-2 gap-8 max-w-7xl mx-auto"
      : "grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto";

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4 shadow-lg">
            <Crown className="w-4 h-4" /> Premium Offering
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Individual <span className="text-amber-600">Premium Farm Lands</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Exclusive pieces of paradise selected for you
          </p>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className={gridClass}>
          {lands.map((land) => (
            <LandCard key={land.id} land={land} fullSize={lands.length === 1} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/estates?type=individual" 
            className="inline-flex items-center gap-2 bg-white border-2 border-green-700 text-green-700 px-8 py-3 rounded-full font-bold hover:bg-green-700 hover:text-white transition duration-300 shadow-lg"
          >
            View All Individual Lands
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function LandCard({ land, fullSize }: { land: Property; fullSize: boolean }) {
  const [showEnquire, setShowEnquire] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden group border border-gray-100 h-full flex flex-col">
      <LeadCaptureModal
        isOpen={showEnquire}
        onClose={() => setShowEnquire(false)}
        title="Enquire Now"
        subtitle="Share your details and our team will call you shortly."
        propertyName={land.name}
        source="property_enquiry"
        submitLabel="Send Enquiry →"
      />
      <div className={`relative overflow-hidden ${fullSize ? 'h-96 md:h-[500px]' : 'h-64'}`}>
        <img
          src={land.image_url || ""}
          alt={land.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">Individual Plot</span>
        </div>
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{land.name}</h3>
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <MapPin size={16} className="text-amber-600" />
          <span className="text-sm">{land.location}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-3 text-center overflow-hidden">
            <p className="text-[10px] text-gray-500 mb-1">Plot Size</p>
            <p className="text-base font-bold text-gray-800 whitespace-nowrap">{land.size}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center overflow-hidden">
            <p className="text-[10px] text-gray-500 mb-1">Starting From</p>
            <p className="text-base font-bold text-amber-700 whitespace-nowrap">{land.price}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">{stripHtml(land.description)}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          <button onClick={() => setShowEnquire(true)} className="flex-1 bg-amber-600 text-white text-center py-3 rounded-xl font-bold hover:bg-amber-700 transition shadow-md">Enquire Now →</button>
          <Link href={`/estates/${land.slug}`} className="flex-1 border-2 border-green-700 text-green-700 text-center py-3 rounded-xl font-bold hover:bg-green-700 hover:text-white transition">Explore</Link>
        </div>
      </div>
    </div>
  );
}