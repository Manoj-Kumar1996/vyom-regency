"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, CheckCircle, Clock, XCircle, ArrowLeft, Star, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface VisitorFeedback {
  id: number;
  name: string;
  experience: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export default function VisitorFeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<VisitorFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("website_feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch Error:", error);
        toast.error("Data load nahi ho pa raha: " + error.message);
        throw error;
      }
      
      console.log("Fetched Data:", data); // Debugging ke liye
      setFeedbacks(data || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("website_feedback")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Feedback ${status} successfully`);
      fetchFeedbacks();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this feedback?")) {
      const { error } = await supabase
        .from("website_feedback")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Delete failed");
      } else {
        toast.success("Deleted successfully");
        fetchFeedbacks();
      }
    }
  };

  const filteredFeedbacks = feedbacks.filter(fb => 
    filter === "all" ? true : fb.status === filter
  );

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter(fb => fb.status === "pending").length,
    approved: feedbacks.filter(fb => fb.status === "approved").length,
    rejected: feedbacks.filter(fb => fb.status === "rejected").length,
  };

  if (loading && feedbacks.length === 0) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 mb-2">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Visitor Feedback Management</h1>
          <p className="text-gray-500 text-sm">Review and manage website visitor feedback</p>
        </div>
        <button 
          onClick={fetchFeedbacks}
          className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
          <p className="text-gray-500 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === "all" ? "bg-green-700 text-white shadow-md" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
        >
          All ({stats.total})
        </button>
        <button 
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${filter === "pending" ? "bg-amber-600 text-white shadow-md" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
        >
          <Clock size={16} /> Pending ({stats.pending})
        </button>
        <button 
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${filter === "approved" ? "bg-green-700 text-white shadow-md" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
        >
          <CheckCircle size={16} /> Approved
        </button>
        <button 
          onClick={() => setFilter("rejected")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${filter === "rejected" ? "bg-red-600 text-white" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
        >
          <XCircle size={16} /> Rejected
        </button>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{loading ? "Loading..." : "No feedback found"}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Rating</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Feedback</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((fb) => (
                <tr key={fb.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {new Date(fb.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">{fb.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < fb.rating ? "text-amber-400 fill-current" : "text-gray-300"} />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                    {fb.experience}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      fb.status === "approved" ? "bg-green-100 text-green-700" :
                      fb.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {fb.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {fb.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(fb.id, "approved")}
                            className="text-green-600 hover:text-green-800"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(fb.id, "rejected")}
                            className="text-red-600 hover:text-red-800"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(fb.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}