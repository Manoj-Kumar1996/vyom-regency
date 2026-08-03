"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecentProperties, type Property } from "@/lib/properties";

interface PropertyRecentListProps {
  excludeId: string;
}

export default function PropertyRecentList({ excludeId }: PropertyRecentListProps) {
  const [items, setItems] = useState<Property[]>([]);

  useEffect(() => {
    getRecentProperties(excludeId, 4).then(setItems);
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      <h3 className="font-bold text-gray-800 mb-4">Recent Projects</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/estates/${item.slug}`}
            className="flex gap-3 items-center group"
          >
            <img
              src={item.image_url || ""}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover shrink-0 border"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-green-700 transition">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{item.location}</p>
              <p className="text-xs text-green-700 font-bold">{item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
