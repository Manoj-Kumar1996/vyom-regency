"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Founder from "@/components/Founder";
import Stats from "@/components/Stats";
import VisionMission from "@/components/VisionMission";

// ⚠️ IMPORTANT: Adjust this import path to match your project's Supabase client file
import { supabase } from "@/lib/supabase"; 

export default function AboutClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    fetchAboutFaqs();
  }, []);

  const fetchAboutFaqs = async () => {
    try {
      setLoadingFaqs(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('id, question, answer')
        .eq('is_active', true)          // Only get active FAQs
        .eq('page_route', 'about')      // Only get FAQs assigned to the about page
        .order('sort_order', { ascending: true }); // Keep them in the order you set

      if (error) throw error;
      if (data) setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoadingFaqs(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-10 bg-gradient-to-r from-green-900 to-green-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.2)"></circle>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern)"></rect>
            </svg>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-block bg-amber-500 text-green-900 px-4 py-1 rounded-full text-sm font-bold mb-4 animate-pulse">
              Established 2017
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              About <span className="text-amber-400">Vyom Regency</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Vyom Regency Pvt Ltd
            </p>
            <div className="w-24 h-1 bg-amber-400 mx-auto mt-6 rounded-full"></div>
          </div>
        </section>

        {/* Company Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Our Journey</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mt-2 mb-4">
                The <span className="text-green-700">Vyom Regency</span> Story
              </h2>
              <div className="w-20 h-1 bg-green-700 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  <strong className="text-green-700">Vyom Regency Pvt Ltd</strong> was established in <strong>2017</strong> with a simple yet powerful vision — to help people find their perfect agricultural land for farmhouse living with complete transparency and zero hassle.
                </p>
                <p>
                  Founded by <strong className="text-green-700">Mr. Sobaran Singh</strong>, with decades of experience in real estate and land development, our company has grown from a small startup to a trusted name across <strong>Uttar Pradesh, Uttarakhand, and Rajasthan</strong>.
                </p>
                <p>
                  What started as a mission to help buyers find agricultural land with negligible brokerage has now transformed into a full-fledged real estate enterprise. We have successfully delivered <strong>50+ land parcels</strong> and have <strong>3 premium projects</strong> in Rajasthan.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full border-4 border-green-200 rounded-2xl"></div>
                <div className="relative bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 text-white shadow-2xl">
                  <div className="text-5xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold mb-2">Our Commitment</h3>
                  <p className="text-green-100 mb-4">Integrity, transparency, and timely delivery — these are not just words, they are our promise.</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="bg-white/20 px-3 py-1 rounded-full">100% Transparent</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">Zero Brokerage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Our Foundation</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mt-2 mb-4">
                Core <span className="text-green-700">Values</span>
              </h2>
              <div className="w-20 h-1 bg-green-700 mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { title: "Integrity First", desc: "Complete transparency in every transaction. No hidden costs, no surprise fees.", icon: "🛡️" },
                { title: "On-Time Delivery", desc: "Projects delivered as promised. We respect your time and investment.", icon: "⏰" },
                { title: "Customer First", desc: "Your dream is our mission. We work tirelessly to exceed expectations.", icon: "🤝" }
              ].map((val, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-md text-center hover:-translate-y-1 transition duration-300">
                  <div className="text-4xl mb-4">{val.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{val.title}</h3>
                  <p className="text-gray-600 text-sm">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Founder />
        <Stats />
        <VisionMission />

        {/* Database-Driven FAQ Section */}
        {(faqs.length > 0 || loadingFaqs) && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-12">
                <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mt-2 mb-4">
                  Frequently Asked <span className="text-green-700">Questions</span>
                </h2>
                <div className="w-20 h-1 bg-green-700 mx-auto mt-4 rounded-full"></div>
              </div>

              {loadingFaqs ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map((skeleton) => (
                    <div key={skeleton} className="bg-white h-16 rounded-xl shadow-sm border border-gray-100"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                      <div
                        key={faq.id || index}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleFAQ(index)}
                          className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-800 hover:text-green-700 transition-colors focus:outline-none"
                        >
                          <span className="text-base md:text-lg pr-4">{faq.question}</span>
                          <svg
                            className={`w-5 h-5 text-green-700 transform transition-transform duration-300 flex-shrink-0 ${
                              isOpen ? "rotate-180" : "rotate-0"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          } overflow-hidden`}
                        >
                          <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 text-sm md:text-base whitespace-pre-line">
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-900 to-green-800 text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Farmhouse Journey?</h2>
            <p className="mb-6 opacity-90">Join hundreds of happy families who chose Vyom Regency for their dream farmhouse</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/#lead-form" className="bg-amber-500 text-green-900 px-8 py-3 rounded-lg font-bold hover:bg-amber-400 transition shadow-lg">
                Book Site Visit Today →
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-green-900 transition">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
