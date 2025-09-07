import React from "react";

const EndInterviewModal = ({ onClose, onDashboard, onFeedback }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg p-6 w-96 text-center shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Interview Ended
        </h3>
        <p className="text-sm text-gray-600 mb-6">Choose your next step:</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onDashboard}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
          <button
            onClick={onFeedback}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View Feedback
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 text-sm hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EndInterviewModal;
