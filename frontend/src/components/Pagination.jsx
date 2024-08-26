import React from "react";
import { GrCaretPrevious } from "react-icons/gr";
import { GrCaretNext } from "react-icons/gr";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        className="px-4 py-2 bg-indigo-500 text-white rounded disabled:opacity-50"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        {/* Previous */}
        <GrCaretPrevious size={20}/>
      </button>
      <span className="font-semibold text-indigo-700">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-4 py-2 bg-indigo-500 text-white rounded disabled:opacity-50"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        {/* Next */}
        <GrCaretNext size={20}/>
      </button>
    </div>
  );
};

export default Pagination;
