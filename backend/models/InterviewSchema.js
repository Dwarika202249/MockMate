const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['created', 'in-progress', 'active', 'completed'],
        default: 'created'
    },
    preferences: {
        interviewStyle: {
            type: String,
            enum: ['standard', 'behavioral', 'technical', 'mixed'],
            default: 'standard'
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        },
        duration: {
            type: String,
            default: '30'
        },
        focusAreas: [{
            type: String
        }],
        communicationStyle: {
            type: String,
            default: 'professional'
        },
        interviewerPersonality: {
            type: String,
            enum: ['friendly', 'neutral', 'challenging'],
            default: 'friendly'
        }
    },
    questions: [{
        id: String,
        text: String,
        type: String,
        difficulty: String,
        expectedKeywords: [String],
        context: Object,
        order: Number
    }],
    answers: [{
        questionId: String,
        text: String,
        timestamp: Date,
        feedback: {
            score: Number,
            strengths: [String],
            improvements: [String],
            keywords: [String]
        }
    }],
    introMessage: {
        text: String,
        delivered: { type: Boolean, default: false },
        timestamp: Date
    },
    outroMessage: {
        text: String,
        delivered: { type: Boolean, default: false },
        timestamp: Date
    },
    summary: {
        overallScore: Number,
        keyStrengths: [String],
        areasToImprove: [String],
        technicalScore: Number,
        communicationScore: Number,
        recommendedResources: [String]
    },
    startTime: Date,
    endTime: Date,
    duration: Number
}, {
    timestamps: true
});

// Pre-save middleware to update status based on interview progress
interviewSchema.pre('save', function(next) {
    if (this.endTime && !this.duration) {
        this.duration = (this.endTime - this.startTime) / 1000; // Duration in seconds
    }
    next();
});

module.exports = mongoose.model('Interview', interviewSchema);