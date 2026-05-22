import React from "react";
import { Routes, Route } from "react-router-dom";
import SmoothScrollProvider from "./components/SmoothScrollProvider.jsx";
import ScrollProgressBar from "./components/ScrollProgressBar.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";
import SharedProjectPage from "./pages/SharedProjectPage.jsx";

export default function App() {
  return (
    <SmoothScrollProvider>
      <ScrollProgressBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/shared/:token" element={<SharedProjectPage />} />
      </Routes>
    </SmoothScrollProvider>
  );
}