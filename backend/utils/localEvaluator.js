// Utility functions for local answer evaluation
const FILLER_WORDS = new Set([
    'um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally',
    'sort of', 'kind of', 'i mean', 'well', 'so', 'okay', 'right'
]);

// Calculate basic metrics for an answer
function calculateBasicMetrics(transcript) {
    const words = transcript.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    const fillerWordCount = words.filter(word => FILLER_WORDS.has(word)).length;
    const fillerWordRatio = fillerWordCount / wordCount;
    
    return {
        wordCount,
        fillerWordCount,
        fillerWordRatio
    };
}

// Score answer based on keyword matching
function scoreKeywordMatch(transcript, expectedKeywords) {
    const words = new Set(transcript.toLowerCase().split(/\s+/));
    const matchedKeywords = expectedKeywords.filter(keyword => 
        words.has(keyword.toLowerCase()) || 
        transcript.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return {
        keywordMatchScore: (matchedKeywords.length / expectedKeywords.length) * 100,
        matchedKeywords,
        missingKeywords: expectedKeywords.filter(k => !matchedKeywords.includes(k))
    };
}

// Calculate answer quality score based on various metrics
function calculateAnswerScore(transcript, expectedKeywords) {
    const metrics = calculateBasicMetrics(transcript);
    const keywordMatch = scoreKeywordMatch(transcript, expectedKeywords);
    
    // Scoring weights
    const weights = {
        keywordMatch: 0.5,
        length: 0.3,
        fillerWords: 0.2
    };
    
    // Score components
    const lengthScore = Math.min(100, (metrics.wordCount / 100) * 100); // Optimal length ~100 words
    const fillerPenalty = Math.max(0, 100 - (metrics.fillerWordRatio * 1000)); // Penalize high filler word usage
    
    // Calculate weighted score
    const finalScore = (
        keywordMatch.keywordMatchScore * weights.keywordMatch +
        lengthScore * weights.length +
        fillerPenalty * weights.fillerWords
    );
    
    return {
        score: Math.round(finalScore),
        metrics: {
            ...metrics,
            ...keywordMatch
        },
        feedback: generateLocalFeedback(metrics, keywordMatch)
    };
}

// Generate immediate feedback based on local analysis
function generateLocalFeedback(metrics, keywordMatch) {
    const feedback = {
        strengths: [],
        improvements: []
    };
    
    // Analyze length
    if (metrics.wordCount < 30) {
        feedback.improvements.push("Try to provide more detailed answers");
    } else if (metrics.wordCount > 50) {
        feedback.strengths.push("Good detailed response");
    }
    
    // Analyze filler words
    if (metrics.fillerWordRatio > 0.1) {
        feedback.improvements.push("Try to reduce filler words in your response");
    } else if (metrics.fillerWordRatio < 0.05) {
        feedback.strengths.push("Good clarity in speech");
    }
    
    // Analyze keyword usage
    if (keywordMatch.keywordMatchScore > 70) {
        feedback.strengths.push("Excellent use of relevant technical terms");
    } else if (keywordMatch.missingKeywords.length > 0) {
        feedback.improvements.push(`Consider mentioning these key points: ${keywordMatch.missingKeywords.join(', ')}`);
    }
    
    return feedback;
}

module.exports = {
    calculateAnswerScore,
    calculateBasicMetrics,
    scoreKeywordMatch,
    generateLocalFeedback
};