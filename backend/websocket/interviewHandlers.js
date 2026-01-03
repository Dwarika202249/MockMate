const mongoose = require('mongoose');
const Interview = require('../models/InterviewSchema');
const { generateQuestionsWithFailover, evaluateAnswerWithFailover, generateSummaryWithFailover } = require('../utils/aiProvider');
const { 
    checkInterviewCredits, 
    consumeQuestionGenerationCredits,
    consumeAnswerEvaluationCredits,
    consumeSummaryCredits 
} = require('../utils/creditManager');

// WebSocket event handlers for interview flow
const interviewHandlers = {
    // Initialize interview session
    INITIALIZE_INTERVIEW: async (io, socket, data) => {
        try {
            const { interviewId, userId } = data;
            
            const interview = await Interview.findById(interviewId)
                .populate('resume')
                .populate('user', 'name email');

            if (!interview) {
                socket.emit('ERROR', { message: 'Interview not found' });
                return;
            }

            // Determine interview type
            const interviewType = interview.type || 'resume';
            
            // Get numQuestions and difficulty from interview preferences
            const numQuestions = interview.preferences?.numQuestions || 5;
            const difficulty = interview.preferences?.difficulty || 'medium';
            
            // Check credits before generating questions (pass numQuestions for free interviews)
            const creditCheck = await checkInterviewCredits(interview.user._id, interviewType, numQuestions);
            
            if (!creditCheck.hasEnough) {
                socket.emit('INSUFFICIENT_CREDITS', {
                    message: 'Insufficient credits to start interview',
                    required: creditCheck.required,
                    balance: creditCheck.balance,
                    interviewType
                });
                return;
            }

            // Join interview-specific room
            socket.join(`interview-${interviewId}`);

            // Generate initial questions if not already done
            if (!interview.questions || interview.questions.length === 0) {
                try {
                    // Atomically mark question generation as requested to prevent double-charging
                    const reserved = await Interview.findOneAndUpdate(
                        { _id: interviewId, questionGenerationConsumed: { $ne: true } },
                        { $set: { questionGenerationConsumed: true } },
                        { new: false }
                    );

                    if (reserved) {
                        // We reserved the generation slot — consume credits and generate questions
                        await consumeQuestionGenerationCredits(
                            interview.user._id,
                            interviewId,
                            interviewType,
                            numQuestions
                        );

                        const questions = await generateQuestionsWithFailover(
                            interview.resume?.summary || interview.details || '',
                            interview.resume?.jobRole || interview.type || 'General',
                            numQuestions,
                            difficulty
                        );
                        
                        if (!questions || questions.length === 0) {
                            throw new Error('No questions returned from AI provider failover');
                        }
                        
                        // Single point of formatting - CRITICAL
                        const formattedQuestions = questions.map((q, idx) => {
                            // Handle if stringified
                            const question = typeof q === 'string' ? JSON.parse(q) : q;
                            
                            return {
                                id: question.id || `q${idx + 1}`,
                                text: question.text || '',
                                type: question.type || question.topic || 'Technical',
                                difficulty: question.difficulty || difficulty || 'medium',
                                expectedKeywords: Array.isArray(question.expectedKeywords) 
                                    ? question.expectedKeywords 
                                    : (Array.isArray(question.expected_keywords) ? question.expected_keywords : []),
                                order: question.order || idx + 1
                            };
                        });

                        // Validate before saving
                        if (!Array.isArray(formattedQuestions) || formattedQuestions.length === 0) {
                            throw new Error('Formatted questions is empty or not an array');
                        }
                        if (typeof formattedQuestions[0] !== 'object') {
                            throw new Error('First question is not an object: ' + typeof formattedQuestions[0]);
                        }
                        
                        // Convert to plain objects via JSON to ensure proper serialization
                        const plainQuestionsArray = JSON.parse(JSON.stringify(formattedQuestions));
                        
                        // Use native MongoDB driver to bypass Mongoose casting issues
                        // This avoids the CastError that occurs with updateOne
                        await Interview.collection.updateOne(
                            { _id: new mongoose.Types.ObjectId(interviewId) },
                            { $set: { questions: plainQuestionsArray } }
                        );
                        
                        // Re-fetch the updated document (use lean to ensure questions are hydrated)
                        const updatedInterview = await Interview.findById(interviewId).lean();
                        const finalQuestions = updatedInterview?.questions || plainQuestionsArray;

                        io.to(`interview-${interviewId}`).emit('QUESTIONS_READY', {
                            questions: finalQuestions,
                            currentQuestion: finalQuestions[0]
                        });

                        // Deterministic trigger: Ask the current question when appropriate
                        try {
                            const shouldAsk = ((interview.status === 'active' || interview.status === 'in-progress') && (interview.userIntroductionProvided || interview.pausedState?.userIntroductionProvided));
                            if (shouldAsk) {
                                io.to(`interview-${interviewId}`).emit('ASK_QUESTION', { question: finalQuestions[0] });
                            }
                        } catch (err) {
                            // failed to emit ASK_QUESTION on initialization
                        }
                    } else {
                        // Question generation is already requested or completed. If questions exist, send them; otherwise inform client to wait.
                        if (interview.questions && interview.questions.length > 0) {
                            io.to(`interview-${interviewId}`).emit('QUESTIONS_READY', {
                                questions: interview.questions,
                                currentQuestion: interview.questions[interview.currentQuestionIndex || 0]
                            });

                            // Ask current question if interview is active and user intro is provided
                            try {
                                const currentIdx = interview.currentQuestionIndex || 0;
                                const currentQ = interview.questions[currentIdx];
                                const shouldAsk = ((interview.status === 'active' || interview.status === 'in-progress') && (interview.userIntroductionProvided || interview.pausedState?.userIntroductionProvided));
                                if (shouldAsk && currentQ) {
                                    io.to(`interview-${interviewId}`).emit('ASK_QUESTION', { question: currentQ });
                                }
                            } catch (err) {
                                // failed to emit ASK_QUESTION for existing questions
                            }
                        } else {
                            // Generation in progress — instruct client to wait (QUESTIONS_READY will be emitted by worker when done)
                            socket.emit('INFO', { message: 'Question generation already in progress. Please wait.' });
                        }
                    }
                } catch (error) {
                    console.error('❌ Error generating questions:', error.message);
                    console.error('Error stack:', error.stack);
                    socket.emit('ERROR', { 
                        message: 'Failed to generate interview questions',
                        details: error.message 
                    });
                }
            } else {
                // Send existing questions if already generated
                io.to(`interview-${interviewId}`).emit('QUESTIONS_READY', {
                    questions: interview.questions,
                    currentQuestion: interview.questions[interview.currentQuestionIndex || 0]
                });
            }
        } catch (error) {
            console.error('\n❌ Error in INITIALIZE_INTERVIEW:', error.message);
            socket.emit('ERROR', { message: 'Failed to initialize interview' });
        }
    },

    // Handle answer submission
    SUBMIT_ANSWER: async (io, socket, data) => {
        try {
            const { interviewId, answerId, answer, context } = data;

            // Use lean() to fetch questions without re-casting issues
            const interviewForQuestions = await Interview.findById(interviewId).lean();

            if (!interviewForQuestions) {
                console.error('❌ Interview not found:', interviewId);
                socket.emit('ERROR', { message: 'Interview not found' });
                return;
            }

            // Respect saved resume progress - the frontend has already determined intro status
            // If this is being called, assume the frontend has correctly assessed the state

            // Validate questions array exists
            if (!interviewForQuestions.questions || !Array.isArray(interviewForQuestions.questions) || interviewForQuestions.questions.length === 0) {
                console.error('❌ Interview questions not found or invalid:', { 
                    questions: interviewForQuestions.questions,
                    type: typeof interviewForQuestions.questions 
                });
                socket.emit('ERROR', { message: 'Interview questions not found' });
                return;
            }

            // Find the current question
            const questionIndex = context?.currentIndex || 0;
            
            const currentQuestion = interviewForQuestions.questions[questionIndex];
            if (!currentQuestion) {
                console.error('❌ Question not found at index:', questionIndex);
                socket.emit('ERROR', { message: 'Question not found' });
                return;
            }

            // Extract answer text safely
            const answerText = (answer?.text || answer || '').toString().trim();
            if (!answerText) {
                socket.emit('ERROR', { message: 'Empty answer text' });
                return;
            }

            // Evaluate answer using AI failover (async but emit immediately)
            try {
                // Consume credits for answer evaluation
                const interviewType = interviewForQuestions.type || 'resume';
                await consumeAnswerEvaluationCredits(
                    interviewForQuestions.user,
                    interviewId,
                    interviewType,
                    currentQuestion.id
                );
                
                const evaluation = await evaluateAnswerWithFailover(
                    currentQuestion,
                    answerText,
                    interviewForQuestions.preferences
                );
                
                if (!evaluation) {
                    console.error('❌ Evaluation returned null/undefined');
                    socket.emit('ERROR', { message: 'Evaluation failed' });
                    return;
                }

                // Create answer object
                const newAnswer = {
                    questionId: currentQuestion.id || `q_${questionIndex}`,
                    text: answerText,
                    timestamp: new Date(),
                    feedback: {
                        score: evaluation.score || 0,
                        strengths: evaluation.strengths || [],
                        improvements: evaluation.improvements || [],
                        label: evaluation.label || 'Good'
                    }
                };

                // Check if this is the last question
                const isLastQuestion = questionIndex >= interviewForQuestions.questions.length - 1;

                if (isLastQuestion) {
                    // Atomically reserve summary credits to avoid double-charge
                    const reservedSummary = await Interview.findOneAndUpdate(
                        { _id: interviewId, summaryCreditsConsumed: { $ne: true } },
                        { $set: { summaryCreditsConsumed: true } },
                        { new: false }
                    );

                    // Consume credits for summary generation only if not already consumed
                    if (reservedSummary) {
                        const interviewType = interviewForQuestions.type || 'resume';
                        await consumeSummaryCredits(
                            interviewForQuestions.user,
                            interviewId,
                            interviewType
                        );
                    } else {
                        console.warn('Summary credits already consumed for interview:', interviewId);
                    }

                    // Generate interview summary
                    const summary = await generateSummaryWithFailover({
                        questions: interviewForQuestions.questions,
                        answers: [...(interviewForQuestions.answers || []), newAnswer],
                        duration: interviewForQuestions.endTime ? (interviewForQuestions.endTime - interviewForQuestions.startTime) / 1000 : 0
                    });
                    
                    // Calculate overall score for outro message
                    const allAnswers = [...(interviewForQuestions.answers || []), newAnswer];
                    const overallScore = allAnswers.reduce((sum, ans) => sum + (ans.feedback?.score || 0), 0) / allAnswers.length;
                    let outroMessage = "Thank you for taking the time to interview with me today. You've demonstrated great skills and insight. We'll review your responses carefully and get back to you soon. Good luck!";
                    
                    if (overallScore >= 80) {
                        outroMessage = `Excellent performance! You've shown outstanding skills and expertise throughout this interview. We were impressed with your answers and problem-solving approach. Thank you, and we look forward to our next conversation!`;
                    } else if (overallScore >= 60) {
                        outroMessage = `Good work today! You've demonstrated solid understanding and skills. There are some areas we'd like to explore further. Thank you for your time, and we'll be in touch soon!`;
                    } else {
                        outroMessage = `Thank you for the interview today. We appreciate your time and effort. We'll carefully review your responses and get back to you with feedback. Best of luck!`;
                    }
                    
                    // Use findByIdAndUpdate with $push to avoid re-casting issues
                    await Interview.findByIdAndUpdate(
                        interviewId,
                        {
                            $push: { answers: newAnswer },
                            summary,
                            outroMessage: {
                                text: outroMessage,
                                delivered: false,
                                timestamp: new Date()
                            },
                            status: 'completed',
                            endTime: new Date()
                        },
                        { new: true }
                    );

                    // Emit evaluation result
                    io.to(`interview-${interviewId}`).emit('ANSWER_EVALUATED', {
                        answerId,
                        evaluation,
                        questionId: currentQuestion.id
                    });

                    io.to(`interview-${interviewId}`).emit('INTERVIEW_COMPLETED', {
                        summary,
                        outroMessage
                    });
                } else {
                    // Use findByIdAndUpdate to add answer and increment question index
                    await Interview.findByIdAndUpdate(
                        interviewId,
                        {
                            $push: { answers: newAnswer },
                            currentQuestionIndex: questionIndex + 1
                        },
                        { new: true }
                    );

                    // Emit evaluation result
                    io.to(`interview-${interviewId}`).emit('ANSWER_EVALUATED', {
                        answerId,
                        evaluation,
                        questionId: currentQuestion.id
                    });

                    const nextQuestion = interviewForQuestions.questions[questionIndex + 1];

                    io.to(`interview-${interviewId}`).emit('NEXT_QUESTION', {
                        question: nextQuestion
                    });

                    // Deterministic ask: instruct clients to ask the next question
                    try {
                        if (nextQuestion) {
                            io.to(`interview-${interviewId}`).emit('ASK_QUESTION', { question: nextQuestion });
                        }
                    } catch (err) {
                        // failed to emit ASK_QUESTION after SUBMIT_ANSWER
                    }
                }
            } catch (error) {
                console.error('\n❌ ERROR IN ANSWER EVALUATION:');
                console.error('   Message:', error.message);
                console.error('   Stack:', error.stack);
                socket.emit('ERROR', { 
                    message: 'Failed to evaluate answer: ' + error.message
                });
            }
        } catch (error) {
            console.error('❌ Error in SUBMIT_ANSWER:', error.message);
            console.error('❌ Stack:', error.stack);
            socket.emit('ERROR', { message: 'Failed to process answer: ' + error.message });
        }
    },

    // Request next question manually
    REQUEST_NEXT_QUESTION: async (io, socket, data) => {
        try {
            const { interviewId } = data;
            const interview = await Interview.findById(interviewId);

            if (!interview) {
                socket.emit('ERROR', { message: 'Interview not found' });
                return;
            }

            const currentIndex = interview.currentQuestionIndex || 0;
            if (currentIndex >= interview.questions.length - 1) {
                socket.emit('ERROR', { message: 'No more questions available' });
                return;
            }

            interview.currentQuestionIndex = currentIndex + 1;
            await interview.save();

            io.to(`interview-${interviewId}`).emit('NEXT_QUESTION', {
                question: interview.questions[currentIndex + 1]
            });

            try {
                const nextQ = interview.questions[currentIndex + 1];
                if (nextQ) io.to(`interview-${interviewId}`).emit('ASK_QUESTION', { question: nextQ });
            } catch (err) {
                // failed to emit ASK_QUESTION in REQUEST_NEXT_QUESTION
            }
        } catch (error) {
            console.error('Error in REQUEST_NEXT_QUESTION:', error);
            socket.emit('ERROR', { message: 'Failed to get next question' });
        }
    },

    // Pause interview via websocket (optional)
    PAUSE_INTERVIEW: async (io, socket, data) => {
        try {
            const { interviewId, pausedState } = data;
            const interview = await Interview.findById(interviewId);
            if (!interview) {
                socket.emit('ERROR', { message: 'Interview not found' });
                return;
            }

            // Update status and paused state
            interview.status = 'paused';
            if (pausedState) interview.pausedState = pausedState;
            await interview.save();

            // Notify room that interview is paused
            io.to(`interview-${interviewId}`).emit('PAUSED', { pausedState: interview.pausedState });
        } catch (error) {
            console.error('Error in PAUSE_INTERVIEW:', error);
            socket.emit('ERROR', { message: 'Failed to pause interview' });
        }
    }
};

module.exports = interviewHandlers;