"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, X, Navigation, TrendingUp } from "lucide-react";

interface SearchResult {
  id: string;
  name: string;
  type: "project" | "location" | "page" | "amenity" | "nearby";
  url: string;
  desc: string;
  relevance: number;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Complete search database
  const searchDatabase: SearchResult[] = [
    // Projects
    { id: "p1", name: "Vyom Green Paradise", type: "project", url: "/estates", desc: "1350 Sq Yard • Only 2 plots left", relevance: 10 },
    { id: "p2", name: "Vyom Green Valley", type: "project", url: "/estates", desc: "Complete Sold Out", relevance: 8 },
    { id: "p3", name: "Vyom Chhatarpur Farms", type: "project", url: "/estates", desc: "Complete Sold Out", relevance: 8 },
    { id: "p4", name: "Individual Premium Farm Land", type: "project", url: "/estates", desc: "Flexible sizes • Available", relevance: 9 },

    // Locations
    { id: "l1", name: "Kishangarh Bas", type: "location", url: "/location", desc: "Main project location • 2 hrs from Delhi", relevance: 10 },
    { id: "l2", name: "Khairthal", type: "location", url: "/location", desc: "Vyom Green Valley location", relevance: 8 },
    { id: "l3", name: "Alwar", type: "location", url: "/location", desc: "District headquarters • 25 km away", relevance: 9 },
    { id: "l4", name: "Bhiwadi", type: "location", url: "/location", desc: "Industrial hub • 80 km from project", relevance: 7 },
    { id: "l5", name: "Delhi NCR", type: "location", url: "/location", desc: "2 hours from project location", relevance: 9 },
    { id: "l6", name: "Gurugram", type: "location", url: "/location", desc: "2.5 hours from farmhouse plots", relevance: 8 },
    { id: "l7", name: "Noida", type: "location", url: "/location", desc: "2.5 hours via expressway", relevance: 8 },
    { id: "l8", name: "Jaipur", type: "location", url: "/location", desc: "3 hours from project location", relevance: 7 },
    
    // Pages
    { id: "pg1", name: "About Us", type: "page", url: "/about", desc: "Company information", relevance: 5 },
    { id: "pg2", name: "Founder", type: "page", url: "/founder", desc: "Mr. Sobaran Singh - Ex-NSG Commando", relevance: 5 },
    { id: "pg3", name: "Blog", type: "page", url: "/blog", desc: "Latest articles on farmhouse living", relevance: 5 },
    { id: "pg4", name: "Gallery", type: "page", url: "/gallery", desc: "Project photos and videos", relevance: 5 },
    { id: "pg5", name: "Contact Us", type: "page", url: "/contact", desc: "Get in touch with us", relevance: 5 },
    
    // Amenities
    { id: "a1", name: "Gated Security", type: "amenity", url: "/estates", desc: "24/7 CCTV surveillance", relevance: 6 },
    { id: "a2", name: "Water Supply", type: "amenity", url: "/estates", desc: "24x7 water availability", relevance: 6 },
    { id: "a3", name: "Electricity", type: "amenity", url: "/estates", desc: "Underground connection", relevance: 6 },
    { id: "a4", name: "Paved Roads", type: "amenity", url: "/estates", desc: "30ft wide concrete roads", relevance: 6 },
  ];

  // Nearby location mapping
  const nearbyMapping: Record<string, { result: SearchResult; distance: string }[]> = {
    "alwar": [
      { result: searchDatabase.find(r => r.id === "l1")!, distance: "25 km" },
      { result: searchDatabase.find(r => r.id === "p1")!, distance: "35 min drive" },
    ],
    "bhiwadi": [
      { result: searchDatabase.find(r => r.id === "l1")!, distance: "80 km • 1.5 hours" },
    ],
    "delhi": [
      { result: searchDatabase.find(r => r.id === "l1")!, distance: "150 km • 2 hours" },
      { result: searchDatabase.find(r => r.id === "p1")!, distance: "2 hours from Delhi" },
    ],
    "gurugram": [
      { result: searchDatabase.find(r => r.id === "l1")!, distance: "160 km • 2.5 hours" },
    ],
    "noida": [
      { result: searchDatabase.find(r => r.id === "l1")!, distance: "170 km • 2.5 hours" },
    ],
    "jaipur": [
      { result: searchDatabase.find(r => r.id === "l1")!, distance: "150 km • 3 hours" },
    ],
    "khairthal": [
      { result: searchDatabase.find(r => r.id === "l2")!, distance: "25 km" },
    ],
  };

  // Extract nearby queries
  const getNearbyResults = (searchQuery: string): SearchResult[] => {
    const lowerQuery = searchQuery.toLowerCase();
    
    // Check for "near X" pattern
    const nearMatch = lowerQuery.match(/near\s+(\w+)/);
    if (nearMatch) {
      const location = nearMatch[1];
      const nearbyItems = nearbyMapping[location];
      if (nearbyItems) {
        return nearbyItems.map(item => ({
          ...item.result,
          desc: `${item.result.desc} • ${item.distance} from ${location}`,
          type: "nearby" as const,
          relevance: 10,
        }));
      }
    }
    
    // Direct location match
    for (const [key, items] of Object.entries(nearbyMapping)) {
      if (lowerQuery.includes(key)) {
        return items.map(item => ({
          ...item.result,
          desc: `${item.result.desc} • ${item.distance} from ${key}`,
          type: "nearby" as const,
          relevance: 9,
        }));
      }
    }
    
    return [];
  };

  const performSearch = (searchQuery: string): SearchResult[] => {
    if (searchQuery.length < 2) return [];
    
    const lowerQuery = searchQuery.toLowerCase();
    let results: SearchResult[] = [];
    
    // First check for nearby location queries
    const nearbyResults = getNearbyResults(searchQuery);
    if (nearbyResults.length > 0) {
      return nearbyResults;
    }
    
    // Normal search
    for (const item of searchDatabase) {
      let relevance = 0;
      
      // Exact match
      if (item.name.toLowerCase() === lowerQuery) {
        relevance = 100;
      }
      // Starts with
      else if (item.name.toLowerCase().startsWith(lowerQuery)) {
        relevance = 80;
      }
      // Contains
      else if (item.name.toLowerCase().includes(lowerQuery)) {
        relevance = 60;
      }
      // Description contains
      else if (item.desc.toLowerCase().includes(lowerQuery)) {
        relevance = 40;
      }
      
      if (relevance > 0) {
        results.push({ ...item, relevance });
      }
    }
    
    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    return results.slice(0, 8);
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    const searchResults = performSearch(value);
    setResults(searchResults);
    setIsOpen(value.length >= 2);
    setSelectedIndex(-1);
  };

  const handleSelect = (result: SearchResult) => {
    setQuery("");
    setIsOpen(false);
    router.push(result.url);
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    setResults([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project": return <Building2 className="w-4 h-4" />;
      case "location": return <MapPin className="w-4 h-4" />;
      case "nearby": return <Navigation className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project": return "bg-green-100 text-green-700";
      case "location": return "bg-amber-100 text-amber-700";
      case "nearby": return "bg-purple-100 text-purple-700";
      default: return "bg-blue-100 text-blue-700";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "project": return "Project";
      case "location": return "Location";
      case "nearby": return "Nearby";
      default: return "Page";
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-amber-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500 transition-all duration-300">
          <Search className="absolute left-4 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            placeholder="🔍 Search places near Delhi, Alwar, Bhiwadi, Gurugram... or browse projects"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-12 py-4 rounded-2xl outline-none text-gray-700 placeholder-gray-400"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Popular Location Suggestions */}
      {!query && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-gray-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Popular:</span>
          {["near Alwar", "near Delhi", "near Bhiwadi", "near Gurugram", "near Noida", "near Jaipur"].map((term, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(term)}
              className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 rounded-full transition flex items-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Search Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[450px] overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              <div className="px-3 py-2 text-xs text-gray-400 border-b">
                Found {results.length} result{results.length !== 1 ? "s" : ""}
              </div>
              {results.map((result, idx) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    selectedIndex === idx ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor(result.type)} transition-transform group-hover:scale-110`}>
                    {getTypeIcon(result.type)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{result.name}</p>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{result.desc}</p>
                  </div>
                  <div className="text-gray-300 group-hover:text-green-600 transition">
                    <Search className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No results found for "<span className="font-medium">{query}</span>"</p>
              <p className="text-sm text-gray-400 mt-1">Try "near Alwar", "near Delhi", "farmhouse", or "green paradise"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}