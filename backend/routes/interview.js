const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const userAuth = require('../middleware/userAuth');
require('dotenv').config();

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const Interview = require('../models/InterviewSchema');

// Route to generate interview questions
router.post('/start', userAuth, async (req, res) => {
    const { type, details, numQuestions, difficulty } = req.body;
  

  try {
    const prompt = `Generate ${numQuestions} ${difficulty} interview questions for a ${type} interview. Details: ${details}`;

    // Generate content using Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questionsString = response.text().trim();

    // Clean and format the questions
    let questionsArray = questionsString.split(/(?=\d+\.\s)/g); // Splitting by numbered question format


    // Remove unnecessary details, asterisks, and extra formatting
    questionsArray = questionsArray.map(question => {
      return question
        .replace(/^\d+\.\s/, '') // Remove the leading question number (e.g., "1. ")
        .replace(/\*\s*/g, '')   // Remove asterisks
        .trim();                 // Trim leading/trailing spaces
    });

    // Filter out any non-question content
    questionsArray = questionsArray.filter(question => question.length > 0 && question.includes('?'));

    // Save the interview data to the database
    const newInterview = new Interview({
        type,
        details,
        numQuestions,
        difficulty,
        questions: questionsArray,
        user: req.user.id  // tracking which user created the interview
      });

      await newInterview.save();

    // Send the generated questions as response
    res.json({ interviewId: newInterview._id, questions: questionsArray });
  } catch (error) {
    console.error('Error generating interview questions:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch interview by ID
router.get('/:interviewId', userAuth, async (req, res) => {
    try {
      const interviewId = req.params.interviewId;
  
      // Find the interview by ID
      const interview = await Interview.findById(interviewId);
  
      // Check if the interview exists
      if (!interview) {
        return res.status(404).json({ msg: 'Interview not found' });
      }
  
      // Check if the logged-in user is the owner of the interview
      if (interview.user.toString() !== req.user.id) {
        return res.status(403).json({ msg: 'Unauthorized' });
      }
  
      // Send the interview data as a response
      res.json(interview);
    } catch (error) {
      console.error('Error fetching interview:', error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router;
