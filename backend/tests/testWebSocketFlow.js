/**
 * Test WebSocket interview flow to reproduce the CastError
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Interview = require('../models/InterviewSchema');
const Resume = require('../models/ResumeSchema');
const User = require('../models/User');
const io = require('socket.io-client');

const MONGO_URI = process.env.MONGO_URI;
const WS_URL = 'http://localhost:5000';

async function testWebSocketFlow() {
    try {
        console.log('🔧 TEST: WebSocket Interview Flow\n');

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB\n');

        // Clean up old test data
        console.log('🧹 Cleaning up old test data...');
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
            summary: 'Experienced React developer with 5+ years of experience',
            skills: [
                { name: 'React', level: 'expert' },
                { name: 'JavaScript', level: 'expert' },
                { name: 'CSS', level: 'advanced' }
            ],
            experience: [],
            education: []
        });
        await resume.save();
        console.log('✅ Resume created:', resume._id);

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
        console.log('✅ Interview created:', interview._id);

        // Connect to WebSocket
        console.log('\n🌐 Connecting to WebSocket...');
        const socket = io(WS_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });

        // Wait for connection
        await new Promise((resolve, reject) => {
            socket.on('connect', () => {
                console.log('✅ WebSocket connected');
                resolve();
            });
            socket.on('connect_error', (error) => {
                reject(error);
            });
            setTimeout(() => reject(new Error('Connection timeout')), 5000);
        });

        // Listen for events
        socket.on('QUESTIONS_READY', (data) => {
            console.log('\n✅ QUESTIONS_READY received!');
            console.log('Questions count:', data.questions.length);
            console.log('First question:', JSON.stringify(data.currentQuestion, null, 2));
        });

        socket.on('ERROR', (error) => {
            console.error('\n❌ ERROR from server:', error);
        });

        // Emit INITIALIZE_INTERVIEW
        console.log('\n📤 Sending INITIALIZE_INTERVIEW event...');
        socket.emit('INITIALIZE_INTERVIEW', {
            interviewId: interview._id.toString(),
            userId: testUserId.toString()
        });

        // Wait for response
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Check MongoDB for questions
        console.log('\n🔍 Checking MongoDB for saved questions...');
        const savedInterview = await Interview.findById(interview._id);
        
        if (savedInterview.questions && savedInterview.questions.length > 0) {
            console.log('✅ Questions saved in MongoDB!');
            console.log('Count:', savedInterview.questions.length);
            console.log('First question type:', typeof savedInterview.questions[0]);
            console.log('First question:', JSON.stringify(savedInterview.questions[0], null, 2));
        } else {
            console.log('⚠️  No questions found in MongoDB');
        }

        // Cleanup
        socket.disconnect();
        await mongoose.disconnect();
        
        console.log('\n✅ Test completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testWebSocketFlow();
