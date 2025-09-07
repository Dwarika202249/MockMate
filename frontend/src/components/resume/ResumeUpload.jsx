import axios from "axios";
import { useState } from "react";
import ResumeReview from "./ResumeReview";

const ResumeUpload = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [resumeText, setResumeText] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setParsedData(null);
    setPdfUrl(null);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/resume-parser/upload-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { structuredData, rawText } = res.data;
      
      const localPdfUrl = URL.createObjectURL(file); // PDF preview

      setParsedData(structuredData);
      setPdfUrl(localPdfUrl);
      setResumeText(rawText);
    } catch (error) {
      console.error("Upload failed", error);
      alert("❌ Resume upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 bg-[#0a061c]">
        <h2 className="text-4xl font-bold mb-4 text-[#9589e6]">
          Upload Your Resume
        </h2>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-4 text-white"
        />

      {loading && <p className="text-blue-500">Uploading & Parsing...</p>}

      {parsedData && pdfUrl && resumeText && (
        <>
          <p className="text-green-300 mb-3">
            ✅ Fetched & parsed successfully!
          </p>
          <ResumeReview parsedData={parsedData} pdfUrl={pdfUrl} resumeText={resumeText} />
        </>
      )}
    </div>
  );
};

export default ResumeUpload;
