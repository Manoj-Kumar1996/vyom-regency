"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SiteSettings {
  id?: number;
  site_title: string;
  site_description: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  ga4_measurement_id: string;
  gtm_container_id: string;
  meta_pixel_id: string;
  gsc_verification_code: string;
  header_scripts: string;
  footer_scripts: string;
  robots_txt_override: string;
  org_legal_name: string;
  org_logo_url: string;
  org_type: "Organization" | "LocalBusiness";
  geo_latitude: string;
  geo_longitude: string;
  custom_json_ld_global: string;
}

const EMPTY_SETTINGS: SiteSettings = {
  site_title: "",
  site_description: "",
  contact_phone: "",
  contact_email: "",
  address: "",
  ga4_measurement_id: "",
  gtm_container_id: "",
  meta_pixel_id: "",
  gsc_verification_code: "",
  header_scripts: "",
  footer_scripts: "",
  robots_txt_override: "",
  org_legal_name: "",
  org_logo_url: "",
  org_type: "LocalBusiness",
  geo_latitude: "",
  geo_longitude: "",
  custom_json_ld_global: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("settings").select("*").maybeSingle();
      if (error) throw error;
      if (data) {
        setSettings({
          ...EMPTY_SETTINGS,
          ...data,
          geo_latitude: data.geo_latitude != null ? String(data.geo_latitude) : "",
          geo_longitude: data.geo_longitude != null ? String(data.geo_longitude) : "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...settings,
        geo_latitude: settings.geo_latitude ? Number(settings.geo_latitude) : null,
        geo_longitude: settings.geo_longitude ? Number(settings.geo_longitude) : null,
      };
      const { error } = await supabase.from("settings").upsert([payload], { onConflict: "id" });
      if (error) throw error;
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-green-700" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
          <p className="text-gray-500 text-sm">Manage your website configuration</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <Tabs defaultValue="general">
          <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-gray-100 p-1.5 rounded-xl mb-6">
            <TabsTrigger value="general" className="flex-1 min-w-[100px] data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5">General</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 min-w-[100px] data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5">Analytics & Scripts</TabsTrigger>
            <TabsTrigger value="schema" className="flex-1 min-w-[100px] data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5">Schema / Organization</TabsTrigger>
            <TabsTrigger value="robots" className="flex-1 min-w-[100px] data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2.5">Robots.txt</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Site Title</label>
              <input type="text" name="site_title" value={settings.site_title} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="Vyom Regency Pvt Ltd" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Site Description</label>
              <textarea name="site_description" value={settings.site_description} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="Premium agriculture land for farmhouse living..." />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                <input type="tel" name="contact_phone" value={settings.contact_phone} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="+91 89553 11031" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                <input type="email" name="contact_email" value={settings.contact_email} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="info@vyomregency.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <textarea name="address" value={settings.address} onChange={handleChange} rows={2} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="Kishangarh Bas, Khairthal-Tijara, Rajasthan" />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GA4 Measurement ID</label>
                <input type="text" name="ga4_measurement_id" value={settings.ga4_measurement_id} onChange={handleChange} placeholder="G-XXXXXXXXXX" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GTM Container ID</label>
                <input type="text" name="gtm_container_id" value={settings.gtm_container_id} onChange={handleChange} placeholder="GTM-XXXXXXX" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Pixel ID</label>
                <input type="text" name="meta_pixel_id" value={settings.meta_pixel_id} onChange={handleChange} placeholder="123456789012345" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Google Search Console Verification Code</label>
                <input type="text" name="gsc_verification_code" value={settings.gsc_verification_code} onChange={handleChange} placeholder="content value only, not the full meta tag" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" />
              </div>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
              Raw HTML below is injected directly into every page — for advanced users only. Untrusted or malformed markup can break the site.
            </p>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Header Scripts (before &lt;/head&gt;)</label>
              <textarea name="header_scripts" value={settings.header_scripts} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-y font-mono text-xs" placeholder="<script>...</script>" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Footer Scripts (before &lt;/body&gt;)</label>
              <textarea name="footer_scripts" value={settings.footer_scripts} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-y font-mono text-xs" placeholder="<script>...</script>" />
            </div>
          </TabsContent>

          <TabsContent value="schema" className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Type</label>
              <select name="org_type" value={settings.org_type} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                <option value="LocalBusiness">Local Business</option>
                <option value="Organization">Organization</option>
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Legal Name</label>
                <input type="text" name="org_legal_name" value={settings.org_legal_name} onChange={handleChange} placeholder="Falls back to Site Title" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Logo URL</label>
                <input type="text" name="org_logo_url" value={settings.org_logo_url} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
                <input type="text" name="geo_latitude" value={settings.geo_latitude} onChange={handleChange} placeholder="e.g. 27.9876" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
                <input type="text" name="geo_longitude" value={settings.geo_longitude} onChange={handleChange} placeholder="e.g. 76.5432" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sitewide Custom JSON-LD (advanced)</label>
              <textarea name="custom_json_ld_global" value={settings.custom_json_ld_global} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-y font-mono text-xs" placeholder='{"@context": "https://schema.org", "@type": "Thing", ...}' />
            </div>
          </TabsContent>

          <TabsContent value="robots" className="space-y-4">
            <p className="text-sm text-gray-500">
              Leave blank to auto-generate a default robots.txt (disallows /admin and /api, links to the sitemap). Paste content below to override it completely.
            </p>
            <textarea
              name="robots_txt_override"
              value={settings.robots_txt_override}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-y font-mono text-xs"
              placeholder={"User-agent: *\nDisallow: /admin\nAllow: /\n\nSitemap: https://yourdomain.com/sitemap.xml"}
            />
          </TabsContent>
        </Tabs>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
