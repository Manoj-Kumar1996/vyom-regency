"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PropertyForm from "@/components/admin/PropertyForm";
import { propertyFormDataFromRecord } from "@/lib/propertyUtils";
import type { PropertyFormData } from "@/lib/propertyUtils";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<PropertyFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase.from("properties").select("*").eq("id", id).single();
      if (error) throw error;
      if (data) setInitialData(propertyFormDataFromRecord(data));
    } catch {
      toast.error("Failed to load property");
      router.push("/admin/properties");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-green-700" size={32} />
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <div className="max-w-[1600px] mx-auto">
      <PropertyForm mode="edit" propertyId={id} initialData={initialData} />
    </div>
  );
}
