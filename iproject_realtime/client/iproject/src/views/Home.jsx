import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAsync } from "../features/activity/activity-slicer";
import { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "../api";

export default function Home() {
  const { activity, loading, error } = useSelector((state) => state.activity);
  const [profile, setProfile] = useState("");
  const dispatch = useDispatch();

  async function fetchProfile() {
    try {
      const { data } = await axios.get(`${base_url}/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      console.log("home>>>>>>>", data.profile.username);
      setProfile(data.profile.username);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!localStorage.username) {
      localStorage.setItem("username", profile);
    }
  }, [profile]);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    dispatch(fetchAsync());
  }, []);

  useEffect(() => {
    if (error) {
      Toastify({
        text: error,
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#EF4C54",
          color: "#17202A",
          boxShadow: "0 5px 10px black",
          fontWeight: "bold",
        },
      }).showToast();
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-100 to-pink-100 min-h-screen flex flex-col items-center">
      <main className="px-6 py-8">
        <h1 className="text-4xl font-bold text-black mb-20 text-center">Favorite Activity</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {activity && activity.length > 0 ? (
            activity.map((item) => <Card key={item.id} id={item.id} activity={item.name} />)
          ) : (
            <div className="md:col-start-2 flex justify-center">
              <p className="text-2xl text-center bg-gradient-to-br from-yellow-200 to-pink-200 p-6 rounded-lg shadow-lg border-4 border-black text-black">
                You don't have any activity
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
