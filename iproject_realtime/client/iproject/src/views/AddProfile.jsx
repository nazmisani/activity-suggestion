import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Toastify from "toastify-js";
import { base_url } from "../api";

export default function AddProfile() {
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [file, setFile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const { data } = await axios.get(`${base_url}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.access_token}`,
          },
        });

        if (data.profile) {
          setProfileExists(true);
          navigate("/profile-read");
        }
      } catch (error) {
        console.log("error add", error);

        setProfileExists(false);
      }
    };

    checkProfile();
  }, [base_url, navigate]);

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !gender || !file) {
      Toastify({
        text: "Please fill in all fields",
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
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("gender", gender);
      formData.append("file", file);

      const { data } = await axios.post(`${base_url}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/profile-read");

      Toastify({
        text: `Profile created successfully!`,
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
          zIndex: 9999,
        },
      }).showToast();
    } catch (error) {
      let errorMessage = "An unexpected error occurred.";

      if (error.response) {
        errorMessage = error.response?.data?.error;
      }

      Toastify({
        text: errorMessage,
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
          zIndex: 9999,
        },
      }).showToast();
    }
  }

  if (profileExists) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-100 min-h-screen flex items-center justify-center">
      <main className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">Create Profile</h1>
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
              Upload Image
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
            className="w-full px-4 py-2 bg-green-300 border-2 border-black rounded-md font-bold text-black shadow-brutal hover:bg-green-400"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
