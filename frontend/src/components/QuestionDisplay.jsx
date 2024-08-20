import React from "react";

const QuestionDisplay = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  answer,
  onAnswerChange,
}) => {
  return (
    <div>
      <h3 className="text-xl text-indigo-800 font-semibold mb-2">
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </h3>
      <p className="mb-4">{currentQuestion}</p>
      <textarea
        value={answer}
        onChange={onAnswerChange}
        rows="4"
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Type your answer here..."
      />
    </div>
  );
};

export default QuestionDisplay;
