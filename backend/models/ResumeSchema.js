const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    jobRole: {
        type: String,
        required: true
    },
    email: String,
    phone: String,
    location: String,
    summary: String,
    experience: [{
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String,
        highlights: [String],
        skills: [String]
    }],
    education: [{
        degree: String,
        institution: String,
        location: String,
        startDate: Date,
        endDate: Date,
        gpa: Number,
        highlights: [String],
        relevantCourses: [String]
    }],
    skills: [{
        name: String,
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            default: 'intermediate'
        },
        years: Number,
        category: String
    }],
    projects: [{
        name: String,
        description: String,
        technologies: [String],
        role: String,
        url: String,
        highlights: [String]
    }],
    certifications: [{
        name: String,
        issuer: String,
        issueDate: Date,
        expiryDate: Date,
        url: String
    }],
    languages: [{
        name: String,
        proficiency: {
            type: String,
            enum: ['basic', 'conversational', 'fluent', 'native'],
            default: 'conversational'
        }
    }],
    metadata: {
        source: {
            type: String,
            enum: ['upload', 'manual', 'linkedin', 'other'],
            default: 'upload'
        },
        fileName: String,
        fileType: String,
        uploadDate: {
            type: Date,
            default: Date.now
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    // Extracted analytics for AI processing
    analytics: {
        yearsOfExperience: Number,
        topSkills: [String],
        skillCategories: [String],
        experienceByRole: Map,
        educationLevel: String,
        lastActiveRole: String,
        latestCompany: String,
        relevanceScore: Number
    }
}, {
    timestamps: true
});

// Update analytics before saving
ResumeSchema.pre('save', function(next) {
    // Calculate years of experience
    const experience = this.experience || [];
    let totalYears = 0;
    const roleExperience = new Map();
    
    experience.forEach(job => {
        if (job.startDate && (job.endDate || job.current)) {
            const end = job.current ? new Date() : new Date(job.endDate);
            const start = new Date(job.startDate);
            const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
            totalYears += years;
            
            // Track experience by role
            if (job.title) {
                const existing = roleExperience.get(job.title) || 0;
                roleExperience.set(job.title, existing + years);
            }
        }
    });

    // Get skill categories and top skills
    const skillCategories = new Set();
    const skillsByFrequency = new Map();
    
    this.skills.forEach(skill => {
        if (skill.category) skillCategories.add(skill.category);
        if (skill.name) {
            const count = skillsByFrequency.get(skill.name) || 0;
            skillsByFrequency.set(skill.name, count + 1);
        }
    });

    // Get top skills by frequency
    const topSkills = Array.from(skillsByFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([skill]) => skill);

    // Update analytics
    this.analytics = {
        yearsOfExperience: Math.round(totalYears),
        topSkills,
        skillCategories: Array.from(skillCategories),
        experienceByRole: roleExperience,
        educationLevel: this.education.length > 0 ? 
            this.education[this.education.length - 1].degree : undefined,
        lastActiveRole: experience.length > 0 ? 
            experience[0].title : undefined,
        latestCompany: experience.length > 0 ? 
            experience[0].company : undefined
    };

    next();
});

// Index for quick lookups
ResumeSchema.index({ user: 1, 'metadata.uploadDate': -1 });
ResumeSchema.index({ 'skills.name': 1 });
ResumeSchema.index({ jobRole: 1 });

const Resume = mongoose.model('Resume', ResumeSchema);
module.exports = Resume;