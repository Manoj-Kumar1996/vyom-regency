"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Plus, Edit, Trash2, Loader2, FileText, ExternalLink } from "lucide-react";
import type { CmsPage } from "@/lib/cms";

export default function AdminCmsPagesList() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data, error } = await supabase.from("cms_pages").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load pages");
    } else {
      setPages((data as CmsPage[]) || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    const { error } = await supabase.from("cms_pages").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
    } else {
      toast.success("Page deleted");
      fetchPages();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-green-700" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">CMS Pages</h1>
            <p className="text-sm text-gray-500">Create and manage standalone pages without touching code</p>
          </div>
        </div>
        <Link href="/admin/cms-pages/add" className="bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-800 transition flex items-center gap-2">
          <Plus size={18} /> New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <FileText className="mx-auto text-gray-300 mb-3" size={40} />
          <p className="text-gray-500 mb-4">No pages yet.</p>
          <Link href="/admin/cms-pages/add" className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition inline-block">
            + Create Your First Page
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div key={page.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-800">{page.title}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${page.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {page.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono">/{page.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                {page.status === "published" && (
                  <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-700" title="View live">
                    <ExternalLink size={18} />
                  </a>
                )}
                <Link href={`/admin/cms-pages/edit/${page.id}`} className="text-blue-600 hover:text-blue-800">
                  <Edit size={18} />
                </Link>
                <button onClick={() => handleDelete(page.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
