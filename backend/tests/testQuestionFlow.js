/**
 * Test script to diagnose question generation and MongoDB save flow
 * Run: node backend/tests/testQuestionFlow.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('../models/InterviewSchema');
const Resume = require('../models/ResumeSchema');
const User = require('../models/User');
const { generateQuestionsWithFailover } = require('../utils/aiProvider');

const MONGO_URI = process.env.MONGO_URI;

async function testQuestionFlow() {
    try {
        console.log('🔧 TEST: Question Generation & MongoDB Save Flow');
        console.log('═══════════════════════════════════════════════════════\n');

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB\n');

        // Test 1: Generate questions
        console.log('📝 TEST 1: Generate Questions');
        console.log('─────────────────────────────────');
        
        const testResumeText = 'Frontend Engineer with 3 years experience in React, TypeScript, and TailwindCSS';
        const testRole = 'Frontend Engineer';
        
        const questions = await generateQuestionsWithFailover(testResumeText, testRole, 3);
        
        console.log(`✅ Generated ${questions.length} questions`);
        console.log(`   Type: ${typeof questions} (array: ${Array.isArray(questions)})`);
        console.log(`   First question type: ${typeof questions[0]} (is object: ${typeof questions[0] === 'object'})`);
        
        if (typeof questions[0] !== 'object') {
            console.error('❌ FAIL: Question is not an object!');
            console.error(`   Received: ${typeof questions[0]}`);
            console.error(`   Value: ${JSON.stringify(questions[0]).substring(0, 100)}`);
            process.exit(1);
        }

        // Test 2: Validate question structure
        console.log('\n📋 TEST 2: Validate Question Structure');
        console.log('─────────────────────────────────');
        
        const requiredFields = ['id', 'text', 'type', 'difficulty', 'expectedKeywords'];
        const firstQuestion = questions[0];
        
        console.log('   Required fields:');
        requiredFields.forEach(field => {
            const exists = field in firstQuestion;
            const symbol = exists ? '✅' : '❌';
            console.log(`   ${symbol} ${field}: ${firstQuestion[field]}`);
            
            if (!exists) {
                console.error(`   ❌ FAIL: Missing required field: ${field}`);
                process.exit(1);
            }
        });

        // Test 3: Try to save to a test interview (create minimal interview)
        console.log('\n💾 TEST 3: Save Questions to MongoDB');
        console.log('─────────────────────────────────');

        // Create a test user and resume
        const testUser = new User({
            name: 'Test User',
            email: `test_${Date.now()}@test.com`,
            password: 'test123'
        });
        await testUser.save();
        console.log(`✅ Created test user: ${testUser._id}`);

        const testResume = new Resume({
            user: testUser._id,
            name: 'Test Resume',
            jobRole: 'Frontend Engineer',
            summary: testResumeText,
            skills: []
        });
        await testResume.save();
        console.log(`✅ Created test resume: ${testResume._id}`);

        // Create interview with questions
        const interview = new Interview({
            user: testUser._id,
            resume: testResume._id,
            questions: questions,
            status: 'in-progress'
        });

        console.log(`\n   Before save:`);
        console.log(`   - questions[0] type: ${typeof interview.questions[0]}`);
        console.log(`   - questions is array: ${Array.isArray(interview.questions)}`);
        console.log(`   - First question: ${JSON.stringify(interview.questions[0], null, 2)}`);

        await interview.save();
        console.log(`\n✅ Interview saved successfully: ${interview._id}`);

        // Test 4: Retrieve and verify
        console.log('\n🔍 TEST 4: Retrieve & Verify from MongoDB');
        console.log('─────────────────────────────────');

        const retrieved = await Interview.findById(interview._id);
        console.log(`✅ Retrieved interview: ${retrieved._id}`);
        console.log(`   Questions count: ${retrieved.questions.length}`);
        console.log(`   First question type: ${typeof retrieved.questions[0]}`);
        console.log(`   First question: ${JSON.stringify(retrieved.questions[0], null, 2)}`);

        // Validate retrieved data
        if (typeof retrieved.questions[0] !== 'object') {
            console.error('❌ FAIL: Retrieved question is not an object!');
            process.exit(1);
        }

        console.log('\n✅ ALL TESTS PASSED!');
        console.log('═══════════════════════════════════════════════════════\n');

        // Cleanup
        console.log('🧹 Cleaning up test data...');
        await Interview.deleteOne({ _id: interview._id });
        await Resume.deleteOne({ _id: testResume._id });
        await User.deleteOne({ _id: testUser._id });
        console.log('✅ Cleanup complete\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ TEST FAILED:');
        console.error(error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run tests
testQuestionFlow();
