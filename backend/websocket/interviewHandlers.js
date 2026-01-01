const mongoose = require('mongoose');
const Interview = require('../models/InterviewSchema');
const { generateQuestionsWithFailover, evaluateAnswerWithFailover, generateSummaryWithFailover } = require('../utils/aiProvider');

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

            // Join interview-specific room
            socket.join(`interview-${interviewId}`);

            // Generate initial questions if not already done
            if (!interview.questions || interview.questions.length === 0) {
                try {
                    const questions = await generateQuestionsWithFailover(
                        interview.resume?.summary || '',
                        interview.resume?.jobRole || 'General',
                        5
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
                            difficulty: question.difficulty || 'medium',
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
                    const result = await Interview.collection.updateOne(
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
        } catch (error) {
            console.error('Error in REQUEST_NEXT_QUESTION:', error);
            socket.emit('ERROR', { message: 'Failed to get next question' });
        }
    }
};

module.exports = interviewHandlers;