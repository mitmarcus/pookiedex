import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Layout from "./components/Layout";
import About from "./pages/About";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/pookiedex" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pokemon/:id" element={<Details />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);
