import React, { createContext, useContext, useState } from "react";

export const FetchResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    // ---- Personal details ----
    fullName: "",
    title: "",
    location: "",
    gender: "",
    photo: null, // Profile photo (data URL)

    // ---- Contact ----
    email: "",
    phone: "",
    links: [],

    // ---- Professional summary ----
    summary: "",

    // ---- Experience ----
    experience: [
      { company: "", role: "", duration: "", location: "", desc: "" },
    ],

    // ---- Education ----
    edu1_school: "",
    edu1_degree: "",
    edu1_year: "",

    // ---- Projects & Skills ----
    projects: [],
    skills: [],

    // ---- Preferences ----
    openToWork: false,
    newsletter: false,

    // ---- Extra ----
    bio: "",

    // ---- Ephemeral fields for inputs ----
    skills_input: "",
    projects_input: "",
    links_input: "",
  });

  return (
    <FetchResumeContext.Provider value={{ formData, setFormData }}>
      {children}
    </FetchResumeContext.Provider>
  );
};

export const useResumeContext = () => useContext(FetchResumeContext);
