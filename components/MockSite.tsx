"use client";
import { useState } from "react";

export default function YCTChatBotBeta() {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback }),
      });
      const data = await res.json();
      console.log("Server response:", data);
      setSubmitted(true);
      setFeedback("");
    } catch (err) {
      console.error("Error submitting feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-700 to-green-900 text-white flex flex-col items-center justify-center px-4">
      <section className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          YCT CHAT BOT <span className="text-yellow-400">BETA TEST</span>
        </h1>
        <p className="text-lg text-green-100 font-black max-w-2xl mx-auto">
          CLICK THE WIDGET ON THE BOTTOM TO TEST 
        </p>
      </section>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg w-full max-w-md"
        >
          <label htmlFor="feedback" className="block font-medium">
            Your Feedback
          </label>
          <p className="pb-3 opacity-70">Let us know what you think about the bot</p>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
            placeholder="Type your thoughts here..."
            className="w-full p-3 rounded-lg bg-white/80 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          { errors &&
            <p className="border border-red-500 p-3 mt-2 text-red-500 font-bold text-center rounded-md">
              This is an error
            </p>
          }
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2
              ${
                loading
                  ? "bg-yellow-400 text-green-800 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 text-green-900"
              }`}
          >
            {loading ? (
              <>
                <span className="h-5 w-5 border-2 border-green-900 border-t-transparent rounded-full animate-spin"></span>
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </form>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg w-full max-w-md text-center animate-fade-in">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Thank you!
          </h2>
          <p className="text-green-100">
            Your feedback has been submitted successfully.
          </p>
        </div>
      )}

      <footer className="mt-12 text-center text-green-200 text-sm">
        Developed by <span className="font-semibold">YDTA AI/ML TEAM</span>
      </footer>
    </main>
  );
}
