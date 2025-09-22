const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure the model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Utility function to generate interview questions
async function generateQuestions(resumeText, role, numQuestions = 5) {
    const prompt = {
        system: `You are an expert interviewer for ${role}. Generate ${numQuestions} relevant interview questions based on the candidate's resume.`,
        context: { resume_text: resumeText }
    };

    try {
        const result = await model.generateContent(JSON.stringify(prompt));
        const response = await result.response;
        return JSON.parse(response.text());
    } catch (error) {
        console.error('Error generating questions:', error);
        throw error;
    }
}

// Utility function to evaluate answers
async function evaluateAnswer(question, transcript, resumeContext) {
    const prompt = {
        system: "Expert interviewer and scorer",
        input: {
            question,
            transcript,
            resume_context: resumeContext
        },
        output_schema: {
            score: "0-100",
            label: "Poor|OK|Good|Excellent",
            strengths: [],
            improvements: [],
            nextQuestion: { text: "", expected_keywords: [] }
        }
    };

    try {
        const result = await model.generateContent(JSON.stringify(prompt));
        const response = await result.response;
        return JSON.parse(response.text());
    } catch (error) {
        console.error('Error evaluating answer:', error);
        throw error;
    }
}

// Utility function to generate interview summary
async function generateSummary(interviewData) {
    const prompt = {
        system: "Expert interview analyst",
        input: interviewData,
        output_schema: {
            overall_score: "0-100",
            strengths: [],
            areas_for_improvement: [],
            recommendations: []
        }
    };

    try {
        const result = await model.generateContent(JSON.stringify(prompt));
        const response = await result.response;
        return JSON.parse(response.text());
    } catch (error) {
        console.error('Error generating summary:', error);
        throw error;
    }
}

module.exports = {
    generateQuestions,
    evaluateAnswer,
    generateSummary
};