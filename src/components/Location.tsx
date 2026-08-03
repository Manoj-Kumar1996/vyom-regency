"use client";

import { MapPin, ExternalLink } from "lucide-react";

export default function Location() {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.444444444444!2d76.8333333!3d27.8166667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQ5JzAwLjAiTiA3NsKwNTAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin";
  const googleMapsLink = "https://maps.app.goo.gl/W8htMKZXag9c62zT7?g_st=awb";

  return (
    <section id="location" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our <span className="text-green-700">Location</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
            <MapPin className="text-green-700" size={20} />
            <p className="text-lg">Khairthal, Alwar, Rajasthan</p>
          </div>
          <p className="text-gray-500">
            Experience the perfect blend of nature and connectivity. Our estates are located in a serene, 
            pollution-free environment, just a comfortable drive away from major NCR hubs.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative w-full h-[450px] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3531.844444444444!2d76.8333333!3d27.8166667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjfCsDQ5JzAwLjAiTiA3NsKwNTAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vyom Regency Location"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
            
            {/* Overlay Button for Mobile/Desktop */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-green-800 px-6 py-3 rounded-full font-bold shadow-xl hover:bg-green-700 hover:text-white transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <ExternalLink size={18} />
                Open in Google Maps
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-2">Connectivity</h4>
              <p className="text-sm text-gray-600">Well-connected via Delhi-Mumbai Expressway and Alwar Highway.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-2">Environment</h4>
              <p className="text-sm text-gray-600">Lush green surroundings with zero industrial pollution.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-2">Development</h4>
              <p className="text-sm text-gray-600">Rapidly developing area with high appreciation potential.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}