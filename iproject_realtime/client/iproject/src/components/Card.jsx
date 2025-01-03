import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchAsync } from "../features/activity/activity-slicer";
import Toastify from "toastify-js";
import { base_url } from "../api";

export default function Card({ activity, id }) {
  const dispatch = useDispatch();

  async function handleDelete() {
    try {
      await axios.delete(`${base_url}/activity/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });

      dispatch(fetchAsync());
      Toastify({
        text: "Succeed delete activity",
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
        text: error.response.data.message,
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

  return (
    <div className="bg-gradient-to-br from-green-200 to-teal-300 border-4 border-black rounded-md shadow-md p-6 hover:scale-105 transition-transform flex flex-col items-center">
      <h2 className="text-xl font-bold text-black mb-2 text-center w-44">{activity}</h2>
      <button
        onClick={handleDelete}
        className="mt-4 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}
