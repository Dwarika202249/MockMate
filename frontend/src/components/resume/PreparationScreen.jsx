import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiMic, FiVideo, FiSmile, FiPlay, FiX } from 'react-icons/fi';

const PreparationScreen = ({ onReady, interviewData, durationMinutes, onCancel }) => {
    const [countdown, setCountdown] = useState(5);
    const displayDuration = durationMinutes ?? interviewData?.preferences?.duration ?? 30;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f0520] bg-opacity-95 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative max-w-3xl w-full mx-auto text-left bg-white/4 backdrop-blur-xl border border-purple-500/10 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_18px_60px_rgba(16,8,32,0.6)] max-h-[90vh] overflow-auto"
                role="dialog"
                aria-modal="true"
                aria-label="Interview preparation"
            >
                <div className="relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 mb-1">
                                Preparing Your Interview
                            </h2>
                            <p className="text-sm text-gray-400">Get ready — we'll begin shortly. You can start immediately or wait for the countdown.</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="text-sm text-gray-400 mr-4">
                                <FiClock className="inline mr-1" /> {displayDuration} min
                            </div>
                            {onCancel && (
                                <button onClick={onCancel} className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/6 text-white border border-white/6">
                                    <FiX className="w-4 h-4" />
                                    <span className="hidden sm:inline">Cancel</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Cancel button for very small screens (top-right) */}
                    {onCancel && (
                        <button onClick={onCancel} className="absolute top-3 right-3 sm:hidden text-white p-2 rounded-lg bg-white/6 border border-white/6 z-30">
                            <FiX className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center min-h-0">
                    {/* Responsive preparation layout */}
                    <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start space-y-3 min-h-0">
                        <motion.div 
                            className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-4xl sm:text-5xl md:text-5xl font-bold text-white flex-shrink-0"
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ duration: 1.1, repeat: Infinity }}
                            aria-hidden
                        >
                            <span className="sr-only">Countdown</span>
                            {countdown}
                        </motion.div>

                        <div className="mt-2 text-center md:text-left text-gray-300 text-sm">
                            <div className="text-sm">Your interview will begin in</div>
                            <div className="text-lg sm:text-xl md:text-2xl font-semibold text-white mt-1">{countdown} seconds</div>
                        </div>

                        <div className="mt-3 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => onReady()}
                                className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-lg hover:brightness-105 transition"
                            >
                                <FiPlay /> Start now
                            </button>

                            {onCancel && (
                                <button
                                    onClick={onCancel}
                                    className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-200 hover:bg-white/6 transition"
                                >
                                    <FiX /> Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex flex-col min-h-0">
                        <div className="flex flex-col md:flex-row gap-3 items-stretch justify-between">
                            {tips.map((tip, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    className="p-3 sm:p-4 rounded-xl flex items-start space-x-3 bg-white/3 border border-purple-500/6 flex-1 min-w-0"
                                >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                                        {tip.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{index === 0 ? 'Be confident' : (index === 1 ? 'Speak clearly' : 'Keep eye contact')}</p>
                                        <p className="text-gray-300 text-xs sm:text-sm mt-1">{tip.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-6 text-gray-400 text-sm flex items-center gap-2">
                            <FiClock className="inline" /> Expected duration: <span className="ml-2 text-white font-medium">{displayDuration} minutes</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PreparationScreen;