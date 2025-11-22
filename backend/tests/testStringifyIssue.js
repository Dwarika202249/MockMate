/**
 * Debug script to test if generateQuestionsWithFailover is returning stringified array
 */

require('dotenv').config();
const { generateQuestionsWithFailover } = require('../utils/aiProvider');

async function testStringify() {
    try {
        console.log('Testing generateQuestionsWithFailover...\n');
        
        const questions = await generateQuestionsWithFailover(
            'Frontend engineer with React experience',
            'Frontend Engineer',
            5
        );
        
        console.log('\n═══ RESULT ANALYSIS ═══');
        console.log(`Type of result: ${typeof questions}`);
        console.log(`Is array: ${Array.isArray(questions)}`);
        console.log(`Length: ${questions?.length || 0}`);
        
        if (questions && questions.length > 0) {
            console.log(`\nFirst element:`);
            console.log(`  - Type: ${typeof questions[0]}`);
            console.log(`  - Is object: ${typeof questions[0] === 'object'}`);
            console.log(`  - Value:`, JSON.stringify(questions[0], null, 2));
            
            // Try to assign like in the handler
            console.log('\n═══ ATTEMPTING ASSIGNMENT ═══');
            const mockInterview = { questions: [] };
            
            console.log('Step 1: Format questions...');
            const formattedQuestions = questions.map((q, idx) => {
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
            
            console.log(`Formatted array type: ${typeof formattedQuestions}`);
            console.log(`Formatted array is array: ${Array.isArray(formattedQuestions)}`);
            console.log(`Formatted length: ${formattedQuestions.length}`);
            console.log(`First formatted element type: ${typeof formattedQuestions[0]}`);
            
            console.log('\nStep 2: JSON parse/stringify...');
            const plainQuestionsArray = JSON.parse(JSON.stringify(formattedQuestions));
            console.log(`Plain array type: ${typeof plainQuestionsArray}`);
            console.log(`Plain array is array: ${Array.isArray(plainQuestionsArray)}`);
            console.log(`Plain length: ${plainQuestionsArray.length}`);
            
            console.log('\nStep 3: Would assign to interview.questions');
            mockInterview.questions = plainQuestionsArray;
            console.log(`Assigned type: ${typeof mockInterview.questions}`);
            console.log(`Assigned is array: ${Array.isArray(mockInterview.questions)}`);
            console.log(`Assigned length: ${mockInterview.questions.length}`);
        }
        
        console.log('\n✅ Test completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testStringify();
