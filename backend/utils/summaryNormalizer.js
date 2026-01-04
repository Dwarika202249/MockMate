const _ = require('lodash');

/**
 * Normalize various summary shapes into the canonical shape used by UI and DB.
 * Ensures arrays are present and derives aggregates from perQuestionFeedback when necessary.
 */
function normalizeSummary(raw = {}) {
  if (!raw || typeof raw !== 'object') return {
    averageScore: 0,
    overallLabel: '',
    keyStrengths: [],
    areasToImprove: [],
    recommendedResources: [],
    perQuestionFeedback: []
  };

  const out = {
    // numeric averages
    averageScore: raw.averageScore ?? raw.overallScore ?? null,
    overallLabel: raw.overallLabel ?? raw.overall_label ?? raw.type ?? '',

    // canonical arrays (prefer already-canonical fields, fallback to common alternatives)
    keyStrengths: Array.isArray(raw.keyStrengths) ? raw.keyStrengths : (Array.isArray(raw.strengths) ? raw.strengths : []),
    areasToImprove: Array.isArray(raw.areasToImprove) ? raw.areasToImprove : (Array.isArray(raw.improvements) ? raw.improvements : []),
    recommendedResources: Array.isArray(raw.recommendedResources) ? raw.recommendedResources : (Array.isArray(raw.recommendations) ? raw.recommendations : []),

    // Keep raw feedback text if present
    feedback: raw.feedback ?? raw.feedbackText ?? raw.feedback_text ?? '',

    // keep per-question detail if present
    perQuestionFeedback: Array.isArray(raw.perQuestionFeedback) ? raw.perQuestionFeedback : (Array.isArray(raw.per_question_feedback) ? raw.per_question_feedback : []),

    // preserve any other useful fields the UI might read later
    technicalScore: raw.technicalScore ?? raw.technical_score ?? null,
    communicationScore: raw.communicationScore ?? raw.communication_score ?? null,
    type: raw.type || null
  };

  // Derive perQuestion aggregates if keyStrengths/areasToImprove are empty
  if ((!out.keyStrengths || out.keyStrengths.length === 0) && out.perQuestionFeedback.length > 0) {
    const collected = out.perQuestionFeedback.flatMap(p => Array.isArray(p.strengths) ? p.strengths : []);
    out.keyStrengths = _.uniq(collected).slice(0, 8);
  }

  if ((!out.areasToImprove || out.areasToImprove.length === 0) && out.perQuestionFeedback.length > 0) {
    const collected = out.perQuestionFeedback.flatMap(p => Array.isArray(p.improvements) ? p.improvements : []);
    out.areasToImprove = _.uniq(collected).slice(0, 8);
  }

  // Safe defaults
  out.keyStrengths = out.keyStrengths || [];
  out.areasToImprove = out.areasToImprove || [];
  out.recommendedResources = out.recommendedResources || [];
  out.perQuestionFeedback = out.perQuestionFeedback || [];

  return out;
}

module.exports = { normalizeSummary };
