const { generateQuestionsWithFailover, evaluateAnswerWithFailover, generateSummaryWithFailover } = require('../utils/aiProvider');
const { evaluateAnswerHybrid } = require('../utils/hybridEvaluator');
const Interview = require('../models/InterviewSchema');

// Process question generation jobs
async function processQuestionGeneration(job) {
    const { resumeText, role, numQuestions } = job.data;
    
    try {
        const questions = await generateQuestionsWithFailover(resumeText, role, numQuestions);
        
        // Update interview with generated questions
        if (job.data.interviewId) {
            await Interview.findByIdAndUpdate(job.data.interviewId, {
                questions,
                status: 'ready'
            });
        }
        
        return questions;
    } catch (error) {
        console.error('Error in question generation job:', error);
        throw error;
    }
}

// Process answer evaluation jobs
async function processAnswerEvaluation(job) {
    const { question, transcript, expectedKeywords, resumeContext, interviewId } = job.data;
    
    try {
        const evaluation = await evaluateAnswerHybrid(
            question, 
            transcript, 
            expectedKeywords, 
            resumeContext
        );
        
        // Update interview with evaluation results
        if (interviewId) {
            await Interview.findByIdAndUpdate(
                interviewId,
                { $push: { evaluations: evaluation } }
            );
        }
        
        return evaluation;
    } catch (error) {
        console.error('Error in answer evaluation job:', error);
        throw error;
    }
}

// Process interview summary generation jobs
async function processInterviewSummary(job) {
    const { interviewId } = job.data;
    
    try {
        const interview = await Interview.findById(interviewId)
            .populate('evaluations')
            .exec();
            
        const summary = await generateSummaryWithFailover({
            questions: interview.questions,
            evaluations: interview.evaluations,
            duration: interview.duration,
            type: interview.type
        });
        
        // Update interview with summary
        await Interview.findByIdAndUpdate(interviewId, {
            summary,
            status: 'completed'
        });
        
        return summary;
    } catch (error) {
        console.error('Error in interview summary job:', error);
        throw error;
    }
}

module.exports = {
    processQuestionGeneration,
    processAnswerEvaluation,
    processInterviewSummary
};