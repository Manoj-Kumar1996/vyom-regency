"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Loader2, ArrowLeft, Save, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { SEO_ROUTES } from "@/lib/seo";

interface FAQItem {
  id?: number;
  question: string;
  answer: string;
  sort_order: number;
  category_id: number | null;
  page_route: string | null;
  is_active: boolean;
}

interface FaqCategory {
  id: number;
  name: string;
  slug: string;
}

interface CmsPageOption {
  slug: string;
  title: string;
}

const PAGE_OPTIONS = [{ route: "global", label: "Global (all pages)" }, ...SEO_ROUTES];

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [cmsPages, setCmsPages] = useState<CmsPageOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    setIsMounted(true);
    fetchFaqs();
    fetchCategories();
    fetchCmsPages();
  }, []);

  const fetchFaqs = async () => {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error) {
      setFaqs(
        (data || []).map((f: Partial<FAQItem>) => ({
          question: f.question || "",
          answer: f.answer || "",
          sort_order: f.sort_order ?? 0,
          category_id: f.category_id ?? null,
          page_route: f.page_route ?? "global",
          is_active: f.is_active ?? true,
          id: f.id,
        }))
      );
    } else {
      console.error("Error fetching FAQs:", error);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("faq_categories").select("*").order("sort_order", { ascending: true });
    if (!error) setCategories(data || []);
  };

  const fetchCmsPages = async () => {
    const { data } = await supabase.from("cms_pages").select("slug, title").eq("status", "published");
    setCmsPages(data || []);
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    const { data, error } = await supabase
      .from("faq_categories")
      .insert({ name, slug, sort_order: categories.length })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add category");
      return;
    }
    setCategories((prev) => [...prev, data]);
    setNewCategoryName("");
    setAddingCategory(false);
    toast.success("Category added");
  };

  const handleAdd = () => {
    setFaqs([...faqs, { question: "", answer: "", sort_order: faqs.length, category_id: null, page_route: "global", is_active: true }]);
  };

  const handleRemove = (index: number) => {
    const updated = faqs.filter((_, i) => i !== index);
    setFaqs(updated.map((f, i) => ({ ...f, sort_order: i })));
  };

  const handleChange = <K extends keyof FAQItem>(index: number, field: K, value: FAQItem[K]) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...faqs];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setFaqs(updated.map((f, i) => ({ ...f, sort_order: i })));
  };

  const handleMoveDown = (index: number) => {
    if (index === faqs.length - 1) return;
    const updated = [...faqs];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setFaqs(updated.map((f, i) => ({ ...f, sort_order: i })));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await supabase.from("faqs").delete().neq("id", 0);

      const { error } = await supabase.from("faqs").insert(
        faqs.map((f, i) => ({
          question: f.question,
          answer: f.answer,
          sort_order: i,
          category_id: f.category_id,
          page_route: f.page_route === "global" ? null : f.page_route,
          is_active: f.is_active,
        }))
      );

      if (error) {
        toast.error("Save failed: " + error.message);
      } else {
        toast.success("FAQs saved successfully");
        fetchFaqs();
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!isMounted) return null;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-green-700" size={48} />
    </div>
  );

  const filteredFaqs = faqs
    .map((f, index) => ({ f, index }))
    .filter(({ f }) => {
      const matchesSearch = !search.trim() || f.question.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || String(f.category_id) === categoryFilter;
      return matchesSearch && matchesCategory;
    });

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link href="/admin" className="text-green-700 hover:text-green-800 inline-block mb-2">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">FAQ Management</h1>
          <p className="text-sm text-gray-500">Add, edit, remove, reorder, categorize, and assign FAQs to pages</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAdd} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition flex items-center gap-2">
            <Plus size={18} /> Add FAQ
          </button>
          <button onClick={handleSaveAll} disabled={saving} className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>{c.name}</option>
          ))}
        </select>
        {!addingCategory ? (
          <button
            type="button"
            onClick={() => setAddingCategory(true)}
            className="px-4 py-2.5 border rounded-lg text-green-700 hover:bg-green-50 transition text-sm font-semibold whitespace-nowrap"
          >
            + New Category
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
              className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <button type="button" onClick={handleAddCategory} className="px-3 border rounded-lg bg-green-700 text-white hover:bg-green-800 transition text-sm font-semibold">
              Add
            </button>
          </div>
        )}
      </div>

      {filteredFaqs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">No FAQs match. Click "Add FAQ" to get started.</p>
          <button onClick={handleAdd} className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition">
            + Add Your First FAQ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map(({ f: faq, index }) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 mt-2">
                  <button onClick={() => handleMoveUp(index)} className="text-gray-400 hover:text-gray-600" disabled={index === 0}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <span className="text-xs text-gray-400 text-center">{index + 1}</span>
                  <button onClick={() => handleMoveDown(index)} className="text-gray-400 hover:text-gray-600" disabled={index === faqs.length - 1}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => handleChange(index, "question", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 font-semibold"
                  />
                  <textarea
                    placeholder="Answer"
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => handleChange(index, "answer", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      value={faq.category_id ?? ""}
                      onChange={(e) => handleChange(index, "category_id", e.target.value ? Number(e.target.value) : null)}
                      className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">No Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <select
                      value={faq.page_route ?? "global"}
                      onChange={(e) => handleChange(index, "page_route", e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                    >
                      {PAGE_OPTIONS.map((p) => (
                        <option key={p.route} value={p.route}>{p.label}</option>
                      ))}
                      {cmsPages.map((p) => (
                        <option key={p.slug} value={`cms:${p.slug}`}>{p.title}</option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={faq.is_active}
                        onChange={(e) => handleChange(index, "is_active", e.target.checked)}
                        className="w-4 h-4 accent-green-700"
                      />
                      Active
                    </label>
                  </div>
                </div>
                <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700 mt-2">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {faqs.length > 0 && (
        <div className="mt-6 text-center">
          <button onClick={handleAdd} className="text-green-700 font-semibold hover:text-green-800 border-2 border-dashed border-green-300 rounded-xl px-6 py-3 w-full hover:bg-green-50 transition">
            + Add Another FAQ
          </button>
        </div>
      )}
    </div>
  );
}
