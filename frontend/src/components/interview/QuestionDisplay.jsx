
const QuestionDisplay = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  answer,
  onAnswerChange,
}) => {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xl text-indigo-800 font-semibold mb-2">
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </h3>
      {/* Safely extract text from currentQuestion object or render string */}
      <p className="mb-4 min-h-[60px] max-h-[120px] overflow-y-auto">{typeof currentQuestion === 'string' ? currentQuestion : (currentQuestion?.text || 'No question available')}</p>
      <textarea
        value={answer}
        onChange={onAnswerChange}
        rows="6"
        className="w-full h-48 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        placeholder="Type your answer here..."
      />
    </div>
  );
};

export default QuestionDisplay;
