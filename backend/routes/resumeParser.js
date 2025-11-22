const express = require('express');
const multer = require('multer');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const { parseResumeText } = require('../utils/textParser');
const { extractTextFromPDF } = require('../utils/pdfParser');
const Resume = require('../models/ResumeSchema');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Only accept PDFs
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are accepted'));
        }
    }
});

// Parse resume from text
router.post('/', userAuth, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'No resume text provided' });

        const parsed = parseResumeText(text);
        res.json({ parsed });
    } catch (err) {
        console.error('Error parsing resume:', err);
        res.status(500).json({ message: 'Failed to parse resume' });
    }
});

// Upload and parse PDF resume
router.post('/upload-resume', userAuth, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Parse PDF buffer to text
        const rawText = await extractTextFromPDF(req.file.buffer);
        
        // Parse text to structured data
        const structuredData = parseResumeText(rawText);

        res.json({
            structuredData,
            rawText,
            fileName: req.file.originalname
        });
    } catch (err) {
        console.error('Error processing resume:', err);
        res.status(500).json({ message: 'Failed to process resume', error: err.message });
    }
});

// Helper function to transform string arrays to proper objects
function transformResumeData(data) {
    // Extract job role from summary or experience
    let jobRole = data.jobRole || 'Software Engineer';
    if (!data.jobRole && data.summary) {
        const jobRoleMatch = data.summary.match(/(?:for\s+|position\s+|role\s+|as\s+|engineer|developer|manager)([^,.\n]+)/i);
        if (jobRoleMatch) {
            jobRole = jobRoleMatch[1].trim();
        }
    }
    if (!data.jobRole && data.experience && Array.isArray(data.experience) && data.experience.length > 0) {
        const firstExp = data.experience[0];
        if (typeof firstExp === 'string') {
            const match = firstExp.match(/([A-Za-z\s]+)\s*\|/);
            if (match) jobRole = match[1].trim();
        } else if (firstExp.title) {
            jobRole = firstExp.title;
        }
    }

    return {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        summary: data.summary || '',
        jobRole: jobRole,
        // Transform experience: convert strings to objects
        experience: Array.isArray(data.experience) ? data.experience.map(exp => 
            typeof exp === 'string' ? { description: exp } : exp
        ) : [],
        // Transform education: convert strings to objects
        education: Array.isArray(data.education) ? data.education.map(edu => 
            typeof edu === 'string' ? { degree: edu } : edu
        ) : [],
        // Transform skills: convert strings to objects
        skills: Array.isArray(data.skills) ? data.skills.map(skill => 
            typeof skill === 'string' ? { name: skill, level: 'intermediate' } : skill
        ) : [],
        // Transform certifications
        certifications: Array.isArray(data.certifications) ? data.certifications.map(cert => 
            typeof cert === 'string' ? { name: cert } : cert
        ) : [],
        // Transform languages
        languages: Array.isArray(data.languages) ? data.languages.map(lang => 
            typeof lang === 'string' ? { name: lang, proficiency: 'conversational' } : lang
        ) : []
    };
}

// Save parsed resume to database
router.post('/save-parsed-resume', userAuth, async (req, res) => {
    try {
        const { name, email, phone, location, summary, experience, education, skills, certifications, languages, rawText } = req.body;
        const userId = req.user.id;

        // Transform the data to match schema requirements
        const transformedData = transformResumeData({
            name, email, phone, location, summary, experience, education, skills, certifications, languages
        });

        // Create or update resume document
        let resume = await Resume.findOne({ user: userId });
        
        if (resume) {
            // Update existing resume
            resume.name = transformedData.name || resume.name;
            resume.email = transformedData.email || resume.email;
            resume.phone = transformedData.phone || resume.phone;
            resume.location = transformedData.location || resume.location;
            resume.summary = transformedData.summary || resume.summary;
            resume.jobRole = transformedData.jobRole || resume.jobRole;
            resume.experience = transformedData.experience.length > 0 ? transformedData.experience : resume.experience;
            resume.education = transformedData.education.length > 0 ? transformedData.education : resume.education;
            resume.skills = transformedData.skills.length > 0 ? transformedData.skills : resume.skills;
            resume.certifications = transformedData.certifications.length > 0 ? transformedData.certifications : resume.certifications;
            resume.languages = transformedData.languages.length > 0 ? transformedData.languages : resume.languages;
            resume.metadata.lastUpdated = new Date();
        } else {
            // Create new resume
            resume = new Resume({
                user: userId,
                name: transformedData.name,
                email: transformedData.email,
                phone: transformedData.phone,
                location: transformedData.location,
                summary: transformedData.summary,
                jobRole: transformedData.jobRole,
                experience: transformedData.experience,
                education: transformedData.education,
                skills: transformedData.skills,
                certifications: transformedData.certifications,
                languages: transformedData.languages,
                metadata: {
                    source: 'upload',
                    uploadDate: new Date(),
                    lastUpdated: new Date()
                }
            });
        }

        // Ensure jobRole is set
        if (!resume.jobRole) {
            resume.jobRole = 'Software Engineer';
        }

        await resume.save();

        res.status(201).json({
            status: 'success',
            message: 'Resume saved successfully',
            resumeId: resume._id
        });
    } catch (err) {
        console.error('Error saving resume:', err);
        res.status(500).json({ message: 'Failed to save resume', error: err.message });
    }
});

// Get user's resume
router.get('/my-resume', userAuth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user.id });
        if (!resume) {
            return res.status(404).json({ message: 'No resume found' });
        }
        res.json({ status: 'success', resume });
    } catch (err) {
        console.error('Error fetching resume:', err);
        res.status(500).json({ message: 'Failed to fetch resume' });
    }
});

module.exports = router;
