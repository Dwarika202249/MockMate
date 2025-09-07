import { useState } from "react";
import Webcam from "react-webcam";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import Lottie from "react-lottie-player";
import { motion } from "framer-motion";

const AvatarStage = ({ type = "user", speaking = false, lottieAI }) => {
  const [showVideo, setShowVideo] = useState(true);

  if (type === "ai") {
    return (
      <motion.div
        animate={speaking ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="flex flex-col items-center"
      >
        {lottieAI ? (
          <Lottie
            play
            loop
            animationData={lottieAI}
            style={{ height: 160, width: 160 }}
          />
        ) : (
          <div className="w-80 h-80 text-3xl rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border">
            AI
          </div>
        )}
        <div className="text-sm text-gray-100 mt-2">AI</div>
      </motion.div>
    );
  }

  // User Avatar
  return (
    <motion.div
      animate={speaking ? { translateY: [0, -4, 0] } : { translateY: 0 }}
      transition={{ duration: 0.9, repeat: Infinity }}
      className="flex flex-col items-center relative"
    >
      <div className="relative w-80 h-80 rounded-full overflow-hidden border bg-black flex items-center justify-center">
        {showVideo ? (
          <Webcam
            audio={false}
            mirrored
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
            alt="User"
            className="w-full h-full object-cover"
          />
        )}

        {/* Toggle button */}
        <button
          onClick={() => setShowVideo(!showVideo)}
          className={`absolute bottom-4 right-18 text-white p-2 rounded-full transition-colors
    ${
      showVideo
        ? "bg-red-500 hover:bg-red-600"
        : "bg-black/60 hover:bg-black/80"
    }`}
        >
          {showVideo ? <FaVideoSlash size={16} /> : <FaVideo size={16} />}
        </button>
      </div>
      <div className="text-sm text-gray-100 mt-2">You</div>
    </motion.div>
  );
};

export default AvatarStage;
