// src/App.jsx
import React from "react";
import GeneratorForm from "./components/GeneratorForm";
import Showresume from "./components/Showresume";
import "./App.css"; // optional, agar custom styles hain
import { useResumeContext } from "./contexts/FetchResumeContext";
// import LoginPage from "./components/LoginPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Left: Form | Right: Resume Preview */}
      <div className="grid md:grid-cols-2 gap-4 p-6">
        <GeneratorForm />
        <Showresume />
      </div>
    </div>
  );
}
