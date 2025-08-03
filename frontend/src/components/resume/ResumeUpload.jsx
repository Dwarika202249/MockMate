import { useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import axios from "axios";

const ResumeUpload = ({ onParsedResume }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    setError("");

    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://api.affinda.com/v2/resumes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${import.meta.env.VITE_AFFINDA_KEY}`,
          },
        }
      );

      const parsedData = response.data.data;

      // Extract simplified resume data
      const simplified = {
        name: parsedData.name?.text || "",
        email: parsedData.emails?.[0] || "",
        phone: parsedData.phoneNumbers?.[0] || "",
        summary: parsedData.professionalSummary?.text || "",
        skills: parsedData.skills?.map(s => s.name).join(", ") || "",
        experience: parsedData.workExperience?.map(exp => `${exp.jobTitle} at ${exp.organisation} (${exp.dates?.startDate} - ${exp.dates?.endDate || "Present"})`).join("; ") || "",
        education: parsedData.education?.map(ed => `${ed.accreditation} from ${ed.organization}`).join("; ") || "",
      };

      if (onParsedResume) onParsedResume(simplified);

    } catch (err) {
      console.error("Error uploading resume:", err);
      setError("Failed to parse resume. Try another file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Upload Your Resume</h2>

      <div className="border-dashed border-2 border-gray-300 p-6 text-center">
        {!resumeFile ? (
          <label className="cursor-pointer flex flex-col items-center justify-center">
            <AiOutlineUpload size={50} className="text-gray-400 mb-4" />
            <span className="text-gray-600">Click to upload a resume (PDF/DOC/DOCX)</span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="text-left">
            <p className="text-lg font-semibold text-indigo-600">{resumeFile.name}</p>
            <button
              className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
              onClick={() => setResumeFile(null)}
            >
              Upload Another
            </button>
          </div>
        )}
      </div>

      {loading && <p className="text-sm text-blue-500 mt-4">Parsing your resume, please wait...</p>}
      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ResumeUpload;
