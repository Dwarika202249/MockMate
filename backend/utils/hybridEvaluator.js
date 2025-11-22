const { calculateAnswerScore } = require('./localEvaluator');
const { evaluateAnswerWithFailover } = require('./aiProvider');

// Cache for AI Provider responses
const responseCache = new Map();

// Generate cache key for storing API responses
function generateCacheKey(question, transcript) {
    return `${question}_${transcript}`.replace(/\s+/g, '_');
}

// Hybrid evaluation pipeline
async function evaluateAnswerHybrid(question, transcript, expectedKeywords, resumeContext) {
    try {
        // Step 1: Immediate local evaluation
        const localEvaluation = calculateAnswerScore(transcript, expectedKeywords);
        
        // Step 2: Determine if AI evaluation is needed
        // We'll use AI providers for answers that:
        // - Score very high or very low locally (to verify)
        // - Have medium scores (to get more nuanced feedback)
        const needsAIEvaluation = 
            localEvaluation.score < 40 || 
            localEvaluation.score > 80 || 
            (localEvaluation.score >= 40 && localEvaluation.score <= 60);
            
        let aiEvaluation = null;
        
        if (needsAIEvaluation) {
            // Check cache first
            const cacheKey = generateCacheKey(question, transcript);
            
            if (responseCache.has(cacheKey)) {
                aiEvaluation = responseCache.get(cacheKey);
            } else {
                // Get AI evaluation from failover chain (Groq/Pre-stored)
                aiEvaluation = await evaluateAnswerWithFailover(question, transcript, resumeContext);
                // Cache the response
                responseCache.set(cacheKey, aiEvaluation);
            }
        }
        
        // Step 3: Combine evaluations
        return combineEvaluations(localEvaluation, aiEvaluation);
        
    } catch (error) {
        console.error('Error in hybrid evaluation:', error);
        // Fallback to local evaluation if AI fails
        return {
            ...localEvaluation,
            source: 'local_only',
            error: error.message
        };
    }
}

// Combine local and Gemini evaluations
function combineEvaluations(local, gemini) {
    if (!gemini) {
        return {
            ...local,
            source: 'local_only'
        };
    }
    
    // Weighted combination of scores
    const combinedScore = Math.round(
        (local.score * 0.3) + (Number(gemini.score) * 0.7)
    );
    
    // Combine feedback
    const combinedFeedback = {
        strengths: [
            ...new Set([
                ...local.feedback.strengths,
                ...gemini.strengths
            ])
        ],
        improvements: [
            ...new Set([
                ...local.feedback.improvements,
                ...gemini.improvements
            ])
        ]
    };
    
    return {
        score: combinedScore,
        label: gemini.label,
        metrics: {
            ...local.metrics,
            aiScored: Number(gemini.score)
        },
        feedback: combinedFeedback,
        nextQuestion: gemini.nextQuestion,
        source: 'hybrid'
    };
}

module.exports = {
    evaluateAnswerHybrid
};