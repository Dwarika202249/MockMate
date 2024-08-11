import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { isAuthenticated } from './utils/auth';
import Settings from './components/Settings';
import DashboardLayout from './components/DashboardLayout';
import Overview from './components/Overview';
import InterviewHistory from './components/InterviewHistory'
import HomePage from "./pages/HomePage";
import InterviewPage from './pages/InterviewPage';

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element, restricted }) => {
  return isAuthenticated() && restricted ? <Navigate to="/dashboard" /> : element;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route
          path="/"
          element={<PublicRoute element={<Login />} restricted={true} />}
        /> */}
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/login"
          element={<PublicRoute element={<Login />} restricted={true} />}
        />
        <Route
          path="/register"
          element={<PublicRoute element={<Register />} restricted={true} />}
        />
        <Route path="/dashboard" element={<PrivateRoute element={<DashboardLayout />} />}>
        <Route index element={<Dashboard />} />
          <Route path="overview" element={<Overview />} />
          <Route path="interview-history" element={<InterviewHistory />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/interview/:interviewId" element={<InterviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
