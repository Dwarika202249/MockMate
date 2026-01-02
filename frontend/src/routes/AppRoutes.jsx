import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

import HomePage from "../pages/Home/HomePage";
import About from "../pages/About/About";
import PricingPage from "../pages/Pricing/PricingPage";
import TermsPage from "../pages/Legal/TermsPage";
import PrivacyPage from "../pages/Legal/PrivacyPage";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../components/dashboard/Dashboard";
import Progress from "../components/dashboard/Progress";
import InterviewHistory from "../components/interview/InterviewHistory";
import FAQs from "../components/faqs/FAQs";
import Settings from "../components/shared/Settings";
import FreeInterviewPage from "../pages/Interview/FreeInterviewPage";
import FreeInterviewPreparationPage from "../pages/Interview/FreeInterviewPreparationPage";
import InterviewDetails from "../components/interview/InterviewDetails";
import ResumePage from "../pages/Interview/ResumePage";
import ResumeInterviewPage from "../pages/Interview/ResumeInterviewPage";
import FeedbackPage from "../pages/Feedback/FeedbackPage";

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element, restricted }) => {
  return isAuthenticated() && restricted ? (
    <Navigate to="/dashboard" />
  ) : (
    element
  );
};

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route
          path="/login"
          element={<PublicRoute element={<Login />} restricted={true} />}
        />
        <Route
          path="/register"
          element={<PublicRoute element={<Register />} restricted={true} />}
        />
        
        {/* Interview Routes */}
        <Route
          path="/resume-interview/:interviewId"
          element={<PrivateRoute element={<ResumeInterviewPage />} />}
        />
        <Route
          path="/feedback/:interviewId"
          element={<PrivateRoute element={<FeedbackPage />} />}
        />
        <Route
          path="/resume/:id?"
          element={<PrivateRoute element={<ResumePage />} />}
        />
        <Route
          path="/dashboard/*"
          element={<PrivateRoute element={<DashboardLayout />} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="progress" element={<Progress />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="interview-history" element={<InterviewHistory />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/resume-interview/:interviewId" element={<ResumeInterviewPage />} />
        <Route path="/interview/prepare/:interviewId" element={<PrivateRoute element={<FreeInterviewPreparationPage />} />} />
        <Route path="/interview/:interviewId" element={<FreeInterviewPage />} />
        <Route path="/history/:interviewId/details" element={<InterviewDetails />} />
      </Routes>
  );
}

export default AppRoutes;
