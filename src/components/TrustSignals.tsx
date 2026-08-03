"use client";

import Link from "next/link";
import { Handshake } from "lucide-react";

export default function TrustSignals() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Why <span className="text-green-700">Trust Vyom Regency?</span>
        </h2>
        <p className="text-center text-gray-600 mb-12">100% transparent since 2017</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Badge 1 */}
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="h-12 flex items-center justify-center mb-3">
              <span className="text-5xl leading-none">🏆</span>
            </div>
            <h3 className="font-bold text-xl mb-2">50+ Families Served</h3>
            <p className="text-gray-600 text-sm">Successfully delivered land parcels</p>
          </div>
          {/* Badge 2 */}
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="h-12 flex items-center justify-center mb-3">
              <span className="text-5xl leading-none">📝</span>
            </div>
            <h3 className="font-bold text-xl mb-2">Registry Ready</h3>
            <p className="text-gray-600 text-sm">Clear title with complete documentation</p>
          </div>

          {/* Badge 3 */}
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="h-12 flex items-center justify-center mb-3">
              <span className="text-5xl leading-none">⭐</span>
            </div>
            <h3 className="font-bold text-xl mb-2">100% Satisfaction</h3>
            <p className="text-gray-600 text-sm">No hidden charges, no brokerage</p>
          </div>
          {/* Badge 4 */}
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="h-12 flex items-center justify-center mb-3">
              <Handshake className="h-12 w-12 text-green-600" strokeWidth={1.75} />
            </div>
            <h3 className="font-bold text-xl mb-2">Delivered</h3>
            <p className="text-gray-600 text-sm">3 Projects & 50+ Land Pieces</p>
          </div>
        </div>

        {/* Google Map */}
        <div className="mt-16">
          <div className="text-center mb-6">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Find Us</span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mt-2">
              📍 Our <span className="text-green-700">Location</span>
            </h3>
            <div className="w-20 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 h-[28rem] md:h-[32rem]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2675.460419269514!2d76.6720993!3d27.7634262!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3972bb53b351fb3d%3A0x8a4d7c408be77208!2sVyom%20Regency%20Pvt.%20Ltd.!5e1!3m2!1sen!2sin!4v1783754650584!5m2!1sen!2sin"
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
              title="Vyom Regency Location"
            ></iframe>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Vyom Regency Pvt. Ltd.
            Khasra No. 30, Shyamaka, Khairthal, Rajasthan 301404
          </p>
        </div>
      </div>
    </section>
  );
}