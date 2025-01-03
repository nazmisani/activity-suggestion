import axios from "axios";
import { useState } from "react";
import { base_url } from "../api";

export default function Generate() {
  const [activity, setActivity] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const data = await axios.get(`${base_url}/generate-activity`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (data.status === 200 && data.data) {
        setActivity(data.data);
      } else {
        throw new Error("Unexpected data from the server");
      }
    } catch (err) {
      setError("Failed to generate activity. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!activity) {
      setError("No activity to save.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await axios.post(
        `${base_url}/activity`,
        { name: activity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setActivity("");
    } catch (err) {
      setError("Failed to save activity. Please try again later.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-yellow-100 to-pink-100 text-black font-sans min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white border-4 border-black rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-black mb-10 text-center">AI Activity Generator</h1>
        <div className="bg-gradient-to-br from-yellow-200 to-pink-200 border-4 border-black rounded-lg p-6 mb-8 shadow-md">
          <p id="activityResult" className="text-lg text-center">
            {loading
              ? "Generating activity..."
              : activity || "Click 'Generate' to get an activity suggestion!"}
          </p>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
        <div className="flex justify-center space-x-6">
          <button
            className="px-6 py-3 bg-yellow-400 text-black font-bold border-2 border-black rounded-md shadow-lg hover:bg-yellow-500 hover:border-yellow-500 transition duration-300"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          <button
            className={`px-6 py-3 ${
              activity
                ? "bg-pink-400 hover:bg-pink-500 hover:border-pink-500"
                : "bg-gray-300 cursor-not-allowed"
            } text-black font-bold border-2 border-black rounded-md shadow-lg transition duration-300`}
            onClick={handleSave}
            disabled={!activity || saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
