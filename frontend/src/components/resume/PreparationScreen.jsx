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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f2e]">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full mx-4 text-center"
            >
                <h2 className="text-3xl font-bold text-[#9589e6] mb-8">
                    Preparing Your Interview
                </h2>
                
                <div className="bg-[#2a1f3e] rounded-xl p-6 mb-8">
                    <div className="flex justify-center mb-6">
                        <motion.div 
                            className="w-24 h-24 rounded-full bg-[#9589e6] flex items-center justify-center text-3xl font-bold text-white"
                            animate={{
                                scale: [1, 1.2, 1],
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
                                transition={{ delay: index * 0.2 }}
                                className="bg-[#1a0f2e] p-4 rounded-lg flex items-center space-x-3"
                            >
                                <div className="text-[#9589e6]">
                                    {tip.icon}
                                </div>
                                <p className="text-gray-300 text-sm">
                                    {tip.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="text-gray-400 text-sm">
                    <FiClock className="inline mr-2" />
                    Expected duration: {interviewData.preferences.duration} minutes
                </div>
            </motion.div>
        </div>
    );
};

export default PreparationScreen;