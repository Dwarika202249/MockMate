import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiMic, FiVideo, FiSmile } from 'react-icons/fi';

const PreparationScreen = ({ onReady, interviewData }) => {
    const [countdown, setCountdown] = useState(5);
    const [tips] = useState([
        {
            icon: <FiSmile className="w-6 h-6" />,
            text: "Maintain a positive and professional attitude"
        },
        {
            icon: <FiMic className="w-6 h-6" />,
            text: "Speak clearly and at a moderate pace"
        },
        {
            icon: <FiVideo className="w-6 h-6" />,
            text: "Keep good eye contact with the camera"
        }
    ]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            onReady();
        }
    }, [countdown, onReady]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full mx-4 text-center bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-[0_12px_48px_rgba(168,85,247,0.12)]"
            >
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 mb-6">
                    Preparing Your Interview
                </h2>
                
                <div className="bg-white/5 p-6 rounded-2xl">
                    <div className="flex justify-center mb-6">
                        <motion.div 
                            className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-4xl font-bold text-white"
                            animate={{
                                scale: [1, 1.08, 1],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                            }}
                        >
                            {countdown}
                        </motion.div>
                    </div>
                    
                    <p className="text-gray-300 text-lg mb-4">
                        Your interview will begin in {countdown} seconds
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        {tips.map((tip, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 }}
                                className="p-4 rounded-xl flex items-center space-x-3 bg-white/5 border border-purple-500/10"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                                    {tip.icon}
                                </div>
                                <p className="text-gray-300 text-sm">
                                    {tip.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="text-gray-400 text-sm mt-6">
                    <FiClock className="inline mr-2" />
                    Expected duration: {interviewData.preferences.duration} minutes
                </div>
            </motion.div>
        </div>
    );
};

export default PreparationScreen;