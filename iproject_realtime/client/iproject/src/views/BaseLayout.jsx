import { Outlet, useNavigate } from "react-router";
import Nav from "../components/Nav";
import { useEffect } from "react";
import Toastify from "toastify-js";

export default function BaseLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.access_token) {
      navigate("/login");
      Toastify({
        text: "please login first",
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

  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}
