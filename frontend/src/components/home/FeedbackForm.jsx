import { useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", feedback: "" });
  const { name, email, feedback } = formData;
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", feedback: "" });
  };

  return (
    <section className="w-full py-20 px-4 sm:px-6 bg-white relative">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0e031a]">
          We Value <span className="text-purple-500">Your Feedback</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Help us improve MockMate — your insights power our platform.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white/60 backdrop-blur-md border border-gray-200 p-8 rounded-2xl shadow-xl">
        {submitted ? (
          <div className="text-center text-green-600 flex flex-col items-center">
            <AiOutlineCheckCircle size={40} className="mb-2" />
            <p className="text-lg font-medium">Thank you for your feedback!</p>
            <p className="text-sm text-gray-500 mt-1">We truly appreciate your input.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5E3BEE]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5E3BEE]"
              />
            </div>

            <div>
              <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700 mb-1">
                Feedback
              </label>
              <textarea
                name="feedback"
                value={feedback}
                onChange={onChange}
                required
                placeholder="Your thoughts, ideas, or issues..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5E3BEE]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#0e023f] text-white font-semibold rounded-lg hover:bg-[#150170] transition duration-200"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default FeedbackForm;
