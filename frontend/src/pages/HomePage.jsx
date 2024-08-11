import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Testimonials from '../components/Testimonials'
import FeedbackForm from '../components/FeedbackForm'

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <FeedbackForm />
    </div>
  )
}

export default HomePage