"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CmsPageForm, { cmsPageFormDataFromRecord, type CmsPageFormData } from "@/components/admin/CmsPageForm";
import type { CmsPage } from "@/lib/cms";

export default function EditCmsPagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [initialData, setInitialData] = useState<CmsPageFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPage();
  }, [id]);

  const fetchPage = async () => {
    try {
      const { data, error } = await supabase.from("cms_pages").select("*").eq("id", id).single();
      if (error) throw error;
      if (data) setInitialData(cmsPageFormDataFromRecord(data as CmsPage));
    } catch {
      toast.error("Failed to load page");
      router.push("/admin/cms-pages");
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

  return <CmsPageForm mode="edit" pageId={id} initialData={initialData} />;
}
