import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  ArrowRight,
  ShieldCheck,
  Activity,
  ScanLine,
  ClipboardCheck,
  Users,
} from "lucide-react";

export default function Home({
  onLogout,
  onSystem,
  onAbout,
  onAnalyze,
  onKneeGuide,
}) {
  return (
    <main className="home-page">

      {/* =========================================
          NAVBAR
      ========================================== */}

      <header className="home-navbar">

        <div className="home-container navbar-inner">

          <a
            href="#top"
            className="home-brand"
          >
            <img
              src="/assets/kneenova-logo.png"
              alt="KneeNova"
            />

            <div>
              <strong>KneeNova</strong>
              <span>Medical Workspace</span>
            </div>
          </a>

          <nav className="home-nav">

            <a href="#top">
              Home
            </a>

            <button
  type="button"
  className="home-nav-button"
  onClick={onSystem}
>
  System
            </button>

           <button
  type="button"
  className="home-nav-button"
  onClick={onAbout}
>
  About
</button>

<button
  type="button"
  className="home-nav-button"
  onClick={onKneeGuide}
>
  Knee Guide
</button>

            <a href="#reports-preview">
              Reports
            </a>

          </nav>

          <div className="navbar-actions">

            <button
              className="profile-button"
              type="button"
            >
              <span className="profile-avatar">
                U
              </span>

              <span className="profile-name">
                User
              </span>
            </button>

            <button
              className="logout-button"
              type="button"
              onClick={onLogout}
            >
              Sign out
            </button>

          </div>

        </div>

      </header>


      {/* =========================================
          HERO
      ========================================== */}

      <section
        id="top"
        className="home-hero"
      >

        <div className="home-container hero-grid">

          <motion.div
            className="hero-copy"
            initial={{
              opacity: 0,
              x: -25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              KNEENOVA MEDICAL WORKSPACE
            </div>

            <h1>
              A clearer workspace
              <br />
              for every
              <span> knee study.</span>
            </h1>

            <p>
              Review knee MRI studies, organize findings,
              examine images, and prepare structured reports
              from one focused workspace.
            </p>

            <div className="hero-actions">

              <button
  className="primary-action"
  type="button"
  onClick={onAnalyze}
>
  <Upload size={18} />
  Analyze a new MRI
  <ArrowRight size={17} />
</button>

              <button
                className="secondary-action"
                type="button"
              >
                View recent studies
              </button>

            </div>

            <div className="hero-trust">

              <div>
                <ShieldCheck size={16} />
                Secure workspace
              </div>

              <div>
                <ClipboardCheck size={16} />
                Structured workflow
              </div>

              <div>
                <Activity size={16} />
                Research ready
              </div>

            </div>

          </motion.div>


          {/* =====================================
              HERO MEDICAL PANEL
          ====================================== */}

          <motion.div
            className="hero-panel-wrapper"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.15,
            }}
          >

            <div className="hero-panel">

              <div className="panel-header">

                <div>
                  <span>
                    STUDY WORKSPACE
                  </span>

                  <strong>
                    Knee MRI Analysis
                  </strong>
                </div>

                <div className="panel-status">
                  <span />
                  Ready
                </div>

              </div>

              <div className="scan-preview">

                <div className="scan-grid">

                  <div className="scan-placeholder">
                    <ScanLine size={38} />

                    <span>
                      MRI Study
                    </span>

                    <small>
                      Upload a study to begin
                    </small>
                  </div>

                </div>

                <div className="scan-controls">

                  <div>
                    <span />
                    Sagittal
                  </div>

                  <div>
                    <span />
                    Coronal
                  </div>

                  <div>
                    <span />
                    Axial
                  </div>

                </div>

              </div>

              <div className="panel-footer">

                <div>
                  <small>
                    FINDINGS
                  </small>

                  <strong>
                    12 assessment categories
                  </strong>
                </div>

                <button
                  type="button"
                  className="panel-arrow"
                >
                  <ArrowRight size={18} />
                </button>

              </div>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =========================================
          QUICK ACTIONS
      ========================================== */}

      <section
        id="services"
        className="quick-section"
      >

        <div className="home-container">

          <div className="section-heading">

            <div>
              <span className="section-label">
                WORKSPACE
              </span>

              <h2>
                Start with what you need.
              </h2>
            </div>

            <p>
              Everything you need to move from an MRI
              study to an organized result.
            </p>

          </div>


          <div className="action-grid">

            <motion.button
              className="action-card action-card-primary"
              whileHover={{
                y: -4,
              }}
              type="button"
            >

              <div className="action-icon blue">
                <Upload size={21} />
              </div>

              <div className="action-content">

                <span>
                  NEW STUDY
                </span>

                <h3>
                  Analyze MRI
                </h3>

                <p>
                  Upload a knee MRI study and begin
                  image review.
                </p>

              </div>

              <ArrowRight
                className="action-arrow"
                size={19}
              />

            </motion.button>


            <motion.button
              className="action-card"
              whileHover={{
                y: -4,
              }}
              type="button"
            >

              <div className="action-icon green">
                <FileText size={21} />
              </div>

              <div className="action-content">

                <span>
                  DOCUMENTS
                </span>

                <h3>
                  View Reports
                </h3>

                <p>
                  Review previously generated study
                  reports and findings.
                </p>

              </div>

              <ArrowRight
                className="action-arrow"
                size={19}
              />

            </motion.button>


            <motion.button
              className="action-card"
              whileHover={{
                y: -4,
              }}
              type="button"
            >

              <div className="action-icon gold">
                <Activity size={21} />
              </div>

              <div className="action-content">

                <span>
                  STUDIES
                </span>

                <h3>
                  Study History
                </h3>

                <p>
                  Keep your previous analysis sessions
                  organized in one place.
                </p>

              </div>

              <ArrowRight
                className="action-arrow"
                size={19}
              />

            </motion.button>

          </div>

        </div>

      </section>


      {/* =========================================
          WORKFLOW
      ========================================== */}

      <section className="workflow-section">

        <div className="home-container">

          <div className="section-heading centered">

            <span className="section-label">
              SIMPLE WORKFLOW
            </span>

            <h2>
              From study to report.
            </h2>

            <p>
              A focused workflow designed to keep the
              entire examination process organized.
            </p>

          </div>


          <div className="workflow-grid">

            <div className="workflow-step">

              <span className="step-number">
                01
              </span>

              <div className="step-icon">
                <Upload size={21} />
              </div>

              <h3>
                Upload
              </h3>

              <p>
                Add the knee MRI study to your workspace.
              </p>

            </div>


            <div className="workflow-line" />


            <div className="workflow-step">

              <span className="step-number">
                02
              </span>

              <div className="step-icon">
                <ScanLine size={21} />
              </div>

              <h3>
                Review
              </h3>

              <p>
                Navigate through the MRI views and study
                information.
              </p>

            </div>


            <div className="workflow-line" />


            <div className="workflow-step">

              <span className="step-number">
                03
              </span>

              <div className="step-icon">
                <Activity size={21} />
              </div>

              <h3>
                Analyze
              </h3>

              <p>
                Review the model-generated assessment
                categories.
              </p>

            </div>


            <div className="workflow-line" />


            <div className="workflow-step">

              <span className="step-number">
                04
              </span>

              <div className="step-icon">
                <FileText size={21} />
              </div>

              <h3>
                Report
              </h3>

              <p>
                Organize the findings into a structured
                report.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          ABOUT PREVIEW
      ========================================== */}

      <section
        id="about-preview"
        className="about-preview"
      >

        <div className="home-container about-grid">

          <div>

            <span className="section-label">
              ABOUT KNEENOVA
            </span>

            <h2>
              Built around the
              <span> study.</span>
            </h2>

          </div>

          <div>

            <p>
              KneeNova is an academic medical-imaging
              platform focused on making knee MRI review
              more structured, accessible, and easier to
              understand.
            </p>

            <button
              className="text-link"
              type="button"
            >
              Learn about the system
              <ArrowRight size={17} />
            </button>

          </div>

        </div>

      </section>


      {/* =========================================
          REPORT PREVIEW
      ========================================== */}

      <section
        id="reports-preview"
        className="report-preview"
      >

        <div className="home-container report-card">

          <div className="report-icon">
            <FileText size={22} />
          </div>

          <div className="report-copy">

            <span className="section-label">
              STRUCTURED REPORTING
            </span>

            <h2>
              Keep your study findings organized.
            </h2>

            <p>
              Move from image review to a clean,
              structured report without leaving the
              workspace.
            </p>

          </div>

          <button
            className="outline-action"
            type="button"
          >
            Open Reports
            <ArrowRight size={17} />
          </button>

        </div>

      </section>


      {/* =========================================
          FOOTER
      ========================================== */}

      <footer className="home-footer">

        <div className="home-container footer-inner">

          <div className="footer-brand">

            <img
              src="/assets/kneenova-logo.png"
              alt="KneeNova"
            />

            <div>
              <strong>
                KneeNova
              </strong>

              <span>
                Medical Workspace
              </span>
            </div>

          </div>

          <div className="footer-right">

            <span>
              Academic Research Platform
            </span>

            <span>
              © 2026 KneeNova
            </span>

          </div>

        </div>

      </footer>

    </main>
  );
}