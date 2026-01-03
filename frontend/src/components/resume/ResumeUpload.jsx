import { useState, useCallback } from "react";
import axios from "axios";
import { FiUpload, FiFile, FiCheck } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import ResumeReviewModal from "./ResumeReviewModal";
import { toast } from 'react-hot-toast';

const ResumeUpload = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [resumeText, setResumeText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

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
        `${import.meta.env.VITE_API_URL}/resume-parser/upload-resume`,
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
      // Auto-open review modal so review happens in a focused, responsive modal
      setShowReviewModal(true);
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
    <div className="p-6">
      <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Upload Area */}
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">Upload Your Resume</h2>
          <p className="text-gray-300 mb-6">PDF only. We extract skills, experience and suggest role-specific interview questions.</p>

          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-purple-400 bg-white/5' : 'border-purple-500/10 hover:border-purple-400'} ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center space-y-4">
              {file ? (
                <>
                  <FiFile className="w-12 h-12 text-purple-300" />
                  <p className="text-gray-300">{file.name}</p>
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-300" />
                      <span className="text-gray-300">Processing...</span>
                    </div>
                  ) : (
                    <FiCheck className="w-6 h-6 text-green-400" />
                  )}
                </>
              ) : (
                <>
                  <FiUpload className="w-14 h-14 text-purple-300" />
                  <div className="space-y-2">
                    <p className="text-xl font-medium text-gray-300">Drop your resume here</p>
                    <p className="text-sm text-gray-400">or click to select a file</p>
                    <p className="text-xs text-gray-500">Supported format: PDF</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {loading && (
            <div className="mt-4">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full animate-pulse" />
              </div>
              <p className="text-gray-300 mt-2 text-center">Analyzing your resume...</p>
            </div>
          )}
        </div>

        {/* Right: Quick Summary / Preview */}
        <div className="md:col-span-1">
          <div className="p-4 bg-white/5 border border-purple-500/10 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Quick Summary</h3>
            {!parsedData ? (
              <p className="text-sm text-gray-300">Upload a resume to see extracted skills, top experiences, and quick actions.</p>
            ) : (
              <div className="space-y-2 text-sm text-gray-300">
                <div><strong>Name:</strong> {parsedData.name || '—'}</div>
                <div><strong>Top skills:</strong> {(parsedData.skills || []).slice(0,5).join(', ') || '—'}</div>
                <div><strong>Experience:</strong> {parsedData.experience?.length || '—'} roles</div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2">
              <button disabled={!parsedData} onClick={() => setShowReviewModal(true)} className={`py-2 rounded-xl ${parsedData ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'bg-white/5 border border-purple-500/10 text-gray-400 cursor-not-allowed'}`}>Review Parsed Resume</button>
              <button className="py-2 rounded-xl bg-white/5 border border-purple-500/10 text-white">Download PDF</button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white/5 border border-purple-500/10 rounded-lg text-sm text-gray-300">
            <div className="font-medium text-white mb-2">Recent Uploads</div>
            <div className="text-xs">No recent uploads</div>
          </div>
        </div>
      </div>

      {parsedData && pdfUrl && resumeText && (
        <div className="mt-6">
          <div className="p-4 bg-white/5 border border-purple-500/10 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiCheck className="text-green-400" />
              <div className="text-sm text-gray-300">Resume analyzed successfully!</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white" onClick={() => setShowReviewModal(true)}>Open Review</button>
              <button className="px-3 py-2 rounded-lg bg-white/5 border border-purple-500/10 text-white" onClick={() => {
                if (pdfUrl) {
                  const a = document.createElement('a');
                  a.href = pdfUrl;
                  a.download = 'resume.pdf';
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }
              }}>Download</button>
            </div>
          </div>

          <ResumeReviewModal isOpen={showReviewModal} setIsOpen={setShowReviewModal} parsedData={parsedData} pdfUrl={pdfUrl} resumeText={resumeText} />
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
