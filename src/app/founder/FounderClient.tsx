"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyBottomBar from "@/components/StickyBottomBar";
import ExitPopup from "@/components/ExitPopup";

export default function FounderClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative pt-24 pb-10 bg-gradient-to-r from-green-900 to-green-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block bg-amber-500 text-green-900 px-4 py-1 rounded-full text-sm font-bold mb-4">
              Founder & Managing Director
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Mr. Sobaran <span className="text-amber-400">Singh</span>
            </h1>
            <p className="text-lg text-amber-200">Founder, Vyom Regency Pvt Ltd | Est. 2017</p>
            <div className="w-24 h-1 bg-amber-400 mx-auto mt-6 rounded-full"></div>
          </div>
        </section>

        {/* Founder Profile Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full border-4 border-green-200 rounded-2xl"></div>
                <div
                  className="relative h-96 md:h-[500px] rounded-2xl bg-cover bg-center shadow-2xl"
                  style={{
                    backgroundImage: "url('/Founder-img.jpg')"
                  }}
                ></div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                  <span className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    <i className="fas fa-shield-alt mr-2"></i>Ex-NSG
                  </span>
                  <span className="bg-amber-500 text-green-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    <i className="fas fa-trophy mr-2"></i>Since 2017
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <span className="text-green-700 font-semibold text-sm uppercase tracking-wide">Who is He?</span>
                  <h2 className="text-3xl font-bold text-gray-800 mt-2">A Man of Discipline & Integrity</h2>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  <strong className="text-green-700">Mr. Sobaran Singh</strong> is not your typical real estate entrepreneur.
                  Before entering the world of land development, he served as a <strong className="text-green-700">Commando in India's elite National Security Guard (NSG)</strong> —
                  the country's premier special forces unit.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  The discipline, integrity, and commitment to excellence that he cultivated during his service years
                  now form the bedrock of <strong className="text-green-700">Vyom Regency Pvt Ltd</strong>.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-700 my-6">
                  <p className="text-gray-600 italic">
                    <i className="fas fa-quote-left text-green-700 mr-2"></i>
                    "Having served the nation with honor, I now serve families who dream of owning their own piece of nature."
                  </p>
                  <p className="text-right text-green-700 font-semibold mt-2">— Mr. Sobaran Singh</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Timeline Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">The <span className="text-green-700">Journey</span></h2>
              <div className="w-20 h-1 bg-green-700 mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="max-w-4xl mx-auto relative">
              <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-green-200"></div>
              {[
                { year: "2005", title: "Started Real Estate Journey", desc: "After completing his service with honor, entered the real estate sector." },
                { year: "2012", title: "Expanded to Multiple States", desc: "Successfully delivered projects across UP and Uttarakhand." },
                { year: "2017", title: "Founded Vyom Regency Pvt Ltd", desc: "Established to provide agriculture land with negligible brokerage." },
                { year: "2024", title: "Present Day", desc: "Leading premium projects in Rajasthan with 50+ successful deliveries." }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-6 mb-12">
                  <div className="md:w-1/4">
                    <div className="relative z-10 bg-green-700 text-white w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">{item.year}</div>
                  </div>
                  <div className="md:w-3/4 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-green-700 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NSG Service Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <i className="fas fa-medal text-5xl text-green-700"></i>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Service to the Nation</h2>
                  <p className="text-green-700 font-semibold">National Security Guard (NSG) Commando</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Served as a Commando in India's elite special forces unit, the "Black Cats."
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <span className="bg-green-700 text-white px-4 py-2 rounded-full text-sm">Counter-Terrorism</span>
                <span className="bg-green-700 text-white px-4 py-2 rounded-full text-sm">Hostage Rescue</span>
                <span className="bg-green-700 text-white px-4 py-2 rounded-full text-sm">VIP Security</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Meet the Founder in Person</h2>
            <p className="mb-6">Book a site visit and meet Mr. Sobaran Singh personally</p>
            <Link href="/#lead-form" className="bg-amber-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition inline-block">
              Book Site Visit Today →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyBottomBar />
      <ExitPopup />
    </>
  );
}