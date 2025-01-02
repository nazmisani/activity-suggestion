import axios from "axios";
import { base_url } from "../api";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function Nav() {
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  async function fetchProfile() {
    try {
      const { data } = await axios.get(`${base_url}/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });

      setProfile(data.profile);
    } catch {
      setProfile(null);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, [profile]);

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <>
      <nav className="bg-gradient-to-r from-pink-300 to-yellow-300 border-b-4 border-black shadow-brutal px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-black">FunQuest</span>
        </Link>
        {/* Profile and Actions */}
        <div className="flex items-center space-x-4">
          {/* Profile */}
          <Link
            to="/profile-add"
            className="flex items-center space-x-2 px-3 py-2 bg-purple-300 border-2 border-black rounded-md hover:bg-purple-400"
          >
            <img
              src={profile?.imageUrl || "https://via.placeholder.com/30"}
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-black"
            />
            <span className="font-bold text-black">{profile?.username || "Profile"}</span>
          </Link>
          {/* Generate Activity Button */}
          <Link
            to="/generate-activity"
            className="px-4 py-2 bg-yellow-300 text-black font-bold border-2 border-black rounded-md shadow-brutal hover:bg-yellow-400"
          >
            Generate New Activity
          </Link>
          {/* Join Chat Button */}
          <Link
            to="/chat"
            className="px-4 py-2 bg-blue-300 text-black font-bold border-2 border-black rounded-md shadow-brutal hover:bg-blue-400"
          >
            Join Chat
          </Link>
          {/* Logout */}
          <button
            className="px-4 py-2 bg-red-300 text-black font-bold border-2 border-black rounded-md shadow-brutal hover:bg-red-400"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
