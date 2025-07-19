const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
const userAuth = require("../middleware/userAuth");
const Feedback = require('../models/FeedbackSchema');
require("dotenv").config();
const Interview = require("../models/InterviewSchema");

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/start", userAuth, async (req, res) => {
  const {
    type,
    details,
    resume,
    prompt,
    numQuestions=5,
    difficulty="medium",
  } = req.body;

  

  try {
    let basePrompt = "";
    if (resume) {
      // Resume-based mode
      const { name, email, phone, summary, skills, experience, education } = resume;

      basePrompt = `You are an AI interviewer. Based on the following candidate resume details, generate ${numQuestions} personalized ${difficulty} interview questions that end with a "?".
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Summary: ${summary}
      Skills: ${skills}
      Experience: ${experience}
      Education: ${education}
      Extra context from candidate: ${prompt || "None"}
      `;
    } else if (type && details) {
      // Classic mode
      
      basePrompt = `Generate ${numQuestions} ${difficulty} interview questions for a ${type} interview. The context is: ${details}`;
    } else {
      return res.status(400).json({ msg: "Invalid input: Provide either (type & details) or (resume & prompt)." });
    }

    let questionsArray = [];
    let attempts = 0;
    const maxAttempts = 3;

    while (questionsArray.length < numQuestions && attempts < maxAttempts) {
      attempts++;

      const dynamicPrompt = `${basePrompt}
      Here are some existing questions: ${questionsArray.join(", ")}
      Generate more.`;
      

      const result = await model.generateContent(dynamicPrompt);
      
      const response = await result.response;
      
      const questionsString = response.text().trim();

      let newQuestionsArray = questionsString.split(/(?=\d+\.\s)/g).map((q) =>
        q.replace(/^\d+\.\s/, "").replace(/\*\s*/g, "").trim()
      );

      newQuestionsArray = newQuestionsArray.filter(
        (q) => q.includes("?") && !questionsArray.includes(q)
      );

      questionsArray = [...questionsArray, ...newQuestionsArray];
    }

    if (questionsArray.length < numQuestions) {
      return res.status(400).json({
        msg: `Only ${questionsArray.length} questions generated.`,
      });
    }

    const newInterview = new Interview({
      type: type || "resume_based",
      details: details || prompt || "Generated from resume",
      numQuestions,
      difficulty,
      questions: questionsArray.slice(0, numQuestions),
      user: req.user.id,
    });

    

    await newInterview.save();

    res.json({
      interviewId: newInterview._id,
      questions: questionsArray,
    });
  } catch (error) {
    console.error("Interview generation error:", error);
    res.status(500).send("Internal Server Error");
  }
});



// Route to submit interview answers and get feedback
router.post("/submit", userAuth, async (req, res) => {
  const { interviewId, answers } = req.body;

  try {

    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ msg: "Invalid interview ID" });
    }

    // Retrieve the interview questions from the database
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ msg: "Interview not found" });
    }

    // Check for missing answers
    const allAnswered =
      interview.questions.length === Object.keys(answers).length;
    if (!allAnswered) {
      return res
        .status(400)
        .json({ msg: "Please provide answers to all questions" });
    }

    // Construct the prompt for Gemini API to analyze the answers
    let prompt = `Analyze the following answers for a ${interview.type} interview:\n\n`;
    interview.questions.forEach((question, index) => {
      prompt += `Q${index + 1}: ${question}\nA: ${
        answers[index] || "No answer provided."
      }\n\n`;
    });

    // Generate feedback using Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text().trim();

    // Format feedback
    const formattedFeedback = feedback
      .replace(/\*\s*/g, "")
      .split("\n\n")
      .map((section) => {
        if (section.includes("Q")) {
          const [questionPart, answerPart] = section.split("\nA: ");
          const [question] = questionPart.split("\n");
          const answer = answerPart ? answerPart.replace(/\*\s*/g, "").trim() : "No answer provided."; // Handle undefined and remove leading asterisks
          return `${question}\nExpected Answer: ${answer}`;
        }
        return section;
      })
      .join("\n\n");

      // Save feedback to the database
    const newFeedback = new Feedback({
      interviewId,
      questions: interview.questions,
      answers: Object.values(answers),
      feedback: formattedFeedback,
      user: req.user.id
    });
    
    await newFeedback.save()

    // Send the feedback as response
    res.json({ feedback: formattedFeedback });
  } catch (error) {
    console.error("Error analyzing answers:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to fetch interview history for a user with pagination
router.get('/history', userAuth, async (req, res) => {
  try {
    const { page = 1, limit = 4 } = req.query;

    // Parse page and limit to integers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Calculate total interviews count
    const totalCount = await Interview.countDocuments({ user: req.user.id });

    // Fetch interviews with pagination
    const interviews = await Interview.find({ user: req.user.id })
      .sort({ createdAt: -1 }) // Sort by date (latest first)
      .skip((pageNumber - 1) * limitNumber) // Skip previous pages
      .limit(limitNumber); // Limit the results to the specified number

    res.json({
      interviews,
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
    });
  } catch (error) {
    console.error('Error fetching interview history:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch specific interview details along with feedback
router.get('/:interviewId/details', userAuth, async (req, res) => {
  try {
    const interviewId = req.params.interviewId;
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ msg: "Invalid interview ID" });
    }
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ msg: 'Interview not found' });
    }

    const feedback = await Feedback.findOne({ interviewId });
    res.json({ interview, feedback });
  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to delete a specific interview
router.delete('/:interviewId/delete', userAuth, async (req, res) => {
  try {
    const interviewId = req.params.interviewId;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ msg: "Invalid interview ID" });
    }

    // Find the interview by ID and delete it
    const interview = await Interview.findByIdAndDelete(interviewId);

    // Check if the interview exists
    if (!interview) {
      return res.status(404).json({ msg: "Interview not found" });
    }

    // Also delete related feedback
    await Feedback.findOneAndDelete({ interviewId });

    res.json({ msg: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to cancel an interview
router.delete('/:interviewId/cancel', async (req, res) => {
  const { interviewId } = req.params;

  try {
    // Find and remove the interview from the database
    const interview = await Interview.findByIdAndDelete(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json({ message: 'Interview canceled successfully' });
  } catch (error) {
    console.error('Error canceling interview:', error);
    res.status(500).json({ message: 'Error canceling interview' });
  }
});

// Route to fetch interview by ID
router.get("/:interviewId", userAuth, async (req, res) => {
  try {
    const interviewId = req.params.interviewId;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ msg: "Invalid interview ID" });
    }

    // Find the interview by ID
    const interview = await Interview.findById(interviewId);

    // Check if the interview exists
    if (!interview) {
      return res.status(404).json({ msg: "Interview not found" });
    }

    // Check if the logged-in user is the owner of the interview
    if (interview.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Send the interview data as a response
    res.json(interview);
  } catch (error) {
    console.error("Error fetching interview:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
