import { useEffect } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { initializeAuth, setLoggedOut } from "./redux/slices/authSlice";
import { setupAuthListeners } from "./utils/auth";
import "./App.css";

// Auth initializer component (needs to be inside Router)
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize auth state on app load
    dispatch(initializeAuth());

    // Setup global auth event listeners for auto-logout
    const cleanup = setupAuthListeners(navigate, dispatch, setLoggedOut);
    return cleanup;
  }, [dispatch, navigate]);

  return children;
};

function App() {
  return (
    <Router>
      <AuthInitializer>
        <AppRoutes />
      </AuthInitializer>
    </Router>
  );
}

export default App;
