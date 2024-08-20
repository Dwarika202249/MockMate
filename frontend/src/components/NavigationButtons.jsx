import React from "react";

const NavigationButtons = ({
  currentQuestionIndex,
  totalQuestions,
  onNext,
  onSubmit,
  isSubmitting,
  currentAnswer,
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="">
      {!isLastQuestion ? (
        <button
          onClick={onNext}
          className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
          disabled={!currentAnswer || currentAnswer.trim() === ""}
        >
          Next
        </button>
      ) : (
        <button
          onClick={onSubmit}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          disabled={
            isSubmitting || !currentAnswer || currentAnswer.trim() === ""
          }
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
