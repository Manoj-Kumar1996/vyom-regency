"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Link from "next/link";

interface GalleryImage {
  url: string;
  name: string;
  type: "photo" | "video";
}

export default function HomeGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("gallery")
        .list("gallery/");

      if (error) throw error;

      const photoList: GalleryImage[] = (data || [])
        .filter((item) => item.name !== ".emptyFolderPlaceholder")
        .map((item) => ({
          name: item.name,
          type: "photo" as const,
          url: supabase.storage
            .from("gallery")
            .getPublicUrl(`gallery/${item.name}`).data.publicUrl,
        }));

      const { data: videoRows } = await supabase
        .from("gallery")
        .select("*")
        .eq("media_type", "video")
        .order("created_at", { ascending: false });

      const videoList: GalleryImage[] = (videoRows || []).map((row) => ({
        name: `video-${row.id}`,
        type: "video" as const,
        url: row.url,
      }));

      setImages([...videoList, ...photoList]);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentIndex]);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) return null;

  const displayImages = images.slice(0, 8);

  return (
    <>
      <section id="gallery" className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
              Our Gallery
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mt-2 mb-3">
              Glimpses of <span className="text-amber-600">Project</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Real images from our farmhouse projects — experience the beauty of nature
            </p>
            <div className="w-20 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayImages.map((image, index) => (
              <div
                key={image.name}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
              >
                {image.type === "video" ? (
                  <iframe src={image.url} className="w-full h-full pointer-events-none" title="Gallery video" />
                ) : (
                  <img
                    src={image.url}
                    alt={`Farmhouse gallery ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                    <Maximize2 className="text-white" size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {images.length > 8 && (
            <div className="text-center mt-10">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-white border-2 border-green-700 text-green-700 px-8 py-2.5 rounded-full font-bold hover:bg-green-700 hover:text-white transition duration-300 shadow-lg text-sm"
              >
                View Full Gallery
                <ChevronRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-amber-400 transition z-10 bg-white/10 p-2 rounded-full backdrop-blur-sm"
          >
            <X size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 md:left-8 text-white hover:text-amber-400 transition bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm"
          >
            <ChevronLeft size={40} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 md:right-8 text-white hover:text-amber-400 transition bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm"
          >
            <ChevronRight size={40} />
          </button>

          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            {selectedImage.type === "video" ? (
              <div className="w-full aspect-video max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <iframe src={selectedImage.url} className="w-full h-full rounded-lg shadow-2xl" title="Gallery video" allowFullScreen />
              </div>
            ) : (
              <img
                src={selectedImage.url}
                alt="Gallery full view"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md mb-4">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}