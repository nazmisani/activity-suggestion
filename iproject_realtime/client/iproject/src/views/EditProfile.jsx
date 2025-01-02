import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Toastify from "toastify-js";
import { base_url } from "../api";

export default function EditProfile() {
  const [profile, setProfile] = useState({});
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  async function fetchProfile() {
    try {
      const { data } = await axios.get(`${base_url}/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      setProfile(data.profile);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("gender", gender);

      if (file) {
        formData.append("file", file);
      }

      const { data } = await axios.put(`${base_url}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });

      navigate("/profile-read");

      Toastify({
        text: "Succeed edit profile",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#34D399",
          color: "black",
          border: "solid #000000",
          borderRadius: "8px",
          boxShadow: "2px 2px black",
        },
      }).showToast();
    } catch (error) {
      console.error(error);

      Toastify({
        text: error.response?.data?.message || "Failed to edit profile",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#F87171",
          color: "black",
          border: "solid #000000",
          borderRadius: "8px",
          boxShadow: "2px 2px black",
        },
      }).showToast();
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile && ["image/png", "image/jpeg"].includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      Toastify({
        text: "Please upload a valid image file (PNG or JPEG).",
        duration: 3000,
        style: { background: "#F87171", color: "black" },
      }).showToast();
    }
  }

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setGender(profile.gender);
    }
  }, [profile]);

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-100 min-h-screen flex items-center justify-center">
      <main className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">Edit Profile</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-yellow-200 to-orange-300 border-4 border-black rounded-md p-6 shadow-brutal"
        >
          <div className="mb-4">
            <label htmlFor="username" className="block text-black font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 border-2 border-black rounded-md shadow-inner focus:outline-none"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="block text-black font-bold mb-2">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full px-4 py-2 border-2 border-black rounded-md shadow-inner focus:outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="" disabled>
                Select your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="file" className="block text-black font-bold mb-2">
              Upload New Image
            </label>
            <input
              type="file"
              id="file"
              name="file"
              className="w-full px-4 py-2 border-2 border-black rounded-md shadow-inner focus:outline-none"
              onChange={handleFileChange}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-300 border-2 border-black rounded-md font-bold text-black shadow-brutal hover:bg-blue-400"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
}
