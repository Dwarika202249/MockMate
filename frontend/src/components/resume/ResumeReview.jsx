import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { jsPDF } from "jspdf";
import { FiDownload, FiSave } from "react-icons/fi";
import { toast } from "react-hot-toast";

import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import ResumePreviewModal from "./ResumePreviewModal";
import InterviewPrepModal from "./InterviewPrepModal";
import { useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const ResumeReview = ({ parsedData, pdfUrl, resumeText }) => {
  const [editableData, setEditableData] = useState(parsedData);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const skillsInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setEditableData(parsedData);
  }, [parsedData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/resume-parser/save-parsed-resume`,
        {
          ...editableData,
          rawText: resumeText,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Resume saved successfully!");
        return true;
      }
    } catch (error) {
      console.error("Save failed", error);
      toast.error("Failed to save resume");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    // Title
    doc.setFontSize(16);
    doc.setTextColor(33, 33, 33);
    doc.text("Resume Summary", 10, y);
    y += 15;

    // Sections
    const sections = {
      "Personal Information": ["name", "email", "phone", "location"],
      "Professional Summary": ["summary"],
      "Work Experience": ["experience"],
      Education: ["education"],
      Skills: ["skills"],
      "Additional Information": ["certifications", "languages", "projects"],
    };

    Object.entries(sections).forEach(([section, fields]) => {
      if (fields.some((field) => editableData[field])) {
        // Section header
        doc.setFontSize(14);
        doc.setTextColor(66, 66, 66);
        doc.text(section, 10, y);
        y += 7;

        // Section content
        doc.setFontSize(12);
        doc.setTextColor(33, 33, 33);
        fields.forEach((field) => {
          if (editableData[field]) {
            doc.setFont("helvetica", "bold");
            doc.text(
              `${field.charAt(0).toUpperCase() + field.slice(1)}:`,
              15,
              y
            );
            doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(
              editableData[field].toString(),
              175
            );
            y += 7;
            doc.text(lines, 20, y);
            y += lines.length * 6 + 4;
          }
        });
        y += 5;
      }

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save("resume_summary.pdf");
    toast.success("PDF downloaded successfully!");
  };

  const handleStartInterview = async () => {
    if (await handleSave()) {
      setShowInterviewModal(false);
      navigate("/resume-interview/prepare");
    }
  };

  const renderSection = (title, fields) => (
    <div className="space-y-4 bg-[#1a0f2e] p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-[#9589e6]">{title}</h3>
      {fields.map((field) => (
        <div key={field} className="space-y-2">
          <label className="text-sm text-gray-300 capitalize">
            {field.replace(/([A-Z])/g, " $1").trim()}
          </label>
          {field === "summary" || field === "experience" ? (
            <textarea
              name={field}
              value={editableData[field] || ""}
              onChange={handleInputChange}
              className="w-full h-32 px-3 py-2 bg-[#2a1f3e] text-white rounded-lg focus:ring-2 focus:ring-[#9589e6] resize-none"
            />
          ) : (
            <input
              type="text"
              name={field}
              value={editableData[field] || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#2a1f3e] text-white rounded-lg focus:ring-2 focus:ring-[#9589e6]"
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 px-4">
        {/* Left: Editable Parsed Resume */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="sticky top-0 z-10 bg-[#0a061c] pb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#9589e6]">
                Resume Review
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-[#9589e6] text-white rounded-lg hover:bg-[#7c6ed6] transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center px-4 py-2 border border-[#9589e6] text-[#9589e6] rounded-lg hover:bg-[#9589e6] hover:text-white transition-colors"
                >
                  <FiDownload className="mr-2" />
                  Export
                </button>
              </div>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              {["basic", "experience", "education", "skills"].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition-colors ${
                    activeSection === section
                      ? "bg-[#9589e6] text-white"
                      : "bg-[#2a1f3e] text-gray-300 hover:bg-[#3a2f4e]"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {activeSection === "basic" &&
              renderSection("Basic Information", [
                "name",
                "email",
                "phone",
                "location",
                "summary",
              ])}
            {activeSection === "experience" &&
              renderSection("Professional Experience", ["experience"])}
            {activeSection === "education" &&
              renderSection("Education", ["education", "certifications"])}
            {activeSection === "skills" &&
              renderSection("Skills & Expertise", ["skills", "languages"])}
          </div>
        </div>

        {/* Right: PDF Resume Preview */}
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

      {/* Bottom Buttons */}
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

      {/* Resume Preview Modal */}
      <ResumePreviewModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        editableData={editableData}
        onSave={async () => {
          const success = await handleSave();
          if (success) {
            setShowInterviewModal(true);
          }
          return success;
        }}
      />

      {/* Interview Prep Modal */}
      <InterviewPrepModal
        isOpen={showInterviewModal}
        setIsOpen={setShowInterviewModal}
        onStart={handleStartInterview}
      />
    </>
  );
};

export default ResumeReview;
