const express = require('express');
const multer = require('multer');
const userAuth = require("../middleware/userAuth");
const { extractTextFromPDF } = require('../utils/pdfParser');
const { parseResumeText } = require('../utils/textParser'); 
const Resume = require('../models/ResumeSchema');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-resume', userAuth, upload.single('resume'), async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const rawText = await extractTextFromPDF(pdfBuffer);
    const structuredData = parseResumeText(rawText);

    res.json({
      rawText,
      structuredData,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Resume parsing failed.' });
  }
});

router.post('/save-parsed-resume', userAuth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      summary,
      skills,
      education,
      experience,
      rawText,
    } = req.body;
    

    const newResume = new Resume({
      user: req.user.id,
      name,
      email,
      phone,
      summary,
      skills,
      education,
      experience,
      rawText,
    });

    const saved = await newResume.save();
    res.status(201).json({ msg: 'Resume saved successfully', resume: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save resume data.' });
  }
});


module.exports = router;

