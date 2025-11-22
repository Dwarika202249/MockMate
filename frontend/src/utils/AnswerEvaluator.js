const FILLER_WORDS = new Set([
  'um', 'uh', 'like', 'you know', 'sort of', 'kind of', 'basically',
  'actually', 'literally', 'honestly', 'seriously'
]);

const CONFIDENCE_INDICATORS = new Set([
  'experience', 'expertise', 'successful', 'achieved', 'implemented',
  'managed', 'developed', 'created', 'led', 'improved'
]);

const AnswerEvaluator = {
  evaluateLocally: (transcript = "", context = {}) => {
    const { keywords = [], duration = 120 } = context;
    const text = (transcript || "").toLowerCase();
    const words = text.split(/\W+/).filter(Boolean);
    const unique = new Set(words);
    const totalKeywords = keywords.length || 0;
    
    // Calculate various metrics
    const metrics = {
      // Keyword matching
      keywordMatches: keywords.filter(k => {
        const kk = k.toLowerCase();
        return text.includes(kk) || unique.has(kk);
      }).length,
      
      // Answer length and pacing
      wordCount: words.length,
      wordsPerMinute: (words.length / duration) * 60,
      
      // Filler word usage
      fillerWords: words.filter(w => FILLER_WORDS.has(w)).length,
      
      // Confidence indicators
      confidenceMarkers: words.filter(w => CONFIDENCE_INDICATORS.has(w)).length
    };

    // Score components
    const scores = {
      keywords: metrics.keywordMatches / totalKeywords || 0,
      length: Math.min(1, metrics.wordCount / (duration * 2)), // Expect 2 words per second
      clarity: Math.max(0, 1 - (metrics.fillerWords / metrics.wordCount)),
      confidence: Math.min(1, metrics.confidenceMarkers / 5) // Cap at 5 confidence markers
    };

    // Calculate weighted final score
    const finalScore = Math.round(
      (scores.keywords * 0.4 +
       scores.length * 0.2 +
       scores.clarity * 0.2 +
       scores.confidence * 0.2) * 100
    );

    // Determine response quality
    let label = "Needs Improvement";
    if (finalScore > 85) label = "Excellent";
    else if (finalScore > 70) label = "Good";
    else if (finalScore > 50) label = "Okay";

    // Generate insights
    const strengths = [];
    const improvements = [];

    if (scores.keywords > 0.7) strengths.push("Strong use of relevant keywords");
    if (scores.clarity > 0.8) strengths.push("Clear and concise communication");
    if (scores.confidence > 0.7) strengths.push("Confident tone and delivery");

    if (scores.keywords < 0.5) improvements.push("Include more relevant keywords");
    if (metrics.fillerWords > metrics.wordCount * 0.1) improvements.push("Reduce filler words");
    if (scores.length < 0.4) improvements.push("Provide more detailed answers");

    return {
      score: finalScore,
      label,
      metrics,
      strengths,
      improvements,
      needsGeminiEvaluation: finalScore < 40 || finalScore > 90 // Extreme scores get AI review
    };
  },

  getQuickFeedback: (evaluation) => {
    const { label, score, strengths = [], improvements = [] } = evaluation;
    let feedback = `${label} (${score}/100). `;
    
    if (strengths.length) feedback += `Strengths: ${strengths[0]}. `;
    if (improvements.length) feedback += `Tip: ${improvements[0]}.`;
    
    return feedback.trim();
  }
};

export default AnswerEvaluator;
