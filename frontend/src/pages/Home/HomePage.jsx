import Navbar from "../../components/common/Navbar";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import Testimonials from "../../components/home/Testimonials";
import FeedbackForm from "../../components/home/FeedbackForm";
import Footer from "../../components/common/Footer";
import HowItWorks from "../../components/home/HowItWorks";
import Pricing from "../../components/home/Pricing";
import { useLocation } from "react-router-dom";
import FAQs from "../../components/faqs/FAQs";
import CallToAction from "../../components/home/CallToAction";
import { useEffect } from "react";

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
