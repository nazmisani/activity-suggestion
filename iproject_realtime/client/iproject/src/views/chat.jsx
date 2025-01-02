import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Toastify from "toastify-js";

export default function Chat({ socket }) {
  const [messageSent, setMessageSent] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (messageSent.trim()) {
      socket.emit("message:new", messageSent);
      setMessageSent("");
    }
  }

  useEffect(() => {
    if (!localStorage.username) {
      navigate("/profile-add");
      Toastify({
        text: "Please complete your profile first before proceeding.",
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
  }, []);

  useEffect(() => {
    socket.auth = {
      username: localStorage.username,
    };
    socket.connect();

    socket.on("message:update", (newMessage) => {
      setMessages((current) => [...current, newMessage]);
    });

    return () => {
      socket.off("message:update");
      socket.disconnect();
    };
  }, [socket]);

  return (
    <>
      <main className="flex-grow flex flex-col p-6 space-y-4 min-h-screen">
        <div className="flex-grow bg-white border-4 border-black rounded-md shadow-brutal p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.from === localStorage.username
                  ? "flex justify-end mb-4"
                  : "flex justify-start mb-4"
              }
            >
              <div
                className={
                  msg.from === localStorage.username
                    ? "w-96 bg-gradient-to-br from-green-200 to-teal-300 border-2 border-black rounded-lg p-3"
                    : "w-96 bg-gradient-to-br from-blue-200 to-indigo-300 border-2 border-black rounded-lg p-3"
                }
              >
                <p className="text-sm text-gray-600 font-bold mb-1">
                  {msg.from === localStorage.username ? "You" : msg.from}
                </p>
                <p className="text-black break-words">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            value={messageSent}
            onChange={(e) => setMessageSent(e.target.value)}
            type="text"
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <button className="px-4 py-2 bg-purple-300 text-black font-bold border-2 border-black rounded-md shadow-brutal hover:bg-purple-400">
            Send
          </button>
        </form>
      </main>
    </>
  );
}
