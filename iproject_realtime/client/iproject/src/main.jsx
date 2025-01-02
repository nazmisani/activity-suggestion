import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./app/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "toastify-js/src/toastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId="175831432963-4qn2aum7rsseo2he1gcra0npu579ic1h.apps.googleusercontent.com"
      redirectUri="http://localhost:5173"
    >
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
