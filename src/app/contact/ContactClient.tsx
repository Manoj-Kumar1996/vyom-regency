"use client";

import LeadForm from "@/components/LeadForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";

export default function ContactClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header />
      <section className="relative pt-32 pb-20 bg-gradient-to-r from-green-900 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">We'd Love to Hear From You</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mt-3 mb-4">
            Contact <span className="text-amber-400">Us</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/90">
            Have a question or want to book a site visit? Fill out the form below and we'll get back to you shortly.
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto mt-6 rounded-full"></div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <LeadForm />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <a
              href="tel:+918955311031"
              className="flex items-center gap-4 bg-white rounded-2xl shadow-sm hover:shadow-md p-5 border border-gray-100 transition group"
            >
              <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center shrink-0 transition">
                <Phone className="text-green-700" size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Call Us</p>
                <p className="font-bold text-gray-800">+91 89553 11031</p>
              </div>
            </a>

            <a
              href="https://wa.me/918955311031"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-2xl shadow-sm hover:shadow-md p-5 border border-gray-100 transition group"
            >
              <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center shrink-0 transition">
                <MessageCircle className="text-green-700" size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">WhatsApp</p>
                <p className="font-bold text-gray-800">Chat with our team</p>
              </div>
            </a>

            <a
              href="mailto:info@vyomregency.com"
              className="flex items-center gap-4 bg-white rounded-2xl shadow-sm hover:shadow-md p-5 border border-gray-100 transition group"
            >
              <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center shrink-0 transition">
                <Mail className="text-green-700" size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                <p className="font-bold text-gray-800">info@vyomregency.com</p>
              </div>
            </a>

            <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="text-amber-600" size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Office Address</p>
                <p className="font-bold text-gray-800">Khasra No. 30, Shyamaka, Khairthal, Rajasthan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-100 h-[28rem] md:h-[32rem]">
       <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2675.460419269514!2d76.6720993!3d27.7634262!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3972bb53b351fb3d%3A0x8a4d7c408be77208!2sVyom%20Regency%20Pvt.%20Ltd.!5e1!3m2!1sen!2sin!4v1783754650584!5m2!1sen!2sin"
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
              title="Vyom Regency Location"
            ></iframe>
        </div>
      </section>
      <Footer />
    </>
  );
}
