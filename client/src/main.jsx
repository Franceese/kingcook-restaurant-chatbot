import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import App from "./App";
import PaymentSuccess from "./pages/PaymentSuccess";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <BrowserRouter>

    <Routes>

      <Route
        path="/"
        element={<App />}
      />

      <Route
        path="/payment-success"
        element={<PaymentSuccess />}
      />

    </Routes>

  </BrowserRouter>
);