import { useRef } from "react";
import { useResumeContext } from "../contexts/FetchResumeContext";
import {
  FaCirclePlus,
  FaTrash,
  FaUpload,
  FaDownload,
  FaFloppyDisk,
} from "react-icons/fa6";

/**
 * GeneratorForm
 * - updates context
 * - handles image upload
 * - tags for skills, projects and links
 */
const GeneratorForm = () => {
  const { formData, setFormData } = useResumeContext();
  const fileRef = useRef();

  // Generic change handler. index for experience items.
  function handleChange(e, index = null) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      // If editing experience item
      if (index !== null) {
        const exp = [...prev.experience];
        exp[index] = { ...exp[index], [name]: value };
        return { ...prev, experience: exp };
      }

      // Booleans
      if (type === "checkbox") {
        return { ...prev, [name]: checked };
      }

      // For skills/projects/links: if the input is the tag-input field we store string temporarily, otherwise keep arrays
      if (
        name === "projects_input" ||
        name === "links_input" ||
        name === "skills_input"
      ) {
        // keep ephemeral input state inside context (useful if you want). We'll just store raw string under ephemeral keys.
        return { ...prev, [name]: value };
      }

      // normal
      return { ...prev, [name]: value };
    });
  }

  // Add experience slot
  function addExperience() {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", duration: "", location: "", desc: "" },
      ],
    }));
  }

  // Remove experience slot
  function removeExperience(i) {
    setFormData((prev) => {
      const exp = prev.experience.filter((_, idx) => idx !== i);
      return {
        ...prev,
        experience: exp.length
          ? exp
          : [{ company: "", role: "", duration: "", location: "", desc: "" }],
      };
    });
  }

  // Skills tag add: accepts comma-separated or single
  function addSkillsFromInput() {
    setFormData((prev) => {
      const input = (prev.skills_input || "").trim();
      if (!input) return prev;
      const newTags = input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const unique = Array.from(new Set([...prev.skills, ...newTags]));
      return { ...prev, skills: unique, skills_input: "" };
    });
  }

  // Remove skill
  function removeSkill(idx) {
    setFormData((prev) => {
      const s = prev.skills.filter((_, i) => i !== idx);
      return { ...prev, skills: s };
    });
  }

  // Projects input -> array
  function addProjectsFromInput() {
    setFormData((prev) => {
      const input = (prev.projects_input || "").trim();
      if (!input) return prev;
      const arr = input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const unique = Array.from(new Set([...prev.projects, ...arr]));
      return { ...prev, projects: unique, projects_input: "" };
    });
  }

  // Links input -> array
  function addLinksFromInput() {
    setFormData((prev) => {
      const input = (prev.links_input || "").trim();
      if (!input) return prev;
      const arr = input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const unique = Array.from(new Set([...prev.links, ...arr]));
      return { ...prev, links: unique, links_input: "" };
    });
  }

  // Remove project / link
  function removeProject(i) {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== i),
    }));
  }
  function removeLink(i) {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, idx) => idx !== i),
    }));
  }

  // Image upload (profile photo) - store data URL
  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  // Reset form to defaults
  function resetAll() {
    if (!confirm("Reset all resume fields?")) return;
    setFormData({
      fullName: "",
      title: "",
      location: "",
      gender: "",
      photo: null,
      email: "",
      phone: "",
      links: [],
      summary: "",
      experience: [
        { company: "", role: "", duration: "", location: "", desc: "" },
      ],
      edu1_school: "",
      edu1_degree: "",
      edu1_year: "",
      projects: [],
      skills: [],
      openToWork: false,
      newsletter: false,
      bio: "",
      // ephemeral inputs
      skills_input: "",
      projects_input: "",
      links_input: "",
    });
    if (fileRef.current) fileRef.current.value = "";
  }

  // Export JSON
  function exportJSON() {
    const payload = { ...formData };
    // remove ephemeral inputs
    delete payload.skills_input;
    delete payload.projects_input;
    delete payload.links_input;
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(formData.fullName || "resume").replace(
      /\s+/g,
      "_"
    )}_resume.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: Basic */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">No photo</div>
                )}
              </div>
              <label className="mt-3 inline-flex items-center gap-2 cursor-pointer text-sm text-indigo-600 hover:underline">
                <FaUpload /> <span>Upload photo</span>
                <input
                  ref={fileRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  type="file"
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-6 space-y-3">
              <label className="block text-sm text-gray-600">Full name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 bg-white"
              />

              <label className="block text-sm text-gray-600 mt-2">Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 bg-white"
              />

              <label className="block text-sm text-gray-600 mt-2">
                Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 bg-white"
              />

              <label className="block text-sm text-gray-600 mt-2">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="w-full rounded-md border px-3 py-2 bg-white"
              />

              <label className="block text-sm text-gray-600 mt-2">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                className="w-full rounded-md border px-3 py-2 bg-white"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-600">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-md border px-3 py-2 mt-1 bg-white"
              >
                <option value="">Prefer not to say</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-600">Short bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border px-3 py-2 mt-1 bg-white"
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={exportJSON}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border bg-white hover:bg-gray-50"
              >
                <FaDownload /> Export JSON
              </button>
              <button
                onClick={resetAll}
                className="px-3 py-2 rounded-md border bg-white hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>

          {/* MIDDLE: summary, skills, projects */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm text-gray-600">
                Professional summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border px-3 py-2 bg-white"
              />
            </div>

            {/* Skills as tags */}
            <div className="bg-gray-50 p-4 rounded-md border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Skills</h4>
                <small className="text-xs text-gray-500">
                  press comma or click Add
                </small>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  name="skills_input"
                  value={formData.skills_input || ""}
                  onChange={handleChange}
                  placeholder="e.g. React, Node.js"
                  className="flex-1 rounded-md border px-3 py-2 bg-white"
                />
                <button
                  onClick={addSkillsFromInput}
                  className="px-3 py-2 rounded-md bg-indigo-600 text-white"
                >
                  Add
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {formData.skills.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border"
                  >
                    <span className="text-sm">{s}</span>
                    <button
                      onClick={() => removeSkill(i)}
                      className="text-xs text-indigo-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                {!formData.skills.length && (
                  <p className="text-xs text-gray-400">No skills added</p>
                )}
              </div>
            </div>

            {/* Projects & Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Projects
                  </h4>
                  <small className="text-xs text-gray-500">
                    comma separated
                  </small>
                </div>
                <div className="flex gap-2">
                  <input
                    name="projects_input"
                    value={formData.projects_input || ""}
                    onChange={handleChange}
                    className="flex-1 rounded-md border px-3 py-2 bg-white"
                    placeholder="Project A, Project B"
                  />
                  <button
                    onClick={addProjectsFromInput}
                    className="px-3 py-2 rounded-md bg-indigo-600 text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3">
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {formData.projects.map((p, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span>{p}</span>
                        <button
                          onClick={() => removeProject(i)}
                          className="text-xs text-red-500"
                        >
                          <FaTrash />
                        </button>
                      </li>
                    ))}
                    {!formData.projects.length && (
                      <li className="text-xs text-gray-400">
                        No projects added
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Links</h4>
                  <small className="text-xs text-gray-500">
                    GitHub / Portfolio / LinkedIn
                  </small>
                </div>
                <div className="flex gap-2">
                  <input
                    name="links_input"
                    value={formData.links_input || ""}
                    onChange={handleChange}
                    className="flex-1 rounded-md border px-3 py-2 bg-white"
                    placeholder="https://..."
                  />
                  <button
                    onClick={addLinksFromInput}
                    className="px-3 py-2 rounded-md bg-indigo-600 text-white"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3 flex flex-col gap-1">
                  {formData.links.map((l, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <a
                        href={l}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-indigo-600 hover:underline"
                      >
                        {l}
                      </a>
                      <button
                        onClick={() => removeLink(i)}
                        className="text-xs text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  {!formData.links.length && (
                    <p className="text-xs text-gray-400">No links added</p>
                  )}
                </div>
              </div>
            </div>

            {/* Experience list */}
            <div className="bg-white rounded-md border p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">
                  Experience
                </h4>
                <button
                  onClick={addExperience}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-600 text-white"
                >
                  <FaCirclePlus /> Add
                </button>
              </div>

              <div className="mt-3 space-y-3">
                {formData.experience.map((ex, idx) => (
                  <div key={idx} className="border rounded p-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          name="company"
                          value={ex.company}
                          placeholder="Company"
                          onChange={(e) => handleChange(e, idx)}
                          className="rounded-md border px-2 py-1"
                        />
                        <input
                          name="role"
                          value={ex.role}
                          placeholder="Role"
                          onChange={(e) => handleChange(e, idx)}
                          className="rounded-md border px-2 py-1"
                        />
                        <input
                          name="duration"
                          value={ex.duration}
                          placeholder="duration"
                          onChange={(e) => handleChange(e, idx)}
                          className="rounded-md border px-2 py-1"
                        />
                      </div>
                      <button
                        onClick={() => removeExperience(idx)}
                        className="ml-3 text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="mt-2">
                      <input
                        name="location"
                        value={ex.location}
                        placeholder="Location"
                        onChange={(e) => handleChange(e, idx)}
                        className="w-full rounded-md border px-2 py-1"
                      />
                      <textarea
                        name="desc"
                        value={ex.desc}
                        placeholder="Describe responsibilities / achievements"
                        rows={3}
                        onChange={(e) => handleChange(e, idx)}
                        className="w-full rounded-md border px-2 py-1 mt-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="openToWork"
                  checked={formData.openToWork}
                  onChange={handleChange}
                />
                <span className="text-sm">Open to work</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                />
                <span className="text-sm">Subscribe to tips</span>
              </label>
              <button
                onClick={() => window.print()}
                className="ml-auto px-3 py-2 rounded-md bg-gray-800 text-white inline-flex items-center gap-2"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorForm;
