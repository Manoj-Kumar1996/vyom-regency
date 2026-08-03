"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FALLBACK_SLIDES = [
  {
    label: "Sunrise",
    url: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    label: "Luxury Farmhouse",
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    label: "Kids Playing",
    url: "https://images.unsplash.com/photo-1476234251651-f353703a034d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    label: "Bonfire",
    url: "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    label: "Organic Farming",
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    label: "Aravali Views",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    label: "Walking Trail",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
];

interface Slide {
  label: string;
  url: string;
}

const SLIDE_DURATION_MS = 5000;

export default function Hero({
  initialSlides,
  initialContent,
}: {
  initialSlides?: Slide[];
  initialContent?: Record<string, string>;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(initialSlides || FALLBACK_SLIDES);
  const [content, setContent] = useState<Record<string, string>>(initialContent || {});

  useEffect(() => {
    const fetchData = async () => {
      const [slidesRes, contentRes] = await Promise.all([
        supabase.from("hero_slides").select("*").order("sort_order", { ascending: true }),
        supabase.from("site_content").select("*").eq("page", "home"),
      ]);

      if (slidesRes.data && slidesRes.data.length > 0) {
        setSlides(slidesRes.data.map((s) => ({ label: s.label || `slide-${s.id}`, url: s.image_url })));
        setActiveSlide(0);
      }

      if (contentRes.data) {
        const map: Record<string, string> = {};
        contentRes.data.forEach((item: { section: string; content: string }) => {
          map[item.section] = item.content;
        });
        setContent(map);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center pt-20 pb-24 md:pt-24 md:pb-28 lg:pt-24 lg:pb-24">
      {/* Image slider layer — rotates automatically, independent of the text layer below */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.label}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.6)), url('${slide.url}')`,
              opacity: i === activeSlide ? 1 : 0,
            }}
            aria-hidden={i !== activeSlide}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-4 md:px-8">
        <button
          type="button"
          onClick={prevSlide}
          className="pointer-events-auto rounded-full bg-black/40 text-white p-2.5 sm:p-3 shadow-lg transition hover:bg-black/60"
          aria-label="Previous slide"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="pointer-events-auto rounded-full bg-black/40 text-white p-2.5 sm:p-3 shadow-lg transition hover:bg-black/60"
          aria-label="Next slide"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Text + CTA layer — stays fixed on screen, unaffected by the slider */}
      <div className="container mx-auto px-4 text-center text-white max-w-4xl z-10 relative">
        {/* Urgency Badge */}
        {Boolean(content.urgency_badge && content.urgency_badge.trim()) && (
          <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 md:mb-3 animate-pulse">
            {content.urgency_badge.trim()}
          </div>
        )}

        {(Boolean(content.hero_title && content.hero_title.trim()) ||
          Boolean(content.hero_title_highlight && content.hero_title_highlight.trim())) && (
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-2 md:mb-3">
            {content.hero_title || ""}
            {content.hero_title_highlight && content.hero_title_highlight.trim() && (
              <span className="text-amber-400"> {content.hero_title_highlight.trim()}</span>
            )}
          </h1>
        )}

        {Boolean(content.hero_subtitle && content.hero_subtitle.trim()) && (
          <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl font-semibold leading-snug mb-2 md:mb-3 text-white/90">
            {content.hero_subtitle.trim()}
          </h2>
        )}

        {Boolean(content.hero_description && content.hero_description.trim()) && (
          <p className="text-xs sm:text-sm md:text-base mb-3 md:mb-4 max-w-xl mx-auto text-white/80">
            {content.hero_description.trim()}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="flex items-start gap-2.5 sm:gap-3 justify-center flex-wrap">
          <div className="flex flex-col items-center">
            <Link
              href="#lead-form"
              className="bg-amber-500 text-gray-900 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-white transition inline-flex items-center gap-1.5 shadow-md"
            >
              Schedule Site Visit
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <Link
              href="tel:+918955311031"
              className="bg-amber-500 text-gray-900 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-white transition inline-flex items-center gap-1.5 shadow-md"
            >
              Call Now
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center flex-wrap gap-1.5 sm:gap-2 mt-4 md:mt-6 max-w-3xl mx-auto">
          {[
            content.pill_1,
            content.pill_2,
            content.pill_3,
            content.pill_4,
            content.pill_5,
            content.pill_6,
            content.pill_7,
            content.pill_8,
            content.pill_9,
            content.pill_10,
          ]
            .filter((text): text is string => Boolean(text && text.trim()))
            .map((text, i) => {
              const cleanText = text.replace(/\p{Extended_Pictographic}/gu, "").trim();
              if (!cleanText) return null;
              return (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10"
                >
                  <span className="text-xs font-medium">{cleanText}</span>
                </div>
              );
            })}
        </div>

        {/* Price / Area Indicator */}
        {(Boolean(content.area_starts_prefix && content.area_starts_prefix.trim()) ||
          Boolean(content.area_starts_value && content.area_starts_value.trim())) && (
          <div className="mt-3 md:mt-4 bg-white/10 backdrop-blur-sm inline-block px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border border-white/10">
            <p className="text-xs sm:text-sm">
              {content.area_starts_prefix && content.area_starts_prefix.trim() ? `${content.area_starts_prefix.trim()} ` : ""}
              {content.area_starts_value && content.area_starts_value.trim() && (
                <span className="text-amber-300 font-bold text-sm sm:text-base md:text-lg">
                  {content.area_starts_value.trim()}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
