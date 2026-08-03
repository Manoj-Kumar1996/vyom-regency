"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Loader2, Save, Info } from "lucide-react";
import { SEO_ROUTES } from "@/lib/seo";
import { DEFAULT_HEADER_LINKS, DEFAULT_FOOTER_LINKS } from "@/lib/menu";

interface MenuItemForm {
  id?: number;
  label: string;
  link_type: "route" | "cms_page" | "external";
  route: string;
  cms_page_id: string;
  external_url: string;
  open_in_new_tab: boolean;
  sort_order: number;
  is_active: boolean;
}

interface CmsPageOption {
  id: string;
  title: string;
}

const FIXED_ROUTE_OPTIONS = [
  { route: "/", label: "Home" },
  ...SEO_ROUTES.filter((r) => r.route !== "home").map((r) => ({ route: r.path, label: r.label })),
];

function emptyRow(sortOrder: number): MenuItemForm {
  return {
    label: "",
    link_type: "route",
    route: "",
    cms_page_id: "",
    external_url: "",
    open_in_new_tab: false,
    sort_order: sortOrder,
    is_active: true,
  };
}

function defaultsFor(location: "header" | "footer"): MenuItemForm[] {
  const links = location === "header" ? DEFAULT_HEADER_LINKS : DEFAULT_FOOTER_LINKS;
  return links.map((link, i) => ({
    label: link.label,
    link_type: "route",
    route: link.route,
    cms_page_id: "",
    external_url: "",
    open_in_new_tab: false,
    sort_order: i,
    is_active: true,
  }));
}

export default function AdminMenusPage() {
  const [location, setLocation] = useState<"header" | "footer">("header");
  const [items, setItems] = useState<MenuItemForm[]>([]);
  const [usingLiveDefaults, setUsingLiveDefaults] = useState(false);
  const [cmsPages, setCmsPages] = useState<CmsPageOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchCmsPages();
  }, [location]);

  const fetchCmsPages = async () => {
    const { data } = await supabase.from("cms_pages").select("id, title").eq("status", "published");
    setCmsPages(data || []);
  };

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("location", location)
      .order("sort_order", { ascending: true });

    if (error) {
      toast.error("Failed to load menu items");
    } else if (!data || data.length === 0) {
      // Nothing saved yet — the live site is currently rendering its hardcoded fallback nav.
      // Seed the editor with that same list so "add one more" adds to it instead of replacing it.
      setItems(defaultsFor(location));
      setUsingLiveDefaults(true);
    } else {
      setItems(
        data.map((row) => ({
          id: row.id,
          label: row.label,
          link_type: row.link_type,
          route: row.route || "/",
          cms_page_id: row.cms_page_id || "",
          external_url: row.external_url || "",
          open_in_new_tab: row.open_in_new_tab,
          sort_order: row.sort_order,
          is_active: row.is_active,
        }))
      );
      setUsingLiveDefaults(false);
    }
    setLoading(false);
  };

  const handleAdd = () => setItems([...items, emptyRow(items.length)]);

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index).map((it, i) => ({ ...it, sort_order: i })));
  };

  const handleChange = <K extends keyof MenuItemForm>(index: number, field: K, value: MenuItemForm[K]) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setItems(updated.map((it, i) => ({ ...it, sort_order: i })));
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setItems(updated.map((it, i) => ({ ...it, sort_order: i })));
  };

  const handleSaveAll = async () => {
    if (items.some((it) => !it.label.trim())) {
      toast.error("Every menu item needs a label");
      return;
    }
    if (items.some((it) => it.link_type === "route" && !it.route)) {
      toast.error("Pick a page for every \"Existing Page\" item");
      return;
    }
    if (items.some((it) => it.link_type === "cms_page" && !it.cms_page_id)) {
      toast.error("Pick a page for every \"CMS Page\" item");
      return;
    }
    if (items.some((it) => it.link_type === "external" && !it.external_url.trim())) {
      toast.error("Enter a URL for every \"External URL\" item");
      return;
    }

    setSaving(true);
    try {
      await supabase.from("menu_items").delete().eq("location", location);

      const payload = items.map((it, i) => ({
        location,
        label: it.label,
        link_type: it.link_type,
        route: it.link_type === "route" ? it.route : null,
        cms_page_id: it.link_type === "cms_page" ? it.cms_page_id || null : null,
        external_url: it.link_type === "external" ? it.external_url : null,
        open_in_new_tab: it.link_type === "external" ? it.open_in_new_tab : false,
        sort_order: i,
        is_active: it.is_active,
      }));

      if (payload.length > 0) {
        const { error } = await supabase.from("menu_items").insert(payload);
        if (error) throw error;
      }

      toast.success("Menu saved");
      fetchItems();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Menus</h1>
            <p className="text-sm text-gray-500">Manage header and footer navigation. Leave empty to use the default menu.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(["header", "footer"] as const).map((loc) => (
          <button
            key={loc}
            onClick={() => setLocation(loc)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
              location === loc ? "bg-green-700 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-green-700" size={32} />
        </div>
      ) : (
        <>
          {usingLiveDefaults && (
            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-4 mb-6 text-sm">
              <Info size={16} className="mt-0.5 shrink-0" />
              <p>
                No {location} menu has been saved yet, so this shows the <strong>current live nav</strong> (unsaved).
                Add your new item below, then click "Save {location} menu" — everything below will become the live menu, so make sure nothing you want to keep is missing.
              </p>
            </div>
          )}
          <div className="space-y-3 mb-6">
            {items.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 mt-2">
                    <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button onClick={() => handleMoveDown(index)} disabled={index === items.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) => handleChange(index, "label", e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                    />
                    <select
                      value={item.link_type}
                      onChange={(e) => handleChange(index, "link_type", e.target.value as MenuItemForm["link_type"])}
                      className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                    >
                      <option value="route">Existing Page</option>
                      <option value="cms_page">CMS Page</option>
                      <option value="external">External URL</option>
                    </select>

                    {item.link_type === "route" && (
                      <select
                        value={item.route}
                        onChange={(e) => handleChange(index, "route", e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 md:col-span-2"
                      >
                        <option value="">Select a page</option>
                        {FIXED_ROUTE_OPTIONS.map((r) => (
                          <option key={r.route} value={r.route}>{r.label}</option>
                        ))}
                      </select>
                    )}

                    {item.link_type === "cms_page" && (
                      <select
                        value={item.cms_page_id}
                        onChange={(e) => handleChange(index, "cms_page_id", e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 md:col-span-2"
                      >
                        <option value="">Select a page</option>
                        {cmsPages.map((p) => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    )}

                    {item.link_type === "external" && (
                      <div className="flex gap-2 md:col-span-2">
                        <input
                          type="text"
                          placeholder="https://..."
                          value={item.external_url}
                          onChange={(e) => handleChange(index, "external_url", e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                        />
                        <label className="flex items-center gap-1.5 text-xs text-gray-600 whitespace-nowrap">
                          <input type="checkbox" checked={item.open_in_new_tab} onChange={(e) => handleChange(index, "open_in_new_tab", e.target.checked)} className="w-3.5 h-3.5 accent-green-700" />
                          New tab
                        </label>
                      </div>
                    )}
                  </div>

                  <label className="flex items-center gap-1.5 text-xs text-gray-600 mt-2 whitespace-nowrap">
                    <input type="checkbox" checked={item.is_active} onChange={(e) => handleChange(index, "is_active", e.target.checked)} className="w-4 h-4 accent-green-700" />
                    Active
                  </label>

                  <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700 mt-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={handleAdd} className="flex-1 border-2 border-dashed border-green-300 text-green-700 font-semibold rounded-xl py-3 hover:bg-green-50 transition flex items-center justify-center gap-2">
              <Plus size={18} /> Add Menu Item
            </button>
            <button onClick={handleSaveAll} disabled={saving} className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save {location} menu
            </button>
          </div>
        </>
      )}
    </div>
  );
}
