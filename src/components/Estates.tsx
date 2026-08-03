"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Link from "next/link";
import { MapPin, CheckCircle, Clock, Ban, Crown } from "lucide-react";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

interface Property {
  id: string;
  name: string;
  slug: string;
  location: string;
  price: string;
  size: string;
  status: string;
  description: string;
  features: string[];
  image_url: string;
  created_at: string;
}

export default function EstatesPage() {
  const [individualLands, setIndividualLands] = useState<Property[]>([]);
  const [farmhouseProjects, setFarmhouseProjects] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    
    // Separate individual lands from farmhouse projects
    const individual = data?.filter(p => 
      p.name.toLowerCase().includes("individual") || 
      p.name.toLowerCase().includes("premium farm land")
    ) || [];
    
    const projects = data?.filter(p => 
      !p.name.toLowerCase().includes("individual") && 
      !p.name.toLowerCase().includes("premium farm land")
    ) || [];
    
    setIndividualLands(individual);
    setFarmhouseProjects(projects);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle size={12} /> Available</span>;
      case "limited":
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Clock size={12} /> Limited</span>;
      case "sold":
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Ban size={12} /> Sold Out</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  const filteredProjects = farmhouseProjects.filter(prop => {
    if (filter === "all") return true;
    return prop.status === filter;
  });

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading estates...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-r from-green-900 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-amber-400">Estates</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover premium farmhouse projects and individual farm lands in Rajasthan
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto mt-6 rounded-full"></div>
        </div>
      </section>

      {/* ========== INDIVIDUAL FARM LANDS SECTION ========== */}
      {individualLands.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-amber-50 to-green-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4 shadow-lg">
                <Crown className="w-4 h-4" /> Premium Offering
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Individual <span className="text-amber-600">Farm Lands</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose your own piece of paradise — complete freedom to design your dream farmhouse
              </p>
              <div className="w-20 h-1 bg-amber-500 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {individualLands.map((land) => (
                <div key={land.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={land.image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1152&q=80"} 
                      alt={land.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(land.status)}
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold">Individual Plot</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{land.name}</h3>
                    <div className="location-hide flex items-center gap-1 text-gray-500 text-xs mb-3">
                      <MapPin size={12} />
                      <span>{land.location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-green-50 p-2 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Size</p>
                        <p className="font-bold text-gray-800 text-xs">{land.size}</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-bold text-gray-800 text-xs">{land.price}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">{stripHtml(land.description)}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {land.features?.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{feature}</span>
                      ))}
                    </div>
                    {land.status !== "sold" ? (
                      <Link href="/#lead-form" className="block w-full bg-amber-600 text-white text-center py-2 rounded-lg font-semibold text-sm hover:bg-amber-700 transition">
                        Enquire Now →
                      </Link>
                    ) : (
                      <button disabled className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg font-semibold text-sm cursor-not-allowed">Sold Out</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== FARMHOUSE PROJECTS SECTION ========== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Farmhouse <span className="text-green-700">Projects</span>
            </h2>
            <p className="text-gray-600">Premium farmhouse communities with world-class amenities</p>
          </div>

          {/* Filter Section */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === "all" ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>All Projects</button>
            <button onClick={() => setFilter("available")} className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === "available" ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>Available</button>
            <button onClick={() => setFilter("limited")} className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === "limited" ? "bg-red-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>Limited Stock</button>
            <button onClick={() => setFilter("sold")} className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === "sold" ? "bg-gray-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>Sold Out</button>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((property) => (
                <div key={property.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={property.image_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"} 
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 right-4">{getStatusBadge(property.status)}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{property.name}</h3>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-green-50 p-2 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Size</p>
                        <p className="font-bold text-gray-800 text-xs">{property.size}</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-bold text-gray-800 text-xs">{property.price}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {property.features?.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{feature}</span>
                      ))}
                    </div>
                    {property.status !== "sold" ? (
                      <Link href="/#lead-form" className="block w-full bg-green-700 text-white text-center py-2 rounded-lg font-semibold text-sm hover:bg-green-800 transition">
                        {property.status === "limited" ? "🔴 Book Now →" : "Enquire Now →"}
                      </Link>
                    ) : (
                      <button disabled className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg font-semibold text-sm cursor-not-allowed">Sold Out</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}