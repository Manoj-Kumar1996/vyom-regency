"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, CheckCircle, Clock, Ban, Home } from "lucide-react";
import { toast } from "sonner";
import { getPropertiesForAdminList, deleteProperty } from "@/lib/properties";

type PropertyListItem = Awaited<ReturnType<typeof getPropertiesForAdminList>>[number];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setProperties(await getPropertiesForAdminList());
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await deleteProperty(id);
    if (error) {
      toast.error("Failed to delete property");
    } else {
      toast.success("Property deleted");
      fetchProperties();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-medium"><CheckCircle size={10} className="inline mr-1" /> Available</span>;
      case "limited":
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-[10px] font-medium"><Clock size={10} className="inline mr-1" /> Limited</span>;
      case "sold":
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-[10px] font-medium"><Ban size={10} className="inline mr-1" /> Sold Out</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-[10px]">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
          <p className="text-gray-500 text-sm">Manage listings and home page display</p>
        </div>
        <Link
          href="/admin/properties/add"
          className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition flex items-center gap-2"
        >
          <Plus size={16} /> Add Property
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 mb-4">No properties yet</p>
          <Link href="/admin/properties/add" className="text-green-700 font-semibold hover:underline">
            + Create your first property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="relative h-40 bg-gray-200">
                <img src={property.image_url || ""} alt={property.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">{getStatusBadge(property.status)}</div>
                {property.show_on_home && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white p-1.5 rounded-full shadow-lg" title="Showing on Home Page">
                    <Home size={14} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 truncate">{property.name}</h3>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase font-bold">
                    {property.display_type}
                  </span>
                </div>

                {property.property_type === "individual" && (
                  <span className="inline-block text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold mb-2">Individual Land</span>
                )}
                <p className="text-xs text-gray-500 mb-2 location-hide">{property.location}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-green-700 font-bold text-sm">{property.price}</span>
                  <span className="text-gray-400 text-[10px]">Order: {property.sort_order}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/properties/edit/${property.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition text-center flex items-center justify-center gap-1"
                  >
                    <Edit size={14} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(property.id, property.name)}
                    className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
