"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Star, Send, CheckCircle2 } from "lucide-react";

const quickTemplates = [
  { id: 1, text: "🏠 Great property, highly recommended!", rating: 5 },
  { id: 2, text: "⭐ Perfect location, value for money", rating: 5 },
  { id: 3, text: "📄 Clear documentation, trustworthy company", rating: 5 },
  { id: 4, text: "🤝 Very supportive staff", rating: 4 },
  { id: 5, text: "💰 Best investment decision ever", rating: 5 },
  { id: 6, text: "🏗️ Quality construction, no compromise", rating: 5 },
  { id: 7, text: "🌳 Perfect farmhouse for weekend getaway", rating: 5 },
  { id: 8, text: "⚡ On-time delivery, professional team", rating: 5 },
  { id: 9, text: "📞 Excellent customer support", rating: 5 },
  { id: 10, text: "🏞️ Beautiful location, peaceful environment", rating: 5 },
];

export default function VisitorFeedback() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customFeedback, setCustomFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"quick" | "custom" | "rating">("quick");

  const handleTemplateSelect = (text: string, ratingValue: number) => {
    setSelectedTemplate(text);
    setRating(ratingValue);
    setFeedbackType("quick");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let message = "";
    if (feedbackType === "quick") {
      message = selectedTemplate;
    } else if (feedbackType === "custom") {
      message = customFeedback;
    } else {
      message = `Rating: ${rating}/5 stars`;
    }

    if (!message && feedbackType !== "rating") {
      toast.error("Please provide some feedback text");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/visitor-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name || "Anonymous Visitor",
          rating,
          experience: message,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Failed to submit feedback");
      }

      setSubmitted(true);
      toast.success("Feedback submitted!", {
        description: "Your feedback will be published after a quick review."
      });
      
      // Reset form
      setSelectedTemplate("");
      setCustomFeedback("");
      setRating(5);
      setName("");
      setFeedbackType("quick");
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error: any) {
      console.error("Submission Error:", error);
      toast.error("Submission failed", {
        description: error.message || "Please check your connection and try again."
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="text-green-600" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-700">We have received your feedback. It will be published shortly after review.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-6 text-green-700 font-semibold hover:underline"
        >
          Submit another feedback?
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-gray-100">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">Share Your Experience</h3>
        <p className="text-gray-500 text-sm">Let us know how you feel about our services</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-1.5 rounded-xl">
        <button
          type="button"
          onClick={() => setFeedbackType("quick")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
            feedbackType === "quick" 
              ? "bg-green-700 text-white shadow-md" 
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          💬 Quick
        </button>
        <button
          type="button"
          onClick={() => setFeedbackType("custom")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
            feedbackType === "custom" 
              ? "bg-green-700 text-white shadow-md" 
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          ✍️ Custom
        </button>
        <button
          type="button"
          onClick={() => setFeedbackType("rating")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
            feedbackType === "rating" 
              ? "bg-green-700 text-white shadow-md" 
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          ⭐ Rating
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name (Optional)</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {feedbackType === "quick" && (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose from the options below:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              {quickTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateSelect(template.text, template.rating)}
                  className={`p-4 text-left rounded-xl border-2 transition-all ${
                    selectedTemplate === template.text
                      ? "border-green-600 bg-green-50 shadow-sm"
                      : "border-gray-100 hover:border-green-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedTemplate === template.text ? "border-green-600 bg-green-600" : "border-gray-300"
                    }`}>
                      {selectedTemplate === template.text && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800">{template.text}</span>
                      <div className="flex gap-0.5 mt-1.5">
                        {[...Array(template.rating)].map((_, i) => (
                          <Star key={i} size={12} className="text-amber-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {feedbackType === "custom" && (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Feedback</label>
            <textarea
              rows={5}
              placeholder="Write your experience here..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              value={customFeedback}
              onChange={(e) => setCustomFeedback(e.target.value)}
              required
            />
          </div>
        )}

        {feedbackType === "rating" && (
          <div className="animate-in slide-in-from-bottom-2 duration-300 text-center p-8 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-600 font-medium mb-4">How many stars would you give us?</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-125 active:scale-95"
                >
                  <Star 
                    size={48} 
                    className={`${star <= rating ? "text-amber-400 fill-current" : "text-gray-300"} transition-colors`} 
                  />
                </button>
              ))}
            </div>
            <p className="text-lg font-bold text-gray-700 mt-4">{rating} / 5 Stars</p>
          </div>
        )}

        {feedbackType !== "rating" && (
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    size={28} 
                    className={`${star <= rating ? "text-amber-400 fill-current" : "text-gray-300"}`} 
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (feedbackType === "quick" && !selectedTemplate) || (feedbackType === "custom" && !customFeedback)}
          className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-all shadow-lg flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Submitting...
            </>
          ) : (
            <>
              <Send size={20} />
              Submit Feedback
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        Your feedback will be displayed on the website after a quick review.
      </p>
    </div>
  );
}
