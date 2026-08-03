"use client";

import PropertyForm from "@/components/admin/PropertyForm";

export default function AddPropertyPage() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <PropertyForm mode="add" />
    </div>
  );
}
