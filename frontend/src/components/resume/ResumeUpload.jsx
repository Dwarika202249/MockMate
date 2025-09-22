import { useState, useCallback } from "react";
import axios from "axios";
import { FiUpload, FiFile, FiCheck } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import ResumeReview from "./ResumeReview";
import { toast } from 'react-hot-toast';

const ResumeUpload = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [resumeText, setResumeText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const resumeFile = acceptedFiles[0];
    if (!resumeFile) return;

    setFile(resumeFile);
    setParsedData(null);
    setPdfUrl(null);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("resume", resumeFile);

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
      const localPdfUrl = URL.createObjectURL(resumeFile);

      setParsedData(structuredData);
      setPdfUrl(localPdfUrl);
      setResumeText(rawText);
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      console.error("Upload failed", error);
      toast.error('Failed to upload resume');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="p-6 bg-[#0a061c] rounded-lg">
      <h2 className="text-4xl font-bold mb-6 text-[#9589e6]">
        Upload Your Resume
      </h2>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-[#9589e6] bg-opacity-10 bg-[#9589e6]' : 'border-gray-600 hover:border-[#9589e6]'}
          ${loading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {file ? (
            <>
              <FiFile className="w-12 h-12 text-[#9589e6]" />
              <p className="text-gray-300">{file.name}</p>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#9589e6]" />
                  <span className="text-gray-300">Processing...</span>
                </div>
              ) : (
                <FiCheck className="w-6 h-6 text-green-500" />
              )}
            </>
          ) : (
            <>
              <FiUpload className="w-12 h-12 text-gray-400" />
              <div className="space-y-2">
                <p className="text-xl font-medium text-gray-300">
                  Drop your resume here
                </p>
                <p className="text-sm text-gray-400">
                  or click to select a file
                </p>
                <p className="text-xs text-gray-500">
                  Supported format: PDF
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {loading && (
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-[#9589e6] h-2 rounded-full animate-pulse"></div>
          </div>
          <p className="text-[#9589e6] mt-2 text-center">Analyzing your resume...</p>
        </div>
      )}

      {parsedData && pdfUrl && resumeText && (
        <div className="mt-6">
          <p className="text-green-400 mb-4 flex items-center">
            <FiCheck className="mr-2" />
            Resume analyzed successfully!
          </p>
          <ResumeReview parsedData={parsedData} pdfUrl={pdfUrl} resumeText={resumeText} />
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
