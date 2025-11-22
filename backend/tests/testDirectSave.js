/**
 * Direct test of the interview questions saving logic
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('../models/InterviewSchema');
const Resume = require('../models/ResumeSchema');
const { generateQuestionsWithFailover } = require('../utils/aiProvider');

const MONGO_URI = process.env.MONGO_URI;

async function testDirectSave() {
    try {
        console.log('🔧 TEST: Direct Interview Questions Save\n');

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clean up
        const testUserId = new mongoose.Types.ObjectId();
        const testResumeId = new mongoose.Types.ObjectId();
        
        await Interview.deleteMany({ user: testUserId });
        await Resume.deleteMany({ _id: testResumeId });

        // Create test resume
        console.log('📄 Creating test resume...');
        const resume = new Resume({
            _id: testResumeId,
            user: testUserId,
            name: 'Test User',
            jobRole: 'Frontend Engineer',
            summary: 'React developer with experience',
            skills: [{ name: 'React' }],
            experience: [],
            education: []
        });
        await resume.save();
        console.log('✅ Resume created\n');

        // Create test interview
        console.log('📋 Creating test interview...');
        const interview = new Interview({
            resume: testResumeId,
            user: testUserId,
            status: 'created',
            questions: [],
            answers: []
        });
        await interview.save();
        console.log('✅ Interview created\n');

        // Simulate the handler logic
        console.log('🔄 Simulating INITIALIZE_INTERVIEW handler...\n');
        
        // Step 1: Generate questions
        console.log('Step 1: Generate questions via aiProvider...');
        const questions = await generateQuestionsWithFailover(
            resume.summary,
            resume.jobRole,
            5
        );
        console.log('✅ Generated:', questions.length, 'questions');
        console.log('   Type:', typeof questions);
        console.log('   Is array:', Array.isArray(questions));
        console.log('   First item type:', typeof questions[0]);
        
        // Step 2: Format questions
        console.log('\nStep 2: Format questions...');
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
        console.log('✅ Formatted:', formattedQuestions.length, 'questions');
        console.log('   Type:', typeof formattedQuestions);
        console.log('   Is array:', Array.isArray(formattedQuestions));
        console.log('   First item type:', typeof formattedQuestions[0]);
        
        // Step 3: Validate
        console.log('\nStep 3: Validate before save...');
        if (!Array.isArray(formattedQuestions)) {
            throw new Error('formattedQuestions is not an array!');
        }
        if (typeof formattedQuestions[0] !== 'object') {
            throw new Error('First item is not an object: ' + typeof formattedQuestions[0]);
        }
        console.log('✅ Validation passed');
        
        // Step 4: Convert to plain objects
        console.log('\nStep 4: Convert to plain objects via JSON...');
        const plainQuestionsArray = JSON.parse(JSON.stringify(formattedQuestions));
        console.log('✅ Converted');
        console.log('   Type:', typeof plainQuestionsArray);
        console.log('   Is array:', Array.isArray(plainQuestionsArray));
        console.log('   First item type:', typeof plainQuestionsArray[0]);
        
        // Step 5: Use updateOne
        console.log('\nStep 5: Save to MongoDB using native collection.updateOne...');
        const updateResult = await Interview.collection.updateOne(
            { _id: interview._id },
            { $set: { questions: plainQuestionsArray } }
        );
        console.log('✅ Update result:', {
            acknowledged: updateResult.acknowledged,
            modifiedCount: updateResult.modifiedCount
        });
        
        // Step 6: Retrieve and verify
        console.log('\nStep 6: Retrieve from MongoDB and verify...');
        
        // Try different retrieval methods
        const savedInterview1 = await Interview.findById(interview._id);
        const savedInterview2 = await Interview.findById(interview._id).lean();
        const rawInterview = await Interview.collection.findOne({ _id: interview._id });
        
        console.log('✅ Retrieval complete');
        console.log('\nMethod 1 - Mongoose Document:');
        console.log('   questions:', savedInterview1.questions);
        
        console.log('\nMethod 2 - Mongoose Lean:');
        console.log('   questions:', savedInterview2.questions);
        
        console.log('\nMethod 3 - Raw MongoDB:');
        console.log('   questions exists:', !!rawInterview.questions);
        console.log('   questions type:', typeof rawInterview.questions);
        console.log('   questions length:', rawInterview.questions?.length);
        
        // Use lean version if it has questions
        const finalInterview = savedInterview2 || savedInterview1;
        const questionsData = finalInterview.questions || rawInterview.questions;
        
        if (!questionsData || questionsData.length === 0) {
            throw new Error('No questions found in any retrieval method!');
        }
        
        console.log('\n✅ Using questions from retrieval');
        console.log('   Type:', typeof questionsData[0]);
        console.log('   First question:', {
            id: questionsData[0].id,
            text: questionsData[0].text?.substring(0, 50) + '...',
            type: questionsData[0].type,
            difficulty: questionsData[0].difficulty
        });
        
        if (typeof questionsData[0] === 'string') {
            throw new Error('❌ CRITICAL: First question is a STRING!');
        }
        
        console.log('\n✨ ALL TESTS PASSED!');
        
        // Cleanup
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('\nStack trace:');
        console.error(error.stack);
        process.exit(1);
    }
}

testDirectSave();
