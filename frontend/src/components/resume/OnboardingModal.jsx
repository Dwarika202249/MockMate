import { motion } from "framer-motion";
import { useState } from 'react';
import { FiUser, FiBriefcase, FiSettings, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';

const OnboardingModal = ({ onClose, onStart }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        jobRole: '',
        experience: '',
        preferences: {
            interviewStyle: 'standard',
            difficulty: 'medium',
            duration: '30',
            focusAreas: []
        }
    });

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: typeof value === 'object' ? { ...prev[field], ...value } : value
        }));
    };

    const focusAreas = [
        'Technical Skills',
        'Problem Solving',
        'System Design',
        'Communication',
        'Leadership',
        'Project Management',
        'Behavioral',
        'Culture Fit'
    ];

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            onStart(formData);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            onClose();
        }
    };

    const toggleFocusArea = (area) => {
        const currentAreas = formData.preferences.focusAreas;
        const newAreas = currentAreas.includes(area)
            ? currentAreas.filter(a => a !== area)
            : [...currentAreas, area];
        
        updateFormData('preferences', { focusAreas: newAreas });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }} 
                className="bg-[#1a0f2e] rounded-xl shadow-xl w-full max-w-2xl p-6 mx-4"
            >
                {/* Progress Bar */}
                <div className="flex mb-8">
                    {[1, 2, 3].map((stepNum) => (
                        <div key={stepNum} className="flex-1">
                            <div className={`h-2 rounded-full transition-colors ${
                                stepNum <= step ? 'bg-[#9589e6]' : 'bg-gray-600'
                            }`} />
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[#9589e6] flex items-center">
                                <FiUser className="mr-2" />
                                Professional Profile
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        What role are you interviewing for?
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.jobRole}
                                        onChange={(e) => updateFormData('jobRole', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#2a1f3e] text-white rounded-lg focus:ring-2 focus:ring-[#9589e6]"
                                        placeholder="e.g., Senior Software Engineer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Years of experience
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.experience}
                                        onChange={(e) => updateFormData('experience', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#2a1f3e] text-white rounded-lg focus:ring-2 focus:ring-[#9589e6]"
                                        placeholder="e.g., 5"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[#9589e6] flex items-center">
                                <FiBriefcase className="mr-2" />
                                Interview Preferences
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Interview Style
                                    </label>
                                    <select
                                        value={formData.preferences.interviewStyle}
                                        onChange={(e) => updateFormData('preferences', { interviewStyle: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#2a1f3e] text-white rounded-lg focus:ring-2 focus:ring-[#9589e6]"
                                    >
                                        <option value="standard">Standard</option>
                                        <option value="behavioral">Behavioral</option>
                                        <option value="technical">Technical</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Difficulty Level
                                    </label>
                                    <select
                                        value={formData.preferences.difficulty}
                                        onChange={(e) => updateFormData('preferences', { difficulty: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#2a1f3e] text-white rounded-lg focus:ring-2 focus:ring-[#9589e6]"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Duration (minutes)
                                    </label>
                                    <select
                                        value={formData.preferences.duration}
                                        onChange={(e) => updateFormData('preferences', { duration: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#2a1f3e] text-white rounded-lg focus:ring-2 focus:ring-[#9589e6]"
                                    >
                                        <option value="15">15 minutes</option>
                                        <option value="30">30 minutes</option>
                                        <option value="45">45 minutes</option>
                                        <option value="60">60 minutes</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[#9589e6] flex items-center">
                                <FiSettings className="mr-2" />
                                Focus Areas
                            </h2>
                            <div className="space-y-4">
                                <p className="text-gray-300">
                                    Select areas you'd like to focus on during the interview
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {focusAreas.map((area) => (
                                        <button
                                            key={area}
                                            onClick={() => toggleFocusArea(area)}
                                            className={`p-3 rounded-lg flex items-center justify-between transition-colors ${
                                                formData.preferences.focusAreas.includes(area)
                                                    ? 'bg-[#9589e6] text-white'
                                                    : 'bg-[#2a1f3e] text-gray-300 hover:bg-[#3a2f4e]'
                                            }`}
                                        >
                                            {area}
                                            {formData.preferences.focusAreas.includes(area) && (
                                                <FiCheck className="ml-2" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center px-6 py-2 bg-[#2a1f3e] text-white rounded-lg hover:bg-[#3a2f4e] transition-colors"
                    >
                        <FiArrowLeft className="mr-2" />
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex items-center px-6 py-2 bg-[#9589e6] text-white rounded-lg hover:bg-[#7c6ed6] transition-colors"
                    >
                        {step === 3 ? 'Start Interview' : 'Next'}
                        <FiArrowRight className="ml-2" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OnboardingModal;
