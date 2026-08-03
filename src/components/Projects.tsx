"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, Ban, LayoutGrid, List } from "lucide-react";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { getPropertiesByType, type Property } from "@/lib/properties";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export default function Projects() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchHomeProperties();
  }, []);

  const fetchHomeProperties = async () => {
    const homeData = await getPropertiesByType("project", { homeOnly: true, order: "sort_order" });
    if (homeData.length > 0) {
      setProperties(homeData);
    } else {
      setProperties(await getPropertiesByType("project", { order: "sort_order" }));
    }
    setLoading(false);
  };

  if (!isMounted) return null;

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse text-gray-500">Loading projects...</div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) return null;

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-left">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Our Premium Estates</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Exclusive <span className="text-green-700">Farmhouse Projects</span>
            </h2>
            <div className="w-24 h-1 bg-green-600 mt-4 rounded-full"></div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition flex items-center gap-2 text-sm font-bold ${viewMode === "grid" ? "bg-green-700 text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={18} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition flex items-center gap-2 text-sm font-bold ${viewMode === "list" ? "bg-green-700 text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={18} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto" : "max-w-5xl mx-auto space-y-6"}>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} viewMode={viewMode} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/estates" className="inline-block border-2 border-green-700 text-green-700 px-8 py-3 rounded-full font-bold hover:bg-green-700 hover:text-white transition shadow-lg">
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ property, viewMode }: { property: Property; viewMode: "grid" | "list" }) {
  const [showEnquire, setShowEnquire] = useState(false);

  const statusBadge = (status: string) => {
    switch (status) {
      case "available": return <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">Available</span>;
      case "limited": return <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">Limited Edition</span>;
      default: return <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">Sold Out</span>;
    }
  };

  const enquireModal = (
    <LeadCaptureModal
      isOpen={showEnquire}
      onClose={() => setShowEnquire(false)}
      title="Enquire Now"
      subtitle="Share your details and our team will call you shortly."
      propertyName={property.name}
      source="property_enquiry"
      submitLabel="Send Enquiry →"
    />
  );

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100 flex flex-col md:flex-row group">
        {enquireModal}
        <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
          <img
            src={property.image_url || ""}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute top-4 left-4">{statusBadge(property.status)}</div>
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-green-700 transition">{property.name}</h3>
              <span className="text-green-700 font-bold text-xl">{property.price}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <span>Size: <strong>{property.size}</strong></span>
            </div>
            <p className="text-gray-600 text-sm mb-6 line-clamp-2">{stripHtml(property.description)}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowEnquire(true)} className="flex-1 bg-green-700 text-white text-center py-3 rounded-xl font-bold text-sm hover:bg-green-800 transition shadow-md">
              Enquire Now
            </button>
            <Link href={`/estates/${property.slug}`} className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition">Explore</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
      {enquireModal}
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.image_url || ""}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute top-4 left-4">{statusBadge(property.status)}</div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-bold text-gray-800 mb-3 group-hover:text-green-700 transition">{property.name}</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 p-2 rounded-lg text-center">
            <p className="text-xs text-gray-500">Area</p>
            <p className="font-bold text-gray-800 text-sm">{property.size}</p>
          </div>
          <div className="bg-amber-50 p-2 rounded-lg text-center">
            <p className="text-xs text-gray-500">Price</p>
            <p className="font-bold text-gray-800 text-sm">{property.price}</p>
          </div>
        </div>
        <p className="text-gray-600 text-xs mb-4 line-clamp-2 flex-grow">{stripHtml(property.description)}</p>
        {property.status !== "sold" ? (
          <div className="flex gap-2 mt-auto">
            <button onClick={() => setShowEnquire(true)} className="flex-1 bg-green-700 text-white py-2.5 rounded-xl font-bold text-center text-sm hover:bg-green-800 transition-all">
              Enquire Now
            </button>
            <Link href={`/estates/${property.slug}`} className="flex-1 text-center border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
              Explore
            </Link>
          </div>
        ) : (
          <div className="flex gap-2 mt-auto">
            <button disabled className="flex-1 bg-gray-300 text-gray-500 py-2.5 rounded-xl font-bold text-sm cursor-not-allowed">Sold Out</button>
            <Link href={`/estates/${property.slug}`} className="flex-1 text-center border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
              Explore
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
