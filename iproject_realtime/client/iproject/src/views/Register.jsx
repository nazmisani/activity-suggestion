import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Toastify from "toastify-js";
import Button from "../components/Button";
import { base_url } from "../api";
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${base_url}/register`, { email, password });
      navigate("/login");

      Toastify({
        text: "Succeed Register",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
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
      console.log(error);
      Toastify({
        text: error.response.data,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
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

  return (
    <>
      <div className="bg-pink-100 flex items-center justify-center min-h-screen">
        <div className="w-[25rem]  bg-white p-6 border-4 border-black shadow-brutal">
          <h1 className="text-3xl font-bold text-black text-center mb-4">Register</h1>
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-black my-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required=""
                className="w-full px-3 py-2 bg-yellow-100 border-2 border-black rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-300"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-black my-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required=""
                className="w-full px-3 py-2 bg-yellow-100 border-2 border-black rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-300"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button nameProp="Register" />
          </form>
          <p className="mt-4 text-center text-sm text-black">
            Already have an account?
            <Link to="/login" className="text-blue-600 underline ml-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
