import { useRef, useState } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { jsPDF } from "jspdf";

import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import ResumePreviewModal from "./ResumePreviewModal";
import InterviewPrepModal from "./InterviewPrepModal";
import { useNavigate } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const ResumeReview = ({ parsedData, pdfUrl, resumeText }) => {
  const [editableData, setEditableData] = useState(parsedData);
  const [numPages, setNumPages] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const skillsInputRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const rawText = resumeText;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/resume-parser/save-parsed-resume`,
        { ...editableData, rawText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || 201) {
        setSuccessMessage("✅ Resume saved successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
        return true;
      }
    } catch (error) {
      console.error("Save failed", error);
      setSuccessMessage("❌ Failed to save resume");
      return false;
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(14);
    doc.text("Parsed Resume Details", 10, y);
    y += 10;

    Object.entries(editableData).forEach(([key, value]) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, 10, y);
      y += 7;

      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(value.toString(), 180);
      doc.text(lines, 10, y);
      y += lines.length * 6 + 4;

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save("parsed_resume.pdf");
  };

  const handleStartInterview = () => {
    setShowInterviewModal(false);
    navigate("/resume-interview/123");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-5 px-3">
        {/* Left: Editable Parsed Resume */}
        <div className="w-full md:w-1/2 space-y-3 max-h-[90vh] overflow-y-auto pr-2">
          <div className="sticky top-0 z-10 bg-[#0e031a] pb-2">
            <h2 className="text-lg font-semibold text-white">
              Parsed & Editable Resume Info
            </h2>
          </div>

          {Object.entries(editableData).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <label className="block text-sm font-medium capitalize text-purple-900">
                {key}
              </label>
              {key === "skills" ? (
                <div>
                  <label className="block font-medium capitalize">{key}</label>
                  <div className="flex flex-wrap items-center gap-2 border-b border-white bg-white/5 px-2 py-1 rounded">
                    {Array.isArray(editableData.skills)
                      ? editableData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-purple-900 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                          >
                            {skill}
                            <button
                              onClick={() => {
                                const updated = editableData.skills.filter(
                                  (_, i) => i !== index
                                );
                                setEditableData((prev) => ({
                                  ...prev,
                                  skills: updated,
                                }));
                              }}
                              className="text-white hover:text-gray-300 focus:outline-none"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      : null}

                    {/* Input to add new skill */}
                    <input
                      type="text"
                      ref={skillsInputRef}
                      placeholder="Add skill..."
                      className="bg-transparent text-white text-sm px-1 py-0.5 focus:outline-none flex-1 min-w-[80px]"
                      onKeyDown={(e) => {
                        if (
                          (e.key === "Enter" || e.key === ",") &&
                          e.target.value.trim() !== ""
                        ) {
                          e.preventDefault();
                          const newSkill = e.target.value.trim();
                          const updated = Array.isArray(editableData.skills)
                            ? [...editableData.skills, newSkill]
                            : [newSkill];
                          setEditableData((prev) => ({
                            ...prev,
                            skills: updated,
                          }));
                          e.target.value = "";
                        } else if (
                          e.key === "Backspace" &&
                          e.target.value === "" &&
                          editableData.skills?.length
                        ) {
                          const updated = [...editableData.skills];
                          updated.pop();
                          setEditableData((prev) => ({
                            ...prev,
                            skills: updated,
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <textarea
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  placeholder={`Edit ${key}`}
                  rows={
                    key === "summary" ||
                    key === "experience" ||
                    key === "education"
                      ? 3
                      : 2
                  }
                  className="w-full bg-white/5 text-white border-0 border-b border-white focus:border-b-2 focus:ring-0 focus:outline-none focus:backdrop-blur-sm focus:border-purple-900/80 placeholder:text-white/50 text-sm px-1 py-1"
                />
              )}
            </div>
          ))}
        </div>

        {/* Right: PDF Resume Preview with Pagination */}
        <div className="w-full md:w-1/2 mx-4 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-[#0e031a] pb-2">
            <h2 className="text-xl font-semibold mb-2 text-white">
              Original Resume Preview
            </h2>
          </div>
          <div className="border shadow rounded p-2 space-y-3 bg-[#201d33] text-white">
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
                className="bg-purple-900 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                ⬅ Prev
              </button>

              <p className="text-sm">
                Page <span className="font-bold">{currentPage}</span> of{" "}
                <span className="font-bold">{numPages || "..."}</span>
              </p>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, numPages))
                }
                disabled={currentPage >= numPages}
                className="bg-purple-900 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Next ➡
              </button>
            </div>

            {/* PDF Document */}
            <div className="border shadow rounded p-2 bg-[#0e031a]">
              {/* Zoom Controls */}
              <div className="flex justify-center gap-4 mb-3">
                <button
                  onClick={() =>
                    setZoomLevel((prev) => Math.max(prev - 0.2, 0.6))
                  }
                  className="bg-purple-900 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  ➖
                </button>
                <span className="text-white font-medium">
                  Zoom: {(zoomLevel * 100).toFixed(0)}%
                </span>
                <button
                  onClick={() =>
                    setZoomLevel((prev) => Math.min(prev + 0.2, 2))
                  }
                  className="bg-purple-900 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  ➕
                </button>
              </div>

              {/* PDF Display */}
              <div className="border rounded overflow-auto max-h-[600px]">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={({ numPages }) => {
                    setNumPages(numPages);
                    setCurrentPage(1);
                  }}
                  loading={<p className="text-white">Loading PDF...</p>}
                >
                  <Page
                    pageNumber={currentPage}
                    scale={zoomLevel}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 m-5">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          Preview & Save
        </button>

        <button
          onClick={handleDownloadPDF}
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Download PDF
        </button>
      </div>
      {successMessage && (
        <div className="mt-3 text-green-600 font-medium">{successMessage}</div>
      )}

      // resume preview modal
      <ResumePreviewModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          editableData={editableData}
          onSave={async () => {
            const success = await handleSave();
            if (success) {
              setShowInterviewModal(true);}
            return success;
          }}
        />

      // InterviewPrep Modal
      <InterviewPrepModal
        isOpen={showInterviewModal}
        setIsOpen={setShowInterviewModal}
        onStart={handleStartInterview}
      />
    </>
  );
};

export default ResumeReview;
