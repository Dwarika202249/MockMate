import React from 'react';

const testimonials = [
  {
    name: 'John Doe',
    role: 'Software Engineer',
    message: 'MockMate helped me land my dream job by providing realistic mock interviews and valuable feedback.',
    avatar: 'https://via.placeholder.com/80',
  },
  {
    name: 'Jane Smith',
    role: 'Product Manager',
    message: 'The personalized mock interviews were spot on. The feedback was detailed and actionable.',
    avatar: 'https://via.placeholder.com/80',
  },
  {
    name: 'Sam Wilson',
    role: 'Data Scientist',
    message: 'I appreciated the variety of practice scenarios. It truly prepared me for different types of interviews.',
    avatar: 'https://via.placeholder.com/80',
  },
  {
    name: 'Emily Johnson',
    role: 'UX Designer',
    message: 'Great experience overall. The progress tracking helped me stay focused and motivated.',
    avatar: 'https://via.placeholder.com/80',
  },
];

const Testimonials = () => {
  return (
    <section className="m-10 py-16 px-4">
      <h2 className="text-5xl font-bold mb-10 text-center">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-lg text-center">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{testimonial.name}</h3>
            <p className="text-gray-600 mb-2">{testimonial.role}</p>
            <p className="text-gray-700 italic">"{testimonial.message}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
