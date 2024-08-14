import React, { useState } from 'react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', feedback: '' });
  const { name, email, feedback } = formData;
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the form submission, e.g., send data to a server or API
    setSubmitted(true);
    setFormData({ name: '', email: '', feedback: '' });
  };

  return (
    <section className="mt-[20%] py-16 px-4 bg-white">
      <h2 className="text-5xl font-bold mb-12 text-center text-indigo-900">We Value Your Feedback</h2>
      <div className="max-w-lg mx-auto">
        {submitted ? (
          <p className="text-center text-green-500">Thank you for your feedback! We appreciate your input.</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                placeholder="Your Name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="Your Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="feedback" className="block text-gray-700 text-sm font-semibold mb-2">Feedback</label>
              <textarea
                name="feedback"
                value={feedback}
                onChange={onChange}
                required
                placeholder="Your Feedback"
                rows="4"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
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
