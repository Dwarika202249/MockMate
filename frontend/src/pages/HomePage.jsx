import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import FeedbackForm from "../components/FeedbackForm";
import Footer from "../components/Footer";
import HowItWorks from "../components/HowItWorks";

const HomePage = () => {

  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FeedbackForm />
      <Footer />
    </div>
  );
};

export default HomePage;
