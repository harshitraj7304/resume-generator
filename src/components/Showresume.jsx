import React, { useRef } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaBriefcase,
  FaGraduationCap,
} from "react-icons/fa";

import { useResumeContext } from "../contexts/FetchResumeContext";
/**
 * Showresume - professional resume preview (print-friendly)
 */
const Showresume = () => {
  const { formData } = useResumeContext();
  const printRef = useRef();

  const formatDateString = (d) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div
          className="bg-white rounded-xl shadow overflow-hidden"
          ref={printRef}
        >
          {/* ---- Header ---- */}
          <div className="p-6 sm:p-8 border-b">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white text-3xl font-semibold">
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    className="w-full h-full object-cover"
                    alt="pf"
                  />
                ) : (
                  formData.fullName?.[0] || "U"
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {formData.fullName || "Your Name"}
                </h1>
                <p className="text-sm text-gray-600">
                  {formData.title || "Professional Title"}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600 items-center">
                  <span className="inline-flex items-center gap-2">
                    <FaMapMarkerAlt /> {formData.location || "City, Country"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FaEnvelope /> {formData.email || "email@example.com"}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FaPhone /> {formData.phone || "-"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400">Generated</div>
                <div className="mt-1 text-sm text-gray-700">
                  {new Date().toLocaleDateString()}
                </div>
                <div className="mt-4">
                  {formData.openToWork && (
                    <span className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 border">
                      Open to work
                    </span>
                  )}
                  {formData.newsletter && (
                    <span className="ml-2 px-2 py-1 rounded text-xs bg-indigo-50 text-indigo-700 border">
                      Subscribed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {formData.summary && (
              <p className="mt-4 text-gray-700">{formData.summary}</p>
            )}
          </div>

          {/* ---- Main ---- */}
          <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SIDEBAR */}
            <aside className="lg:col-span-1 space-y-4">
              {/* Contact */}
              <div className="bg-gray-50 p-4 rounded border">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Contact
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center gap-2">
                    <FaEnvelope /> {formData.email}
                  </li>
                  <li className="flex items-center gap-2">
                    <FaPhone /> {formData.phone}
                  </li>
                  <li className="flex items-center gap-2">
                    <FaMapMarkerAlt /> {formData.location}
                  </li>
                </ul>
              </div>

              {/* Skills */}
              <div className="bg-gray-50 p-4 rounded border">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm border border-indigo-100"
                    >
                      {s}
                    </span>
                  ))}
                  {!formData.skills.length && (
                    <p className="text-xs text-gray-400">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Location Map */}
              <div className="bg-gray-50 p-4 rounded border">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Location Map
                </h3>
                {formData.location ? (
                  <div className="w-full h-40 rounded overflow-hidden border">
                    <iframe
                      title="map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        formData.location
                      )}&output=embed`}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">
                    Location not specified
                  </p>
                )}
              </div>

              {/* Links */}
              <div className="bg-gray-50 p-4 rounded border">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Links
                </h3>
                <div className="flex flex-col gap-1 text-sm">
                  {formData.links.map((l, i) => (
                    <a
                      key={i}
                      href={l}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline break-words"
                    >
                      {l}
                    </a>
                  ))}
                  {!formData.links.length && (
                    <p className="text-xs text-gray-400">No links</p>
                  )}
                </div>
              </div>
            </aside>

            {/* RIGHT CONTENT */}
            <section className="lg:col-span-2 space-y-5">
              {/* Experience */}
              <div className="bg-white p-4 rounded border">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FaBriefcase /> Experience
                </h2>
                <div className="mt-3 space-y-4">
                  {formData.experience.map((exp, idx) => (
                    <article key={idx} className="border-b pb-3 last:border-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">
                            {exp.role || "Role"}
                          </h3>
                          <p className="text-xs text-gray-500">{exp.company}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {exp.duration}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{exp.desc}</p>
                      {exp.location && (
                        <p className="mt-1 text-xs text-gray-400">
                          {exp.location}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white p-4 rounded border">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FaGraduationCap /> Education
                </h2>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Institution</p>
                    <p className="font-medium">{formData.edu1_school || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Degree</p>
                    <p className="font-medium">{formData.edu1_degree || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="font-medium">{formData.edu1_year || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Projects */}
              <div className="bg-white p-4 rounded border">
                <h2 className="text-lg font-semibold text-gray-800">
                  Projects
                </h2>
                <ul className="mt-3 list-disc pl-5">
                  {formData.projects.length ? (
                    formData.projects.map((p, i) => (
                      <li key={i} className="text-sm">
                        {p}
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-400">No projects</li>
                  )}
                </ul>
              </div>

              {/* About / Bio */}
              <div className="bg-white p-4 rounded border">
                <h2 className="text-lg font-semibold text-gray-800">About</h2>
                <p className="mt-2 text-sm text-gray-700">
                  {formData.bio || "—"}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50"
                >
                  Print / Save as PDF
                </button>
                <a
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(formData, null, 2)
                  )}`}
                  download={`${(formData.fullName || "resume").replace(
                    /\s+/g,
                    "_"
                  )}_resume.json`}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white"
                >
                  Download JSON
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Showresume;
