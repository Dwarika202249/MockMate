import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { FiUser, FiBriefcase, FiSettings, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';

const OnboardingModal = ({ onClose, onStart, resumeData }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        jobRole: resumeData?.jobRole || '',
        experience: resumeData?.yearsOfExperience || resumeData?.experience?.length?.toString() || '',
        name: resumeData?.name || '',
        preferences: {
            interviewStyle: 'standard',
            difficulty: 'medium',
            duration: '30',
            focusAreas: [],
            communicationStyle: 'professional',
            interviewerPersonality: 'friendly'
        }
    });

    // Update form data when resumeData changes (after async fetch)
    useEffect(() => {
        if (resumeData) {
            console.log('📋 Updating form with resumeData:', resumeData);
            setFormData(prev => ({
                ...prev,
                jobRole: resumeData.jobRole || prev.jobRole,
                experience: resumeData.yearsOfExperience || resumeData.experience?.length?.toString() || prev.experience,
                name: resumeData.name || prev.name
            }));
        }
    }, [resumeData]);

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

    const validateStep = (currentStep) => {
        switch (currentStep) {
            case 1:
                return formData.name && formData.jobRole && formData.experience;
            case 2:
                return true; // All fields have defaults
            case 3:
                return formData.preferences.focusAreas.length >= 2;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateStep(step)) {
            // You might want to add a proper error notification here
            return;
        }

        if (step < 3) {
            setStep(step + 1);
        } else {
            const finalData = {
                ...formData,
                resumeContext: {
                    skills: resumeData?.skills || [],
                    experience: resumeData?.experience || [],
                    education: resumeData?.education || [],
                    summary: resumeData?.summary || ''
                }
            };
            onStart(finalData);
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
                                Resume Details (Auto-filled)
                            </h2>
                            <div className="bg-green-900 bg-opacity-20 border border-green-700 rounded-lg p-4 mb-4">
                                <p className="text-green-300 text-sm">✓ These details are auto-filled from your resume. You can edit them if needed.</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => updateFormData('name', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#2a1f3e] text-white rounded-lg focus:ring-2 focus:ring-[#9589e6] border border-gray-500 hover:border-green-700 transition-colors"
                                        placeholder="Enter your full name"
                                    />
                                    {resumeData?.name && <p className="text-xs text-green-400 mt-1">✓ From Resume: {resumeData.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        What role are you interviewing for?
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.jobRole}
                                        onChange={(e) => updateFormData('jobRole', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#2a1f3e] text-white rounded-lg focus:ring-2 focus:ring-[#9589e6] border border-gray-500 hover:border-green-700 transition-colors"
                                        placeholder="e.g., Senior Software Engineer"
                                    />
                                    {resumeData?.jobRole && <p className="text-xs text-green-400 mt-1">✓ From Resume: {resumeData.jobRole}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Years of experience
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.experience}
                                        onChange={(e) => updateFormData('experience', e.target.value)}
                                        className="w-full px-4 py-2 bg-[#2a1f3e] text-white rounded-lg focus:ring-2 focus:ring-[#9589e6] border border-gray-500 hover:border-green-700 transition-colors"
                                        placeholder="e.g., 5"
                                    />
                                    {formData.experience && <p className="text-xs text-green-400 mt-1">✓ From Resume</p>}
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
                                        <option value="mixed">Mixed (Technical + Behavioral)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Interviewer Personality
                                    </label>
                                    <select
                                        value={formData.preferences.interviewerPersonality}
                                        onChange={(e) => updateFormData('preferences', { interviewerPersonality: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#2a1f3e] text-white rounded-lg focus:ring-2 focus:ring-[#9589e6]"
                                    >
                                        <option value="friendly">Friendly and Supportive</option>
                                        <option value="neutral">Professional and Neutral</option>
                                        <option value="challenging">Challenging and Direct</option>
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
