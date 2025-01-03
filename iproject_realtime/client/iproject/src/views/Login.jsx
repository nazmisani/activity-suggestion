import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Toastify from "toastify-js";
import Button from "../components/Button";
import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import { base_url } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.access_token) {
      navigate("/");
      Toastify({
        text: "you are already logged in",
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
          zIndex: 100,
        },
      }).showToast();
    }
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${base_url}/login`, { email, password });
      localStorage.setItem("access_token", data.access_token);
      navigate("/");
      Toastify({
        text: "Succeed Login",
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
          zIndex: 100,
        },
      }).showToast();
    } catch (error) {
      console.log(error);

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
          zIndex: 100,
        },
      }).showToast();
    }
  }

  async function googleLogin(codeResponse) {
    try {
      const { data } = await axios.post(`${base_url}/google-login`, null, {
        headers: {
          token: codeResponse.credential,
        },
      });

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("username", data.username);
      console.log("login google", data.username);

      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        Swal.fire({
          icon: "error",
          title: error.response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "An unexpected error occurred.",
        });
      }
    }
  }

  return (
    <>
      <div className="bg-pink-100 flex items-center justify-center min-h-screen">
        <div className="w-[25rem] max-w-screen-sm bg-white p-6 border-4 border-black shadow-brutal">
          <h1 className="text-3xl font-bold text-black text-center mb-4">Login</h1>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-black my-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
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
                required
                className="w-full px-3 py-2 bg-yellow-100 border-2 border-black rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-300"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button nameProp="Login" />
          </form>
          <p className="mt-4 text-center text-sm text-black">
            Don't have an account?
            <Link to="/register" className="text-blue-600 underline ml-1">
              Register
            </Link>
          </p>
          <div className="flex items-center justify-center my-4">
            <div className="h-[1px] bg-gray-300 w-full"></div>
            <span className="px-2 text-sm text-gray-500">OR</span>
            <div className="h-[1px] bg-gray-300 w-full"></div>
          </div>
          <div className="mt-6 flex justify-center items-center">
            <GoogleLogin onSuccess={googleLogin} />
          </div>
        </div>
      </div>
    </>
  );
}
