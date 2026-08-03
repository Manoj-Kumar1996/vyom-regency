export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
}

export const blogs: BlogPost[] = [
  {
    id: 1,
    title: "10 Reasons Why Farmhouse Living is the Future of Real Estate",
    slug: "farmhouse-living-future-of-real-estate",
    excerpt:
      "Discover why more people are leaving city apartments for farmhouse living. From health benefits to investment returns, here are 10 compelling reasons.",
    content: `
      <p>The way we think about living spaces is changing. After the pandemic, more people than ever are realizing the value of open spaces, fresh air, and connection with nature. Farmhouse living is no longer just a luxury—it's becoming a necessity for health‑conscious families.</p>
      
      <h2>1. Health and Well‑being</h2>
      <p>Living in a farmhouse means waking up to birds chirping, not traffic noise. Fresh air, morning walks, and space for yoga and meditation naturally improve your physical and mental health. Studies show that living near nature reduces stress by up to 40%.</p>
      
      <h2>2. Investment Appreciation</h2>
      <p>Agricultural land near developing urban centers appreciates at 15‑20% annually. Unlike apartments that depreciate over time, land value only goes up. Many of our clients at Vyom Regency have seen their plot value double in just 5 years.</p>
      
      <h2>3. Organic Living</h2>
      <p>Grow your own vegetables and fruits. There's nothing more satisfying than eating food you've grown yourself. It's healthier, tastier, and completely chemical‑free.</p>
      
      <h2>4. Privacy and Peace</h2>
      <p>No shared walls, no noisy neighbors, no parking disputes. Your farmhouse is your private sanctuary. Host family gatherings without worrying about space or noise complaints.</p>
      
      <h2>5. Weekend Getaway</h2>
      <p>Drive down on Friday evening, return on Monday morning refreshed. Skip the hotel bookings and crowded resorts. Your farmhouse is always ready for you, exactly the way you like it.</p>
      
      <h2>6. Multi‑generational Living</h2>
      <p>Farmhouses offer space for the entire family. Grandparents can enjoy their retirement in peace, children have space to play, and you have room for everyone during festivals and celebrations.</p>
      
      <h2>7. Work From Farmhouse</h2>
      <p>With remote work becoming permanent for many, why work from a cramped apartment when you can work from a spacious farmhouse? High‑speed internet connectivity in areas like Kishangarh Bas makes this possible.</p>
      
      <h2>8. Pet‑Friendly Space</h2>
      <p>Your furry friends deserve space to run and play. Apartments restrict pets, but farmhouses give them the freedom they need.</p>
      
      <h2>9. Social Status</h2>
      <p>Owning a farmhouse is a symbol of success. It shows you've made it. Host business meetings, impress clients, and enjoy the lifestyle you've earned.</p>
      
      <h2>10. Legacy for Children</h2>
      <p>Land is the only asset that never loses value. Passing down a farmhouse plot to your children is a gift that keeps giving—something they can build on, sell, or keep for generations.</p>
      
      <div class="bg-green-50 p-6 rounded-lg my-6">
        <h3 class="text-xl font-bold text-green-800 mb-2">Ready to Own Your Farmhouse?</h3>
        <p class="mb-4">Vyom Regency offers premium farmhouse plots in Rajasthan. Book a site visit today!</p>
        <a href="/#lead-form" class="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">Book Site Visit →</a>
      </div>
    `,
    category: "Farmhouse Living",
    categorySlug: "farmhouse-living",
    author: "Mr. Sobaran Singh",
    date: "December 15, 2024",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
    tags: ["farmhouse", "investment", "lifestyle"],
    featured: true,
  },
  {
    id: 2,
    title: "Complete Guide to Buying Agriculture Land in Rajasthan (2024)",
    slug: "guide-to-buying-agriculture-land-rajasthan",
    excerpt:
      "Everything you need to know before buying agricultural land in Rajasthan. Legal requirements, documentation, registration process, and more.",
    content: `
      <p>Rajasthan has emerged as one of India's most attractive destinations for agricultural land investment. With its proximity to Delhi NCR, developing infrastructure, and affordable prices, it's no wonder that more buyers are looking at regions like Alwar, Kishangarh Bas, and Khairthal.</p>
      
      <h2>Why Rajasthan?</h2>
      <p>Rajasthan offers several advantages for agricultural land buyers: lower prices compared to Delhi NCR, clear titles, good road connectivity, and a peaceful environment away from industrial pollution.</p>
      
      <h2>Legal Requirements for Buying Agri‑Land</h2>
      <ul>
        <li>Buyer must have agricultural background (in some districts)</li>
        <li>Maximum land holding limits as per state law</li>
        <li>Must obtain permission from Tehsildar (for non‑agriculturists)</li>
        <li>Registration and stamp duty payment</li>
      </ul>
      
      <h2>Documents Required</h2>
      <ul>
        <li>7/12 extract (land record)</li>
        <li>Title deed and chain of ownership</li>
        <li>No Objection Certificate (NOC) from concerned authorities</li>
        <li>Property tax receipt</li>
        <li>Encumbrance certificate</li>
      </ul>
      
      <h2>Registration Process</h2>
      <p>The registration process involves executing a sale deed on non‑judicial stamp paper, paying stamp duty (approximately 5‑6% in Rajasthan), and registering at the Sub‑Registrar office. Vyom Regency ensures complete due diligence and hassle‑free documentation for all our buyers.</p>
      
      <h2>Things to Check Before Buying</h2>
      <ul>
        <li>Is the land's agricultural classification valid?</li>
        <li>Are there any pending disputes or litigation?</li>
        <li>Is the land accessible via public roads?</li>
        <li>Are utilities (water, electricity) available?</li>
      </ul>
      
      <div class="bg-green-50 p-6 rounded-lg my-6">
        <h3 class="text-xl font-bold text-green-800 mb-2">Need Help Buying Agriculture Land?</h3>
        <p class="mb-4">At Vyom Regency, we handle all the legal documentation for you. Contact us for a free consultation!</p>
        <a href="/#lead-form" class="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">Get Consultation →</a>
      </div>
    `,
    category: "Buying Guide",
    categorySlug: "buying-guide",
    author: "Vyom Regency Team",
    date: "December 10, 2024",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80",
    tags: ["buying guide", "legal", "Rajasthan"],
    featured: true,
  },
  {
    id: 3,
    title: "Vyom Green Paradise: Why 1350 Sq Yard Plots are Perfect for Your Dream Farmhouse",
    slug: "vyom-green-paradise-1350-sq-yard-plots",
    excerpt:
      "A detailed look at our flagship project. Discover the amenities, plot specifications, and why only 2 plots remain available.",
    content: `
      <p>Vyom Green Paradise is not just another farmhouse project—it's a vision brought to life. Located in the serene Kishangarh Bas area of Khairthal‑Tijara district, this project offers everything you've dreamed of in a farmhouse plot.</p>
      
      <h2>Why 1350 Square Yards?</h2>
      <p>1350 sq yards is the sweet spot for farmhouse plots—large enough to build a spacious farmhouse, garden, and even a small orchard, but not so large that maintenance becomes overwhelming.</p>
      
      <h2>What You Get at Vyom Green Paradise</h2>
      <ul>
        <li><strong>Plot Size:</strong> 1350 square yards each</li>
        <li><strong>Roads:</strong> 40ft main gate, 30ft internal roads</li>
        <li><strong>Water:</strong> Borewell with water harvesting system</li>
        <li><strong>Electricity:</strong> Underground power lines to each plot</li>
        <li><strong>Security:</strong> Gated community with CCTV surveillance</li>
        <li><strong>Green Belt:</strong> Lush green buffer zones throughout the project</li>
      </ul>
      
      <h2>Location Advantages</h2>
      <p>Kishangarh Bas offers the perfect balance—close enough to Alwar city (approx 25 km) for urban amenities, but far enough to enjoy complete peace and privacy. The area is well‑connected via state highways and is part of the rapidly developing Khairthal‑Tijara belt.</p>
      
      <h2>Limited Availability</h2>
      <div class="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
        <p class="font-bold text-amber-800">⚠️ Only 2 plots remaining!</p>
        <p>Due to overwhelming response, Vyom Green Paradise is almost sold out. Don't miss your chance to own a piece of paradise.</p>
      </div>
      
      <div class="bg-green-50 p-6 rounded-lg my-6">
        <h3 class="text-xl font-bold text-green-800 mb-2">Visit Vyom Green Paradise</h3>
        <p class="mb-4">See the plots in person and imagine your dream farmhouse. Book your site visit today!</p>
        <a href="/#lead-form" class="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">Book Site Visit →</a>
      </div>
    `,
    category: "Our Projects",
    categorySlug: "our-projects",
    author: "Vyom Regency Team",
    date: "December 5, 2024",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
    tags: ["vyom green paradise", "project update", "limited plots"],
    featured: true,
  },
  {
    id: 4,
    title: "Alwar vs Jaipur: Which Location is Better for Farmhouse Investment?",
    slug: "alwar-vs-jaipur-farmhouse-investment",
    excerpt:
      "Comparing two of Rajasthan's most popular farmhouse destinations. Prices, connectivity, amenities, and investment potential.",
    content: `
      <p>Both Alwar and Jaipur are excellent choices for farmhouse investment, but they cater to different needs and budgets. Let's break down the comparison.</p>
      
      <h2>Distance from Delhi NCR</h2>
      <p><strong>Alwar:</strong> Approximately 150 km from Delhi (3‑4 hours drive)<br/>
      <strong>Jaipur:</strong> Approximately 280 km from Delhi (5‑6 hours drive)</p>
      <p>Alwar is clearly the winner for weekend getaways from Delhi NCR.</p>
      
      <h2>Land Prices</h2>
      <p><strong>Alwar (Kishangarh Bas area):</strong> ₹50‑65 lakh for 1350 sq yard plot<br/>
      <strong>Jaipur (outskirts):</strong> ₹1‑2 crore for similar‑sized plot</p>
      <p>Alwar offers much better value for money, with similar amenities and connectivity.</p>
      
      <h2>Development Potential</h2>
      <p>Jaipur is already a major city with developed infrastructure. Alwar, particularly the Khairthal‑Tijara belt, is in the growth phase—which means higher appreciation potential in the next 5‑10 years.</p>
      
      <h2>Verdict</h2>
      <p>For investors looking for quick weekend access from Delhi NCR and better appreciation potential, Alwar is the better choice. For those seeking established urban amenities, Jaipur might be preferable—but at a significantly higher price point.</p>
      
      <div class="bg-green-50 p-6 rounded-lg my-6">
        <h3 class="text-xl font-bold text-green-800 mb-2">Explore Our Alwar Projects</h3>
        <p class="mb-4">Vyom Regency's projects are strategically located in Kishangarh Bas—the best area for farmhouse investment in Alwar.</p>
        <a href="/estates" class="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">View Projects →</a>
      </div>
    `,
    category: "Investment Guide",
    categorySlug: "investment-guide",
    author: "Mr. Sobaran Singh",
    date: "November 28, 2024",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1152&q=80",
    tags: ["Alwar", "Jaipur", "investment", "comparison"],
    featured: false,
  },
  {
    id: 5,
    title: "Organic Farming on Your Farmhouse Plot: A Beginner's Guide",
    slug: "organic-farming-beginners-guide",
    excerpt:
      "Start your organic farming journey on your farmhouse plot. Simple steps, low investment, and high rewards for health and happiness.",
    content: `
      <p>One of the greatest joys of owning a farmhouse plot is the ability to grow your own food. Organic farming is not as difficult as it seems—here's a beginner's guide to get you started.</p>
      
      <h2>Start Small</h2>
      <p>You don't need to farm your entire plot at once. Start with a small 10x10 feet patch. Grow easy vegetables like tomatoes, brinjals, chilies, and leafy greens.</p>
      
      <h2>Soil Preparation</h2>
      <p>Good soil is the foundation of organic farming. Add compost, cow dung manure, and organic matter to enrich the soil. Avoid chemical fertilizers at all costs.</p>
      
      <h2>Natural Pest Control</h2>
      <p>Neem oil spray, garlic‑chili solution, and companion planting (like marigolds with vegetables) keep pests away naturally without harmful chemicals.</p>
      
      <h2>Water Management</h2>
      <p>Drip irrigation is ideal for farmhouse plots—it saves water and delivers moisture directly to plant roots. Rainwater harvesting is also a smart investment.</p>
      
      <h2>What to Grow First?</h2>
      <ul>
        <li><strong>Easy vegetables:</strong> Tomatoes, brinjals, okra, chilies, spinach</li>
        <li><strong>Herbs:</strong> Mint, coriander, basil, curry leaves</li>
        <li><strong>Fruits (winter):</strong> Oranges, lemons, pomegranates</li>
        <li><strong>Seasonal crops:</strong> Wheat, mustard (for larger areas)</li>
      </ul>
      
      <div class="bg-green-50 p-6 rounded-lg my-6">
        <h3 class="text-xl font-bold text-green-800 mb-2">Your Farmhouse Awaits</h3>
        <p class="mb-4">Imagine stepping out of your farmhouse to pick fresh vegetables for breakfast. This can be your reality with a plot at Vyom Regency.</p>
        <a href="/#lead-form" class="inline-block bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">Book Site Visit →</a>
      </div>
    `,
    category: "Farmhouse Living",
    categorySlug: "farmhouse-living",
    author: "Vyom Regency Team",
    date: "November 20, 2024",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
    tags: ["organic farming", "beginner guide", "gardening"],
    featured: false,
  },
];

export const categories = [
  { name: "Farmhouse Living", slug: "farmhouse-living", count: 2 },
  { name: "Buying Guide", slug: "buying-guide", count: 1 },
  { name: "Our Projects", slug: "our-projects", count: 1 },
  { name: "Investment Guide", slug: "investment-guide", count: 1 },
];

export function getFeaturedPosts() {
  return blogs.filter((blog) => blog.featured);
}

export function getLatestPosts(limit: number = 3) {
  return [...blogs]
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, limit);
}

export function getPostBySlug(slug: string) {
  return blogs.find((blog) => blog.slug === slug);
}

export function getPostsByCategory(categorySlug: string) {
  return blogs.filter((blog) => blog.categorySlug === categorySlug);
}