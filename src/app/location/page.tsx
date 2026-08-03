"use client";

import Link from "next/link";
import { MapPin, Compass, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LocationPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const locations = [
    {
      id: "kishangarh-bas",
      name: "Kishangarh Bas",
      region: "Khairthal–Tijara District",
      distance: "2 hours from Delhi NCR",
      features: ["Main project location", "Peaceful countryside", "Clear titles"],
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
    },
    {
      id: "khairthal",
      name: "Khairthal",
      region: "Alwar District",
      distance: "2.5 hours from Delhi NCR",
      features: ["Vyom Green Valley", "Scenic views", "Growing corridor"],
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1152&q=80",
    },
    {
      id: "alwar",
      name: "Alwar",
      region: "Alwar District",
      distance: "25 km from Kishangarh Bas",
      features: ["City Palace", "Sariska Tiger Reserve", "Urban amenities"],
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80",
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 bg-gradient-to-r from-green-900 to-green-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-amber-400">Location</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Strategically located in Kishangarh Bas, Khairthal–Tijara District, Rajasthan
            </p>
            <div className="w-24 h-1 bg-amber-400 mx-auto mt-6 rounded-full"></div>
          </div>
        </section>

        {/* Main Location Details */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  Prime Location
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Kishangarh Bas</h2>
                <p className="text-gray-600 mb-4">
                  Our flagship projects — Vyom Green Paradise and Vyom Chhatarpur Farms — are located in the serene village of Kishangarh Bas, falling under the Khairthal–Tijara district of Rajasthan.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Navigation className="w-5 h-5 text-green-600" />
                    <span><strong>2 hours</strong> from Delhi NCR</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Compass className="w-5 h-5 text-green-600" />
                    <span><strong>25 km</strong> from Alwar city</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <span>Well‑connected via State Highway</span>
                  </div>
                </div>
                <Link href="/#lead-form" className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
                  Book Site Visit →
                </Link>
              </div>
              <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-xl h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28032.77007992005!2d76.57804515684209!3d27.886629270054527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3972a2c1618a72a9%3A0xc6bc4a9e3212e76!2sKishangarh%20Bas%2C%20Rajasthan%20301404!5e0!3m2!1sen!2sin!4v1683115640533!5m2!1sen!2sin"
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                  title="Kishangarh Bas Location"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Project Locations Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Our Project <span className="text-green-700">Locations</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {locations.map((loc) => (
                <div key={loc.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition hover:-translate-y-1">
                  <img src={loc.image} alt={loc.name} className="w-full h-48 object-cover" />
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-green-700 mb-1">{loc.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{loc.region}</p>
                    <p className="text-sm text-gray-600 mb-3">{loc.distance}</p>
                    <div className="flex flex-wrap gap-2">
                      {loc.features.map((feature, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{feature}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}