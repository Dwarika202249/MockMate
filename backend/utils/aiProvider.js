const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

// ============================================
// AI PROVIDER CONFIGURATION
// ============================================

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL_QUESTIONS = 'llama-3.1-8b-instant';
const GROQ_MODEL_EVAL = 'llama-3.3-70b-versatile';

// Pre-stored question dataset for Tier 2 fallback
const PRE_STORED_QUESTIONS = {
    'Frontend Engineer': [
        {
            id: 'q1',
            text: 'Explain the difference between let, const, and var in JavaScript.',
            type: 'Technical',
            difficulty: 'easy',
            expectedKeywords: ['scope', 'hoisting', 'temporal dead zone', 'block-scoped']
        },
        {
            id: 'q2',
            text: 'How does React\'s Virtual DOM work and what are its benefits?',
            type: 'Technical',
            difficulty: 'medium',
            expectedKeywords: ['reconciliation', 'diffing', 'performance', 'rendering']
        },
        {
            id: 'q3',
            text: 'What are React Hooks and why were they introduced?',
            type: 'Technical',
            difficulty: 'medium',
            expectedKeywords: ['functional components', 'state management', 'side effects', 'useEffect', 'useState']
        },
        {
            id: 'q4',
            text: 'Describe the CSS Box Model and how margins differ from padding.',
            type: 'Technical',
            difficulty: 'easy',
            expectedKeywords: ['margin', 'padding', 'border', 'content', 'box-sizing']
        },
        {
            id: 'q5',
            text: 'How would you optimize a large React application\'s performance?',
            type: 'Technical',
            difficulty: 'hard',
            expectedKeywords: ['memoization', 'lazy loading', 'code splitting', 'profiling', 'bundle size']
        }
    ],
    'Backend Engineer': [
        {
            id: 'q1',
            text: 'What is the difference between SQL and NoSQL databases?',
            type: 'Technical',
            difficulty: 'medium',
            expectedKeywords: ['ACID', 'schema', 'scalability', 'consistency']
        },
        {
            id: 'q2',
            text: 'Explain REST API principles and when to use GraphQL instead.',
            type: 'Technical',
            difficulty: 'medium',
            expectedKeywords: ['HTTP methods', 'stateless', 'over-fetching', 'under-fetching']
        },
        {
            id: 'q3',
            text: 'What is authentication vs authorization?',
            type: 'Technical',
            difficulty: 'easy',
            expectedKeywords: ['JWT', 'OAuth', 'tokens', 'permissions', 'roles']
        },
        {
            id: 'q4',
            text: 'How do you handle database migrations in production?',
            type: 'Technical',
            difficulty: 'hard',
            expectedKeywords: ['zero-downtime', 'rollback', 'version control', 'testing']
        },
        {
            id: 'q5',
            text: 'Describe microservices architecture and its challenges.',
            type: 'Technical',
            difficulty: 'hard',
            expectedKeywords: ['scalability', 'distributed systems', 'service discovery', 'eventual consistency']
        }
    ],
    'Full Stack Developer': [
        {
            id: 'q1',
            text: 'Walk me through how a web request travels from client to server and back.',
            type: 'Technical',
            difficulty: 'medium',
            expectedKeywords: ['DNS', 'HTTP', 'TCP/IP', 'routing', 'response']
        },
        {
            id: 'q2',
            text: 'What is the MVC architecture and how do you implement it?',
            type: 'Technical',
            difficulty: 'medium',
            expectedKeywords: ['Model', 'View', 'Controller', 'separation of concerns']
        },
        {
            id: 'q3',
            text: 'How do you ensure application security?',
            type: 'Technical',
            difficulty: 'hard',
            expectedKeywords: ['CSRF', 'XSS', 'SQL injection', 'HTTPS', 'validation']
        },
        {
            id: 'q4',
            text: 'Explain caching strategies and when to use them.',
            type: 'Technical',
            difficulty: 'medium',
            expectedKeywords: ['Redis', 'browser cache', 'CDN', 'TTL']
        },
        {
            id: 'q5',
            text: 'How do you debug a full-stack application efficiently?',
            type: 'Technical',
            difficulty: 'medium',
            expectedKeywords: ['logging', 'profiling', 'breakpoints', 'network tab', 'monitoring']
        }
    ]
};

// ============================================
// TIER 1: GROQ API (Free Cloud AI)
// ============================================

async function generateWithGroq(resumeText, role, numQuestions = 5) {
    if (!GROQ_API_KEY) {
        console.log('ℹ️  Groq API key not configured, skipping Tier 1');
        return null;
    }

    try {
        console.log('🚀 Trying Tier 1: Groq API...');
        
        const prompt = `You are an expert interviewer for a ${role} position. Generate exactly ${numQuestions} technical interview questions.

Resume Summary: ${resumeText || 'No resume provided'}

Return ONLY a valid JSON array, no other text or markdown:
[
  {
    "id": "q1",
    "text": "Question text?",
    "type": "Technical",
    "difficulty": "medium",
    "expectedKeywords": ["keyword1", "keyword2"],
    "order": 1
  }
]`;

        const response = await axios.post(GROQ_API_URL, {
            model: GROQ_MODEL_QUESTIONS,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: 'json_object' }
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 5000
        });

        const content = response.data.choices[0]?.message?.content || '';
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
            const questions = JSON.parse(jsonMatch[0]);
            if (Array.isArray(questions) && questions.length > 0) {
                console.log('✅ Tier 1 Success: Generated questions with Groq API');
                return questions;  // Return raw questions, NOT formatted
            }
        }
    } catch (error) {
        console.warn('⚠️  Tier 1 Failed (Groq API):', error.message);
        if (error.response?.status === 429) {
            console.warn('⚠️  Rate limit hit on Groq API - waiting before retry');
        }
    }

    return null;
}

// ============================================
// TIER 2: PRE-STORED DATASET (Instant Fallback)
// ============================================

function generateWithStoredDataset(role, numQuestions = 5) {
    try {
        console.log(`🚀 Trying Tier 2: Pre-stored Question Dataset (requesting ${numQuestions} questions)...`);
        
        // Normalize role
        const normalizedRole = Object.keys(PRE_STORED_QUESTIONS).find(
            key => key.toLowerCase().includes(role.toLowerCase()) || 
                   role.toLowerCase().includes(key.toLowerCase())
        ) || 'Frontend Engineer';

        const questions = PRE_STORED_QUESTIONS[normalizedRole];
        
        if (questions && questions.length > 0) {
            // Return requested number of questions, shuffle if needed
            const shuffled = questions.sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, Math.min(numQuestions, questions.length));
            
            console.log(`✅ Tier 2 Success: Using ${selected.length} pre-stored questions for ${normalizedRole}`);
            return selected;
        }
    } catch (error) {
        console.warn('⚠️  Tier 2 Failed:', error.message);
    }

    // Ultimate fallback - return requested number of basic generic questions
    console.log(`⚠️  Pre-stored dataset unavailable, returning ${numQuestions} generic fallback questions`);
    const genericQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
        genericQuestions.push({
            id: `q${i + 1}`,
            text: i === 0 
                ? 'Tell me about your professional background and experience.'
                : `Describe a challenging situation you faced and how you resolved it.`,
            type: 'General',
            difficulty: 'easy',
            expectedKeywords: ['experience', 'background', 'skills', 'challenge'],
            order: i + 1
        });
    }
    return genericQuestions;
}

// ============================================
// FORMAT AND UTILITY FUNCTIONS
// ============================================

function formatQuestionsForSchema(questions) {
    // Defensive: ensure questions is an array
    if (!Array.isArray(questions)) {
        console.warn('⚠️  formatQuestionsForSchema received non-array:', typeof questions);
        try {
            questions = JSON.parse(questions);
        } catch (e) {
            console.error('❌ Could not parse questions');
            return [];
        }
    }
    
    return questions.map((q, index) => {
        // Parse if stringified
        const question = typeof q === 'string' ? JSON.parse(q) : q;
        
        return {
            id: question.id || `q${index + 1}`,
            text: question.text || '',
            type: question.type || question.topic || 'Technical',
            difficulty: question.difficulty || 'medium',
            expectedKeywords: Array.isArray(question.expectedKeywords) 
                ? question.expectedKeywords 
                : (Array.isArray(question.expected_keywords) ? question.expected_keywords : []),
            order: question.order || index + 1
        };
    });
}

// ============================================
// MAIN FAILOVER ORCHESTRATOR
// ============================================

async function generateQuestionsWithFailover(resumeText, role, numQuestions = 5) {
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎯 Starting AI Provider Failover Chain');
    console.log(`   Role: ${role}, Questions: ${numQuestions}`);
    console.log(`   Input types - resumeText: ${typeof resumeText}, role: ${typeof role}`);
    console.log('═══════════════════════════════════════════════════════');

    let result = null;

    // Tier 1: Try Groq API
    let questions = await generateWithGroq(resumeText, role, numQuestions);
    if (questions && questions.length > 0) {
        console.log('✅ Tier 1 Success - Generated with Groq API');
        console.log(`   Result type: ${typeof questions}, length: ${questions.length}`);
        console.log(`   First item type: ${typeof questions[0]}`);
        if (questions[0]) {
            console.log(`   First item keys: ${Object.keys(questions[0]).join(', ')}`);
        }
        result = questions;
    } else {
        // Tier 2: Use Pre-stored Dataset
        questions = generateWithStoredDataset(role, numQuestions);
        if (questions && questions.length > 0) {
            console.log('✅ Tier 2 Success - Using Pre-stored Dataset');
            console.log(`   Result type: ${typeof questions}, length: ${questions.length}`);
            console.log(`   First item type: ${typeof questions[0]}`);
            result = questions;
        }
    }

    if (!result || result.length === 0) {
        throw new Error('All AI provider tiers failed to generate questions');
    }

    // Final validation before returning
    console.log('FINAL VALIDATION:');
    console.log(`  - Is array? ${Array.isArray(result)}`);
    console.log(`  - Length: ${result.length}`);
    console.log(`  - First item is object? ${typeof result[0] === 'object'}`);
    console.log(`  - First item stringified length: ${JSON.stringify(result[0]).length}`);
    
    console.log('✨ Failover Chain Completed');
    console.log('═══════════════════════════════════════════════════════\n');
    
    return result;
}

// ============================================
// ANSWER EVALUATION (2-Tier Failover)
// ============================================

async function evaluateAnswerWithFailover(question, answer, resumeContext) {
    console.log('\n🔍 Evaluating answer with AI failover...');

    // Tier 1: Try Groq API
    try {
        console.log('🚀 Trying Tier 1: Groq API for evaluation...');
        
        if (GROQ_API_KEY) {
            const response = await axios.post(GROQ_API_URL, {
                model: GROQ_MODEL_EVAL,
                messages: [
                    {
                        role: 'user',
                        content: `You are an expert interviewer. Evaluate this answer on a scale of 0-100.

Question: ${question.text}
Candidate's Answer: ${answer}
Expected Keywords: ${question.expectedKeywords?.join(', ') || 'N/A'}

Return ONLY valid JSON:
{
  "score": 75,
  "label": "Good",
  "strengths": ["point1", "point2"],
  "improvements": ["area1", "area2"],
  "feedback": "Your answer demonstrates..."
}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 500,
                response_format: { type: 'json_object' }
            }, {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });

            const content = response.data.choices[0]?.message?.content || '';
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        }
    } catch (error) {
        console.warn('⚠️  Tier 1 Failed:', error.message);
    }

    // Tier 2: Local Heuristic Evaluation
    console.log('🚀 Tier 2: Using local heuristic evaluation...');
    return performLocalEvaluation(question, answer);
}

// ============================================
// SUMMARY GENERATION WITH FAILOVER
// ============================================

async function generateSummaryWithFailover(interviewData) {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 Starting Summary Generation Failover Chain');
    console.log('═══════════════════════════════════════════════════════');

    // Tier 1: Groq API
    console.log('🚀 Tier 1: Trying Groq API...');
    const groqSummary = await generateSummaryWithGroq(interviewData);
    if (groqSummary) {
        console.log('✅ Tier 1 Success: Generated summary with Groq API');
        console.log('═══════════════════════════════════════════════════════\n');
        return groqSummary;
    }

    // Tier 2: Local Generation
    console.log('🚀 Tier 2: Using local summary generation...');
    const localSummary = generateSummaryLocal(interviewData);
    console.log('✅ Tier 2 Success: Generated local summary');
    console.log('═══════════════════════════════════════════════════════\n');
    return localSummary;
}

async function generateSummaryWithGroq(interviewData) {
    if (!GROQ_API_KEY) return null;

    try {
        const prompt = `You are an expert interview analyst. Generate a comprehensive interview summary with the following data:

Questions Asked: ${JSON.stringify(interviewData.questions || [])}
Answers/Evaluations: ${JSON.stringify(interviewData.answers || interviewData.evaluations || [])}
Interview Duration: ${interviewData.duration || 0} seconds

Provide ONLY valid JSON with this structure:
{
  "overallScore": <0-100>,
  "overallLabel": "Poor|OK|Good|Excellent",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "feedback": "detailed feedback",
  "recommendations": ["recommendation1", "recommendation2"]
}`;

        const response = await axios.post(GROQ_API_URL, {
            model: GROQ_MODEL_EVAL,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: 'json_object' }
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        const responseText = response.data.choices?.[0]?.message?.content || '';
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (error) {
        console.warn('⚠️  Tier 1 Failed:', error.message);
    }

    return null;
}

function generateSummaryLocal(interviewData) {
    const questions = interviewData.questions || [];
    const evaluations = interviewData.answers || interviewData.evaluations || [];
    
    let totalScore = 0;
    evaluations.forEach(e => {
        totalScore += e.score || 0;
    });
    const overallScore = evaluations.length > 0 ? Math.round(totalScore / evaluations.length) : 0;
    const overallLabel = overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : overallScore >= 40 ? 'OK' : 'Poor';

    return {
        overallScore,
        overallLabel,
        strengths: [
            'Participated in full interview',
            'Completed all questions'
        ],
        improvements: [
            overallScore < 70 ? 'Focus on technical depth' : 'Continue strong performance',
            'Practice more complex scenarios'
        ],
        feedback: `You scored ${overallScore}/100 across ${evaluations.length} questions. ${overallLabel} overall performance.`,
        recommendations: [
            'Review fundamentals',
            'Practice coding problems',
            'Study advanced topics'
        ]
    };
}

// ============================================
// LOCAL HEURISTIC EVALUATION
// ============================================

function performLocalEvaluation(question, answer) {
    const answerLower = answer.toLowerCase();
    const keywords = (question.expectedKeywords || []).map(k => k.toLowerCase());
    
    let matchedKeywords = 0;
    keywords.forEach(keyword => {
        if (answerLower.includes(keyword)) {
            matchedKeywords++;
        }
    });

    const keywordScore = keywords.length > 0 ? (matchedKeywords / keywords.length) * 40 : 0;
    const lengthScore = answer.length > 150 ? 30 : (answer.length > 50 ? 20 : 10);
    const detailScore = answer.split('.').length > 2 ? 30 : 20;

    const score = Math.min(100, Math.round(keywordScore + lengthScore + detailScore));
    
    const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'OK' : 'Poor';

    return {
        score,
        label,
        strengths: matchedKeywords > 0 ? [`Covered ${matchedKeywords} key concepts`] : ['Attempted answer'],
        improvements: matchedKeywords < keywords.length ? ['Could mention more technical details'] : [],
        feedback: `Your answer scored ${score}/100. This is a preliminary score based on keyword match due to high demand on our premium AI. For full, context-aware feedback, please check back during off-peak hours. (${matchedKeywords} out of ${keywords.length} key points were covered.)`
    };
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
    generateQuestionsWithFailover,
    evaluateAnswerWithFailover,
    generateSummaryWithFailover,
    performLocalEvaluation,
    formatQuestionsForSchema
};
