import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import LogoSplash from "./components/LogoSplash";
import Login from "./pages/Login";
import Home from "./pages/Home";
import System from "./pages/System";
import About from "./pages/About";
import UploadMRI from "./pages/UploadMRI";
import MRIViewer from "./pages/MRIViewer";
import Results from "./pages/Results";
import Reports from "./pages/Reports";
import KneeGuide from "./pages/KneeGuide";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [loggedIn, setLoggedIn] = useState(false);

  const [page, setPage] = useState("home");

  const [selectedStudy, setSelectedStudy] = useState(null);

  const [analysisResult, setAnalysisResult] = useState(null);

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
           LOGIN
        ========================================== */

        <Login
          key="login"
          onLogin={() => {
            setLoggedIn(true);
            setPage("home");
          }}
        />

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

          onContinue={(file) => {
            setSelectedStudy(file);
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
            console.log(
              "KneeNova analysis result:",
              result
            );

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
  onHome={() => {
    setPage("home");
  }}
/>

      ) : (

        /* =========================================
           HOME
        ========================================== */

        <Home
          key="home"

          onLogout={() => {
            setLoggedIn(false);

            setPage("home");

            setSelectedStudy(null);

            setAnalysisResult(null);
          }}

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