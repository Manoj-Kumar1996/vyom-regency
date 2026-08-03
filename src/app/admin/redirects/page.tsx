"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Loader2, Save, ArrowRightLeft } from "lucide-react";
import { normalizePath } from "@/lib/redirects";

interface RedirectRow {
  id?: number;
  from_path: string;
  to_path: string;
  redirect_type: 301 | 302;
  is_active: boolean;
}

export default function AdminRedirectsPage() {
  const [rows, setRows] = useState<RedirectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    const { data, error } = await supabase.from("redirects").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load redirects");
    } else {
      setRows(data || []);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setRows([{ from_path: "", to_path: "", redirect_type: 301, is_active: true }, ...rows]);
  };

  const handleChange = <K extends keyof RedirectRow>(index: number, field: K, value: RedirectRow[K]) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  const handleSaveRow = async (index: number) => {
    const row = rows[index];
    if (!row.from_path.trim() || !row.to_path.trim()) {
      toast.error("Both paths are required");
      return;
    }

    const payload = {
      from_path: normalizePath(row.from_path),
      to_path: row.to_path,
      redirect_type: row.redirect_type,
      is_active: row.is_active,
    };

    if (payload.from_path === normalizePath(payload.to_path)) {
      toast.error("From and To can't be the same path — that would redirect forever");
      return;
    }

    setSaving(row.id ?? -1 - index);
    try {
      const { error } = row.id
        ? await supabase.from("redirects").update(payload).eq("id", row.id)
        : await supabase.from("redirects").insert([payload]);
      if (error) throw error;
      toast.success("Redirect saved");
      fetchRedirects();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      toast.error(message.includes("duplicate") ? "A redirect from this path already exists" : "Save failed");
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (index: number) => {
    const row = rows[index];
    if (!row.id) {
      setRows(rows.filter((_, i) => i !== index));
      return;
    }
    if (!confirm("Delete this redirect?")) return;
    const { error } = await supabase.from("redirects").delete().eq("id", row.id);
    if (error) {
      toast.error("Delete failed");
    } else {
      toast.success("Deleted");
      fetchRedirects();
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
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><ArrowRightLeft size={22} /> Redirects</h1>
            <p className="text-sm text-gray-500">301/302 URL redirects, applied site-wide (excluding /admin and /api)</p>
          </div>
        </div>
        <button onClick={handleAdd} className="bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-green-800 transition flex items-center gap-2">
          <Plus size={18} /> New Redirect
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">No redirects yet.</p>
          <button onClick={handleAdd} className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition">
            + Add Your First Redirect
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={row.id ?? `new-${index}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-3">
              <input
                type="text"
                placeholder="/old-path"
                value={row.from_path}
                onChange={(e) => handleChange(index, "from_path", e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500"
              />
              <span className="text-gray-400 text-sm hidden md:block">→</span>
              <input
                type="text"
                placeholder="/new-path or https://..."
                value={row.to_path}
                onChange={(e) => handleChange(index, "to_path", e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500"
              />
              <div className="flex items-center gap-3 shrink-0">
                <select
                  value={row.redirect_type}
                  onChange={(e) => handleChange(index, "redirect_type", Number(e.target.value) as 301 | 302)}
                  className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value={301}>301 Permanent</option>
                  <option value={302}>302 Temporary</option>
                </select>
                <label className="flex items-center gap-1.5 text-xs text-gray-600 whitespace-nowrap">
                  <input type="checkbox" checked={row.is_active} onChange={(e) => handleChange(index, "is_active", e.target.checked)} className="w-4 h-4 accent-green-700" />
                  Active
                </label>
                <button
                  onClick={() => handleSaveRow(index)}
                  disabled={saving === (row.id ?? -1 - index)}
                  className="p-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition disabled:opacity-50"
                  title="Save"
                >
                  {saving === (row.id ?? -1 - index) ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                </button>
                <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700 p-2" title="Delete">
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
