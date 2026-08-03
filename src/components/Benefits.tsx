"use client";
import { Leaf, Wind, Apple, Flower2, Users, Palmtree, TrendingUp, Activity, Mountain, Home } from "lucide-react";
export default function Benefits() {
  const benefits = [
    {
      id: 1,
      icon: <Leaf className="text-2xl" />,
      title: "Pollution-Free Lifestyle",
      description: "Escape the dust, noise, and traffic of the city—experience fresh, clean air every day. Breathe in nature's purity and protect your family's health.",
      color: "bg-green-50",
    },
    {
      id: 2,
      icon: <Wind className="text-2xl" />,
      title: "Weekend Retreat/Destination",
      description: "Clean air, natural surroundings, and space for exercise promote better physical and mental health.",
      color: "bg-green-100",
    },
    {
      id: 3,
      icon: <Apple className="text-2xl" />,
      title: "Financial Growth",
      description: "Agricultural land appreciates over time, offering strong long-term returns on investment.",
      color: "bg-amber-100",
    },
    {
      id: 4,
      icon: <Flower2 className="text-2xl" />,
      title: "Self-Sufficiency",
      description: "Grow your own vegetables, fruits, and herbs, reducing reliance on markets and ensuring food security.",
      color: "bg-green-200",
    },
    {
      id: 5,
      icon: <Users className="text-2xl" />,
      title: "Community & Social",
      description: "Connect with like-minded families, enjoy shared events, and build lasting relationships in a supportive environment.",
      color: "bg-amber-100",
    },
    {
      id: 6,
      icon: <Palmtree className="text-2xl" />,
      title: "Educational Opportunities",
      description: "Provide children with hands-on learning about nature, agriculture, and sustainable living.",
      color: "bg-green-300",
    },
    {
      id: 7,
      icon: <TrendingUp className="text-2xl" />,
      title: "Tax Benefits",
      description: "Owning agricultural land qualifies for favorable tax treatments and incentives.",
      color: "bg-yellow-100",
    },
    {
      id: 8,
      icon: <Mountain className="text-2xl" />,
      title: "Recreational Space",
      description: "Enjoy ample space for outdoor activities, nature walks, and wildlife observation.",
      color: "bg-yellow-200",
    },
    {
      id: 9,
      icon: <Activity className="text-2xl" />,
      title: "Eco-Friendly Living",
      description: "Practice sustainable farming methods and reduce your carbon footprint.",
      color: "bg-green-400",
    },
    {
      id: 10,
      icon: <Home className="text-2xl" />,
      title: "Complete Freedom",
      description: "Your land, your rules—design, develop, and enjoy your farmhouse the way you love. No society restrictions, no limitations.",
      color: "bg-amber-50",
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-gradient-to-br from-white to-green-50">
      <div className="container mx-auto px-4 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            Why Choose Farmhouse Living
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            10 Benefits of <span className="text-green-700">Farmhouse Life</span>
          </h2>
          <p className="text-lg text-gray-600">Discover why hundreds of families are choosing Vyom Regency for their dream farmhouse</p>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit) => (
            <div key={benefit.id} className={`${benefit.color} p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 border border-gray-100`}>
              <div className="flex items-start gap-5">
                {/* Icon */}
                <div className="bg-white p-3 rounded-xl shadow-md group-hover:bg-green-600 transition-colors duration-300 text-green-700 group-hover:text-white">
                  {benefit.icon}
                </div>
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {benefit.id.toString().padStart(2, '0')}. {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}