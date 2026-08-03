"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GalleryItem {
  id: string;
  url: string;
  caption: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!error) setImages(data || []);
      setLoading(false);
    };
    fetchGallery();
  }, []);

  if (loading) return <div className="py-20 text-center">Loading Gallery...</div>;
  if (images.length === 0) return null;

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Visual Tour</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mt-2 mb-4">
            Our <span className="text-amber-600">Gallery</span>
          </h2>
          <div className="w-20 h-1 bg-green-600 mx-auto mt-5 rounded-full"></div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((item) => (
            <div key={item.id} className="break-inside-avoid rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
              <img 
                src={item.url} 
                alt={item.caption} 
                className="w-full h-auto group-hover:scale-105 transition duration-500"
              />
              {item.caption && (
                <div className="p-4 bg-white">
                  <p className="text-gray-700 font-medium">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}