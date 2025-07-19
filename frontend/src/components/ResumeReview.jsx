import { useState } from "react";
import { BiEdit } from "react-icons/bi";

const ResumeReview = ({ resumeData, onConfirm }) => {
  const [editableData, setEditableData] = useState(resumeData || {});
  const [additionalPrompt, setAdditionalPrompt] = useState("");

  const handleChange = (e, key) => {
    setEditableData({
      ...editableData,
      [key]: e.target.value,
    });
  };

  const handleConfirm = () => {
    onConfirm({
      resume: editableData,
      additionalPrompt,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Review and Edit Your Resume</h2>

      <div className="space-y-4">
        {Object.keys(editableData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-lg font-semibold text-indigo-500 capitalize">{key}</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editableData[key]}
                onChange={(e) => handleChange(e, key)}
                className="mt-1 p-2 border rounded-lg w-full"
              />
              <BiEdit size={20} className="text-indigo-600" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="text-lg font-semibold text-indigo-500">
          Additional Prompt (optional)
        </label>
        <textarea
          value={additionalPrompt}
          onChange={(e) => setAdditionalPrompt(e.target.value)}
          placeholder="Tell us your job role, domain, level, or anything else to personalize the interview"
          rows={4}
          className="mt-2 p-3 border rounded-lg w-full resize-none"
        />
      </div>

      <button
        onClick={handleConfirm}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded-lg w-full hover:bg-green-600"
      >
        Confirm and Generate Interview
      </button>
    </div>
  );
};

export default ResumeReview;
