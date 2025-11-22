import { useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { FaVideoSlash, FaMicrophoneSlash, FaMicrophone } from "react-icons/fa";
import { FiCpu, FiUser, FiVideo, FiMic } from "react-icons/fi";
import Lottie from "react-lottie-player";
import { motion, AnimatePresence } from "framer-motion";

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
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleVideoToggle}
                    className={`p-2 rounded-full ${showVideo ? 'bg-[#9589e6]' : 'bg-gray-600'}`}
                >
                    {showVideo ? (
                        <FiVideo className="w-6 h-6 text-white" />
                    ) : (
                        <FaVideoSlash className="w-6 h-6 text-white" />
                    )}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onAudioToggle?.(!audioEnabled)}
                    className={`p-2 rounded-full ${audioEnabled ? 'bg-[#9589e6]' : 'bg-gray-600'}`}
                >
                    {audioEnabled ? (
                        <FiMic className="w-6 h-6 text-white" />
                    ) : (
                        <FaMicrophoneSlash className="w-6 h-6 text-white" />
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
                            <div className="relative w-80 h-80 rounded-full overflow-hidden bg-[#2a1f3e] border-4 border-[#9589e6]">
                                <Lottie 
                                    play={true} 
                                    loop 
                                    animationData={lottieAI} 
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        ) : (
                            <div className="w-80 h-80 rounded-full bg-[#2a1f3e] border-4 border-[#9589e6] flex items-center justify-center">
                                <FiCpu className="w-24 h-24 text-[#9589e6]" />
                            </div>
                        )}
                    </motion.div>
                )}
                {!speaking && (
                    <div className="relative">
                        {lottieAI ? (
                            <div className="relative w-80 h-80 rounded-full overflow-hidden bg-[#2a1f3e] border-4 border-[#9589e6]">
                                <Lottie 
                                    play={false} 
                                    loop 
                                    animationData={lottieAI} 
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        ) : (
                            <div className="w-80 h-80 rounded-full bg-[#2a1f3e] border-4 border-[#9589e6] flex items-center justify-center">
                                <FiCpu className="w-24 h-24 text-[#9589e6]" />
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-4 text-lg font-medium text-[#9589e6]">AI Interviewer</div>
                {speaking && (
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="mt-2 h-1 w-24 bg-gradient-to-r from-[#9589e6] to-[#7c6ed6] rounded-full"
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
                    <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-[#9589e6] bg-[#2a1f3e]">
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
                                    <FiUser className="w-24 h-24 text-[#9589e6]" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {running && renderControls()}
                    </div>
                </motion.div>
            )}
            {!speaking && (
                <div className="relative">
                    <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-[#9589e6] bg-[#2a1f3e]">
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
                                    <FiUser className="w-24 h-24 text-[#9589e6]" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {running && renderControls()}
                    </div>
                </div>
            )}
            <div className="mt-4 text-lg font-medium text-[#9589e6]">You</div>
            {speaking && (
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="mt-2 h-1 w-24 bg-gradient-to-r from-[#9589e6] to-[#7c6ed6] rounded-full"
                />
            )}
        </div>
    );
};

export default AvatarStage;