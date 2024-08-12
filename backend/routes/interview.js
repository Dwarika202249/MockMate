const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const userAuth = require("../middleware/userAuth");
require("dotenv").config();

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Interview = require("../models/InterviewSchema");

// Route to generate interview questions
router.post("/start", userAuth, async (req, res) => {
  const { type, details, numQuestions, difficulty } = req.body;

  try {
    const prompt = `Generate ${numQuestions} ${difficulty} interview questions for a ${type} interview that end with a question mark. Ensure each question is concise and ends with a "?" symbol, which is based on: ${details}`;

    // Generate content using Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questionsString = response.text().trim();

    // Clean and format the questions
    let questionsArray = questionsString.split(/(?=\d+\.\s)/g); // Splitting by numbered question format

    // Remove unnecessary details, asterisks, and extra formatting
    questionsArray = questionsArray.map((question) => {
      return question
        .replace(/^\d+\.\s/, "") // Remove the leading question number (e.g., "1. ")
        .replace(/\*\s*/g, "") // Remove asterisks
        .trim(); // Trim leading/trailing spaces
    });

    // Filter out any non-question content
    questionsArray = questionsArray.filter(
      (question) => question.length > 0 && question.includes("?")
    );

    // Save the interview data to the database
    const newInterview = new Interview({
      type,
      details,
      numQuestions,
      difficulty,
      questions: questionsArray,
      user: req.user.id, // tracking which user created the interview
    });

    await newInterview.save();

    // Send the generated questions as response
    res.json({ interviewId: newInterview._id, questions: questionsArray });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to fetch interview by ID
router.get("/:interviewId", userAuth, async (req, res) => {
  try {
    const interviewId = req.params.interviewId;

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

router.post("/submit", userAuth, async (req, res) => {
  const { interviewId, answers } = req.body;

  try {
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

    // Send the feedback as response
    res.json({ feedback: formattedFeedback });
  } catch (error) {
    console.error("Error analyzing answers:", error);
    res.status(500).send("Internal Server Error");
  }
});




module.exports = router;
