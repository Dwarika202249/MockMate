import { useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { FaVideoSlash, FaMicrophoneSlash } from "react-icons/fa";
import { FiCpu, FiUser, FiVideo, FiMic } from "react-icons/fi";
import Lottie from "react-lottie-player";
import { motion, AnimatePresence } from "framer-motion";
import { HiVideoCamera, HiMicrophone, HiSparkles } from "react-icons/hi";

const AvatarStage = ({ 
    type = "user",
    speaking = false,
    running = false,
    lottieAI,
    onVideoToggle,
    onAudioToggle,
    audioEnabled = true,
    isUserTurn = false
}) => {
    const [showVideo, setShowVideo] = useState(true);
    const [videoError, setVideoError] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        if (speaking) {
            setAnimationKey(prev => prev + 1);
        }
    }, [speaking]);

    const handleVideoToggle = useCallback(() => {
        setShowVideo(prev => !prev);
        onVideoToggle?.(!showVideo);
    }, [showVideo, onVideoToggle]);

    const renderControls = useCallback(() => {
        return (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleVideoToggle}
                    aria-label="Toggle Video"
                    className={`p-2 rounded-xl ${showVideo ? 'bg-gradient-to-br from-purple-600 to-indigo-600' : 'bg-white/5 border border-purple-500/20'}`}
                >
                    {showVideo ? (
                        <HiVideoCamera className="w-5 h-5 text-white" />
                    ) : (
                        <FaVideoSlash className="w-5 h-5 text-white" />
                    )}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onAudioToggle?.(!audioEnabled)}
                    aria-label="Toggle Microphone"
                    className={`p-2 rounded-xl ${audioEnabled ? 'bg-gradient-to-br from-green-500 to-teal-400' : 'bg-white/5 border border-purple-500/20'}`}
                >
                    {audioEnabled ? (
                        <HiMicrophone className="w-5 h-5 text-white" />
                    ) : (
                        <FaMicrophoneSlash className="w-5 h-5 text-white" />
                    )}
                </motion.button>
            </div>
        );
    }, [showVideo, audioEnabled, onAudioToggle, handleVideoToggle]);

    if (type === "ai") {
        return (
            <div className="flex flex-col items-center">
                {speaking && (
                    <motion.div
                        key={animationKey}
                        initial={{ scale: 1 }}
                        animate={{ 
                            scale: [1, 1.05, 1],
                            transition: { duration: 0.8, repeat: Infinity }
                        }}
                        className="relative"
                    >
                        {lottieAI ? (
                            <div className="relative w-80 h-80 rounded-full overflow-hidden bg-white/5 backdrop-blur-xl border-4 border-purple-500/20 shadow-[0_8px_32px_rgba(168,85,247,0.06)]">
                                <Lottie 
                                    play={true} 
                                    loop 
                                    animationData={lottieAI} 
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        ) : (
                            <div className="w-80 h-80 rounded-full bg-white/5 border-4 border-purple-500/20 flex items-center justify-center shadow-[0_8px_32px_rgba(168,85,247,0.06)]">
                                <FiCpu className="w-24 h-24 text-purple-300" />
                            </div>
                        )}
                    </motion.div>
                )}
                {!speaking && (
                    <div className="relative">
                        {lottieAI ? (
                            <div className="relative w-80 h-80 rounded-full overflow-hidden bg-white/5 backdrop-blur-xl border-4 border-purple-500/20 shadow-[0_8px_32px_rgba(168,85,247,0.06)]">
                                <Lottie 
                                    play={false} 
                                    loop 
                                    animationData={lottieAI} 
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        ) : (
                            <div className="w-80 h-80 rounded-full bg-white/5 border-4 border-purple-500/20 flex items-center justify-center shadow-[0_8px_32px_rgba(168,85,247,0.06)]">
                                <FiCpu className="w-24 h-24 text-purple-300" />
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-4 text-lg font-medium text-white">AI Interviewer</div>
                {speaking && (
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="mt-2 h-1 w-24 bg-gradient-to-r from-purple-400 to-indigo-300 rounded-full"
                    />
                )}
            </div>
        );
    }

    // User Avatar
    return (
        <div className="flex flex-col items-center">
            {speaking && (
                <motion.div
                    animate={{ 
                        y: [0, -4, 0],
                        transition: { duration: 0.9, repeat: Infinity }
                    }}
                    className="relative"
                >
                    <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-purple-500/20 bg-white/5 shadow-[0_8px_32px_rgba(168,85,247,0.06)]">
                        <AnimatePresence mode="wait">
                            {showVideo && running && !videoError ? (
                                <motion.div
                                    key="webcam"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full"
                                >
                                    <Webcam
                                        audio={false}
                                        mirrored
                                        className="w-full h-full object-cover"
                                        onUserMediaError={() => setVideoError(true)}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <FiUser className="w-24 h-24 text-purple-300" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {running && renderControls()}
                    </div>
                </motion.div>
            )}
            {!speaking && (
                <div className="relative">
                    <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-purple-500/20 bg-white/5 shadow-[0_8px_32px_rgba(168,85,247,0.06)]">
                        <AnimatePresence mode="wait">
                            {showVideo && running && !videoError ? (
                                <motion.div
                                    key="webcam"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full"
                                >
                                    <Webcam
                                        audio={false}
                                        mirrored
                                        className="w-full h-full object-cover"
                                        onUserMediaError={() => setVideoError(true)}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    <FiUser className="w-24 h-24 text-purple-300" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {running && renderControls()}
                    </div>
                </div>
            )}
            <div className="mt-4 text-lg font-medium text-white">You</div>
            {speaking && (
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="mt-2 h-1 w-24 bg-gradient-to-r from-purple-400 to-indigo-300 rounded-full"
                />
            )}
        </div>
    );
};

export default AvatarStage;