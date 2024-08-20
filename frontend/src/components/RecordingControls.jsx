import React from "react";

const RecordingControls = ({ listening, onStart, onStop }) => {
  return (
    <button
      onClick={listening ? onStop : onStart}
      className={`py-2 px-4 rounded ${
        listening
          ? "bg-red-500 hover:bg-red-600"
          : "bg-indigo-500 hover:bg-indigo-600"
      } text-white`}
    >
      {listening ? "Stop Recording" : "Start Recording"}
    </button>
  );
};

export default RecordingControls;
