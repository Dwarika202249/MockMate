const User = require('../models/User');
const CreditEvent = require('../models/CreditEventSchema');

// Credit cost configuration
const CREDIT_COSTS = {
  FREE_INTERVIEW: {
    TOTAL: 10,
    QUESTION_GENERATION: 3,
    ANSWER_EVALUATION: 5, // Total for all answers
    SUMMARY: 2
  },
  RESUME_INTERVIEW: {
    TOTAL: 20,
    QUESTION_GENERATION: 5,
    ANSWER_EVALUATION: 10, // Total for all answers
    SUMMARY: 5
  }
};

/**
 * Check if user has enough credits for an operation
 */
async function checkCredits(userId, requiredCredits) {
  const user = await User.findById(userId).select('credits');
  if (!user) {
    throw new Error('User not found');
  }
  return user.credits >= requiredCredits;
}

/**
 * Atomically consume credits and log the event
 */
async function consumeCredits(userId, amount, reason, meta = {}) {
  try {
    // Atomic debit operation
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: -amount } },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    // Log the credit event
    await CreditEvent.create({
      user: userId,
      type: 'consume',
      amount: -amount,
      balanceAfter: user.credits,
      reason,
      meta
    });

    // Check if low balance notification needed (≤10 credits)
    if (user.credits <= 10 && !user.lowCreditNotificationSent) {
      await User.findByIdAndUpdate(userId, { lowCreditNotificationSent: true });
      // TODO: Send low balance notification
    }

    return {
      success: true,
      balance: user.credits,
      consumed: amount
    };
  } catch (error) {
    console.error('Error consuming credits:', error);
    throw error;
  }
}

/**
 * Get credit cost for an interview type
 */
function getCreditCost(interviewType, operation) {
  const type = interviewType === 'free' ? 'FREE_INTERVIEW' : 'RESUME_INTERVIEW';
  
  if (operation) {
    return CREDIT_COSTS[type][operation] || 0;
  }
  
  return CREDIT_COSTS[type].TOTAL;
}

/**
 * Check if user has enough credits before starting interview
 * For free interviews: requires numQuestions parameter to calculate cost
 */
async function checkInterviewCredits(userId, interviewType, numQuestions = 5) {
  let requiredCredits;
  
  if (interviewType === 'free') {
    // For free interviews: 1 credit per question
    requiredCredits = numQuestions;
  } else {
    // For resume interviews: total cost
    requiredCredits = getCreditCost(interviewType);
  }
  
  const hasEnough = await checkCredits(userId, requiredCredits);
  
  return {
    hasEnough,
    required: requiredCredits,
    balance: hasEnough ? (await User.findById(userId).select('credits')).credits : 0
  };
}

/**
 * Consume credits for question generation
 * For free interviews: 1 credit per question
 * For resume interviews: fixed 5 credits
 */
async function consumeQuestionGenerationCredits(userId, interviewId, interviewType, numQuestions = 5) {
  let amount;
  
  if (interviewType === 'free') {
    // For free interviews: 1 credit per question
    amount = numQuestions;
  } else {
    // For resume interviews: fixed cost
    amount = getCreditCost(interviewType, 'QUESTION_GENERATION');
  }
  
  return await consumeCredits(
    userId,
    amount,
    'AI Question Generation',
    {
      interviewId,
      interviewType,
      operation: 'question_generation',
      numQuestions
    }
  );
}

/**
 * Consume credits for answer evaluation
 */
async function consumeAnswerEvaluationCredits(userId, interviewId, interviewType, questionId) {
  const amount = getCreditCost(interviewType, 'ANSWER_EVALUATION');
  
  return await consumeCredits(
    userId,
    amount,
    'AI Answer Evaluation',
    {
      interviewId,
      interviewType,
      operation: 'answer_evaluation',
      questionId
    }
  );
}

/**
 * Consume credits for summary generation
 */
async function consumeSummaryCredits(userId, interviewId, interviewType) {
  const amount = getCreditCost(interviewType, 'SUMMARY');
  
  return await consumeCredits(
    userId,
    amount,
    'AI Summary Generation',
    {
      interviewId,
      interviewType,
      operation: 'summary_generation'
    }
  );
}

module.exports = {
  CREDIT_COSTS,
  checkCredits,
  consumeCredits,
  getCreditCost,
  checkInterviewCredits,
  consumeQuestionGenerationCredits,
  consumeAnswerEvaluationCredits,
  consumeSummaryCredits
};
