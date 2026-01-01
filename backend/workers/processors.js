const { generateQuestionsWithFailover, evaluateAnswerWithFailover, generateSummaryWithFailover } = require('../utils/aiProvider');
const { evaluateAnswerHybrid } = require('../utils/hybridEvaluator');
const Interview = require('../models/InterviewSchema');

// Process question generation jobs
async function processQuestionGeneration(job) {
    const { resumeText, role, numQuestions, interviewId, difficulty } = job.data;
    
    try {
        console.log(`\n╔════════════════════════════════════════════════════════╗`);
        console.log(`║       PROCESSING QUESTION GENERATION JOB ${job.id}      ║`);
        console.log(`╚════════════════════════════════════════════════════════╝`);
        console.log(`Interview ID: ${interviewId}`);
        console.log(`Role: ${role}, NumQuestions: ${numQuestions}, Difficulty: ${difficulty || 'medium'}`);
        
        const questions = await generateQuestionsWithFailover(resumeText, role, numQuestions, difficulty || 'medium');
        
        // CRITICAL: Final validation before saving to DB
        const validQuestions = questions.filter(q => typeof q === 'object' && q !== null && q.text);
        
        // Update interview with generated questions
        if (interviewId) {
            // Use native MongoDB to avoid validation issues
            const mongoose = require('mongoose');
            const plainQuestions = JSON.parse(JSON.stringify(validQuestions));
            
            const result = await Interview.collection.updateOne(
                { _id: new mongoose.Types.ObjectId(interviewId) },
                { 
                    $set: { 
                        questions: plainQuestions,
                        status: 'active'
                    } 
                }
            );
            
            console.log(`✅ Updated interview in DB:`, { 
                acknowledged: result.acknowledged,
                modifiedCount: result.modifiedCount 
            });
        }
        
        return questions;
    } catch (error) {
        console.error('❌ Error in question generation job:', error.message);
        console.error('Stack:', error.stack);
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