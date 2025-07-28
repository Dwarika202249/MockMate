import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import FeedbackForm from "../components/FeedbackForm";
import Footer from "../components/Footer";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import FAQs from "../components/FAQs";
import CallToAction from "../components/CallToAction";

const HomePage = () => {

  const location = useLocation();

  useEffect(() => {
    if (location?.state?.scrollTo === "pricing") {
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        setTimeout(() => {
          pricingSection.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQs />
      <CallToAction />
      <FeedbackForm />
      <Footer />
    </div>
  );
};

export default HomePage;
