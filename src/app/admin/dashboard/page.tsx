"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [totalRes, todayRes, leadsRes] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", todayStart.toISOString()),
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(10),
      ]);

      setStats({
        total: totalRes.count || 0,
        today: todayRes.count || 0,
      });

      if (leadsRes.data) {
        setLeads(leadsRes.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="animate-spin text-green-700" size={48} />
        <p className="text-gray-500 text-sm font-medium animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between min-h-[110px]">
          <p className="text-gray-500 text-sm font-medium">Total Leads</p>
          <p className="text-3xl font-bold text-green-700 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between min-h-[110px]">
          <p className="text-gray-500 text-sm font-medium">New Today</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{stats.today}</p>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b px-6 py-4 bg-gray-50/50">
          <h2 className="font-semibold text-gray-800 text-sm">Recent Leads (Latest 10)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3.5 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left py-3.5 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-3.5 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-left py-3.5 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
                <th className="text-left py-3.5 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Project</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-sm font-medium">
                    No leads recorded yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead: any) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-6 text-sm text-gray-600">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="py-3.5 px-6 text-sm font-semibold text-gray-900">{lead.name}</td>
                    <td className="py-3.5 px-6 text-sm text-gray-600 font-mono">{lead.phone}</td>
                    <td className="py-3.5 px-6 text-sm">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium inline-block ${
                        lead.source === "exit-popup" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {lead.source === "exit-popup" ? "Exit Popup" : lead.source || "Website"}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-sm text-gray-600 font-medium">{lead.project || "General"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
