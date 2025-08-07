import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

import HomePage from "../pages/Home/HomePage";
import About from "../pages/About/About";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../components/dashboard/Dashboard";
import Overview from "../components/dashboard/Overview";
import InterviewHistory from "../components/interview/InterviewHistory";
import FAQs from "../components/faqs/FAQs";
import Settings from "../components/shared/Settings";
import InterviewPage from "../pages/Interview/InterviewPage";
import InterviewDetails from "../components/interview/InterviewDetails";
import ResumePage from "../pages/Interview/ResumePage";
import ResumeInterviewPage from "../pages/Interview/ResumeInterviewPage";

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
        <Route
          path="/login"
          element={<PublicRoute element={<Login />} restricted={true} />}
        />
        <Route
          path="/register"
          element={<PublicRoute element={<Register />} restricted={true} />}
        />
        
        <Route
          path="/dashboard/*"
          element={<PrivateRoute element={<DashboardLayout />} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="overview" element={<Overview />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="resume-interview/:interviewId" element={<ResumeInterviewPage />} />
          <Route path="interview-history" element={<InterviewHistory />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/interview/:interviewId" element={<InterviewPage />} />
        <Route path="/history/:interviewId/details" element={<InterviewDetails />} />
      </Routes>
  );
}

export default AppRoutes;
