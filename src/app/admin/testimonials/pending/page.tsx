"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PendingFeedback {
  id: number;
  name: string;
  experience: string;
  rating: number;
  status: string;
  created_at: string;
}

export default function PendingFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<PendingFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingFeedbacks();
  }, []);

  const fetchPendingFeedbacks = async () => {
    try {
      const res = await fetch("/api/visitor-feedback");
      const data = await res.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveFeedback = async (id: number) => {
    const { error } = await supabase
      .from("website_feedback")
      .update({ status: "approved" })
      .eq("id", id);

    if (!error) {
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    }
  };

  const rejectFeedback = async (id: number) => {
    if (confirm("Delete this feedback?")) {
      const { error } = await supabase
        .from("website_feedback")
        .delete()
        .eq("id", id);

      if (!error) {
        setFeedbacks(feedbacks.filter(f => f.id !== id));
      }
    }
  };

  if (loading) return <div>Loading pending feedbacks...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pending Visitor Feedbacks</h1>
      
      {feedbacks.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg">
          <p className="text-gray-500">No pending feedbacks to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{feedback.name || "Anonymous"}</h3>
                  <div className="flex gap-0.5 my-2">
                    {[...Array(feedback.rating)].map((_, i) => (
                      <span key={i} className="text-amber-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-600">"{feedback.experience}"</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(feedback.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveFeedback(feedback.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => rejectFeedback(feedback.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
