import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CaptainRegisterPage from "./pages/RegisterPage";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const { isAuthenticated, isRegistered, loading } = useContext(AuthContext);
  console.log("is authenticated is ", isAuthenticated);
  console.log("is registered is ", isRegistered);
  console.log("is loading is ", loading);

  if (loading) {
    return null; // or spinner / splash screen
  }
  return (
    <div className="app">
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              isRegistered ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/captain-register" replace />
              )
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              isRegistered ? (
                <HomePage />
              ) : (
                <Navigate to="/captain-register" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/captain-register"
          element={
            isAuthenticated ? (
              !isRegistered ? (
                <CaptainRegisterPage />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
