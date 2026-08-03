"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, ChevronLeft, ChevronRight, ArrowLeft, Maximize2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface GalleryImage {
  url: string;
  name: string;
  type: "photo" | "video";
  alt: string;
}

export default function GalleryClient() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data: rows, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const videoList: GalleryImage[] = [];
      const photoList: GalleryImage[] = [];

      for (const row of rows || []) {
        const item: GalleryImage = {
          name: row.media_type === "video" ? `video-${row.id}` : `photo-${row.id}`,
          type: row.media_type === "video" ? "video" : "photo",
          url: row.url,
          alt: row.alt_text || row.caption || row.title || "Vyom Regency gallery image",
        };
        (item.type === "video" ? videoList : photoList).push(item);
      }

      // Fall back to listing the storage bucket directly for any photos uploaded before the
      // gallery table started tracking every upload (legacy uploads bypassed the table insert).
      if (photoList.length === 0) {
        const { data: storageData } = await supabase.storage.from("gallery").list("gallery/");
        for (const item of storageData || []) {
          if (item.name === ".emptyFolderPlaceholder") continue;
          photoList.push({
            name: item.name,
            type: "photo",
            url: supabase.storage.from("gallery").getPublicUrl(`gallery/${item.name}`).data.publicUrl,
            alt: "Vyom Regency gallery image",
          });
        }
      }

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

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Header />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading our beautiful gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-r from-green-900 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition mb-6 font-semibold"
          >
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-amber-400">Gallery</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Real images from our premium farmhouse projects in Rajasthan
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto mt-6 rounded-full"></div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {images.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Images Yet</h3>
              <p className="text-gray-500 mb-6">We are currently updating our gallery with new project photos.</p>
              <Link href="/" className="bg-green-700 text-white px-8 py-3 rounded-full font-bold hover:bg-green-800 transition">
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image, index) => (
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
                      alt={image.alt}
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
          )}
        </div>
      </section>

      {/* Lightbox */}
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
                alt={selectedImage.alt}
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
      <Footer />
    </div>
  );
}