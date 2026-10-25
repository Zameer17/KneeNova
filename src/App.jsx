import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import LogoSplash from "./components/LogoSplash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import System from "./pages/System";
import About from "./pages/About";
import UploadMRI from "./pages/UploadMRI";
import MRIViewer from "./pages/MRIViewer";
import Results from "./pages/Results";
import Reports from "./pages/Reports";
import KneeGuide from "./pages/KneeGuide";
import {
  getStoredToken,
  getStoredUser,
  fetchCurrentUser,
  logoutUser,
} from "./services/api";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Authenticated state initialized from storage
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [loggedIn, setLoggedIn] = useState(() => !!getStoredToken());
  const [authView, setAuthView] = useState("login"); // "login" | "signup"

  const [page, setPage] = useState("home");
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Validate session on mount
  useEffect(() => {
    if (getStoredToken()) {
      fetchCurrentUser().then((user) => {
        if (user) {
          setCurrentUser(user);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
          setCurrentUser(null);
        }
      });
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setLoggedIn(true);
    setPage("home");
  };

  const handleLogout = () => {
    logoutUser();
    setLoggedIn(false);
    setCurrentUser(null);
    setAuthView("login");
    setPage("home");
    setSelectedStudy(null);
    setAnalysisResult(null);
  };

  return (
    <AnimatePresence mode="wait">
      {/* =========================================
          LOGO SPLASH
      ========================================== */}
      {showSplash ? (
        <LogoSplash
          key="splash"
          onComplete={() => {
            setShowSplash(false);
          }}
        />
      ) : !loggedIn ? (
        /* =========================================
           AUTHENTICATION (LOGIN / SIGNUP)
        ========================================== */
        authView === "signup" ? (
          <Signup
            key="signup"
            onSignupSuccess={handleLoginSuccess}
            onNavigateLogin={() => setAuthView("login")}
          />
        ) : (
          <Login
            key="login"
            onLogin={handleLoginSuccess}
            onNavigateSignup={() => setAuthView("signup")}
          />
        )
      ) : page === "system" ? (
        /* =========================================
           SYSTEM
        ========================================== */
        <System
          key="system"
          onBack={() => {
            setPage("home");
          }}
        />
      ) : page === "about" ? (
        /* =========================================
           ABOUT
        ========================================== */
        <About
          key="about"
          onBack={() => {
            setPage("home");
          }}
          onAnalyze={() => {
            setPage("upload");
          }}
        />
      ) : page === "knee-guide" ? (
        /* =========================================
           KNEE GUIDE
        ========================================== */
        <KneeGuide
          key="knee-guide"
          onBack={() => {
            setPage("home");
          }}
        />
      ) : page === "upload" ? (
        /* =========================================
           MRI UPLOAD
        ========================================== */
        <UploadMRI
          key="upload"
          onBack={() => {
            setPage("home");
          }}
          onContinue={(study) => {
            console.log("Selected study from UploadMRI:", study);
            setSelectedStudy(study);
            setPage("viewer");
          }}
        />
      ) : page === "viewer" ? (
        /* =========================================
           MRI VIEWER
        ========================================== */
        <MRIViewer
          key="viewer"
          studyFile={selectedStudy}
          onBack={() => {
            setPage("upload");
          }}
          onAnalyze={(result) => {
            console.log("KneeNova analysis result:", result);
            setAnalysisResult(result);
            setPage("results");
          }}
        />
      ) : page === "results" ? (
        /* =========================================
           RESULTS
        ========================================== */
        <Results
          key="results"
          result={analysisResult}
          onBack={() => {
            setPage("viewer");
          }}
          onReport={() => {
            setPage("reports");
          }}
        />
      ) : page === "reports" ? (
        /* =========================================
           REPORTS
        ========================================== */
        <Reports
          key="reports"
          result={analysisResult}
          onBack={() => {
            setPage("results");
          }}
        />
      ) : (
        /* =========================================
           HOME
        ========================================== */
        <Home
          key="home"
          user={currentUser}
          onLogout={handleLogout}
          onSystem={() => {
            setPage("system");
          }}
          onAbout={() => {
            setPage("about");
          }}
          onAnalyze={() => {
            setPage("upload");
          }}
          onKneeGuide={() => {
            setPage("knee-guide");
          }}
        />
      )}
    </AnimatePresence>
  );
}
