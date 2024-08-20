import React, { useRef, useState } from 'react';

const VideoRecorder = ({ onSave }) => {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const startRecording = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      // console.log("Devices:", devices);
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      // console.log("Video Devices:", videoDevices);

      if (videoDevices.length === 0) {
        throw new Error("No video devices found");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      videoRef.current.srcObject = stream;

      const options = { mimeType: 'video/webm; codecs=vp9' };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();

      setRecording(true);
    } catch (error) {
      console.error("Error starting video recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());

    setRecording(false);
    saveRecording(); // Save the recording after stopping
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.current.push(event.data);
    }
  };

  const saveRecording = () => {
    const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    setVideoUrl(url);

    // Optionally, call a save callback to handle the video file
    if (onSave) {
      onSave(blob);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <video ref={videoRef} autoPlay className="rounded-lg shadow-md mb-4"></video>
      <div className="flex space-x-2">
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Start Video
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Stop Video
          </button>
        )}
        {videoUrl && (
          <a
            href={videoUrl}
            download="interview-recording.webm"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Download Recording
          </a>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
