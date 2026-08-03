"use client";

import Link from "next/link";

export default function InvestorSection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Why Invest in <span className="text-amber-400">Khairthal Kishangarh Bas, Alwar?</span>
        </h2>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          One of the fastest-growing real estate corridors in Rajasthan
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="bg-white/10 p-6 rounded-xl text-center backdrop-blur-sm">
            <div className="text-4xl mb-3">🛣️</div>
            <h3 className="font-bold text-lg mb-2">Delhi-Mumbai Expressway</h3>
            <p className="text-gray-300 text-sm">Proximity to upcoming expressway boosts connectivity</p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl text-center backdrop-blur-sm">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="font-bold text-lg mb-2">30-40% Appreciation</h3>
            <p className="text-gray-300 text-sm">Expected in next 3-5 years in this corridor</p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl text-center backdrop-blur-sm">
            <div className="text-4xl mb-3">🏘️</div>
            <h3 className="font-bold text-lg mb-2">Weekend Farmhouse Demand</h3>
            <p className="text-gray-300 text-sm">Increasing trend among Delhi NCR families</p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl text-center backdrop-blur-sm">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-bold text-lg mb-2">Rental Income Potential</h3>
            <p className="text-gray-300 text-sm">Farmhouses can generate ₹30k-50k/month</p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="#lead-form" className="inline-block bg-amber-500 text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-amber-400 transition">
            Invest Now — Only Limited Plots Left →
          </Link>
        </div>
      </div>
    </section>
  );
}