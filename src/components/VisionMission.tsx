"use client";

export default function VisionMission() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
          <p className="text-lg">
            To be the leading provider of premium agriculture land that blends
            luxury living with sustainable farming practices.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Deliver world‑class amenities.</li>
            <li>Ensure transparent and secure transactions.</li>
            <li>Promote eco‑friendly farming solutions.</li>
            <li>Build thriving communities.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}