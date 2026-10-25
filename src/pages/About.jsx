import { motion } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Upload,
  ScanLine,
  Brain,
  Activity,
  FileText,
  Layers3,
  ShieldCheck,
  Image as ImageIcon,
  Database,
  Workflow,
  CheckCircle2,
} from "lucide-react";

const workflowSteps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload study",
    text: "Add a knee MRI study to the KneeNova workspace using a DICOM study or supported archive.",
  },
  {
    number: "02",
    icon: Layers3,
    title: "Prepare imaging",
    text: "The study is read, organized into imaging series, and prepared for image review.",
  },
  {
    number: "03",
    icon: ScanLine,
    title: "Review MRI",
    text: "Navigate through the selected series and review individual MRI slices.",
  },
  {
    number: "04",
    icon: Brain,
    title: "Run analysis",
    text: "The trained KneeNova model processes the selected study and produces prediction scores.",
  },
  {
    number: "05",
    icon: Activity,
    title: "Review findings",
    text: "View prediction scores across the twelve KneeNova abnormality categories.",
  },
  {
    number: "06",
    icon: FileText,
    title: "Generate report",
    text: "Move the findings into a structured report that can be reviewed or printed.",
  },
];

const categories = [
  {
    group: "Ligaments",
    items: ["ACL", "MCL"],
  },
  {
    group: "Menisci",
    items: [
      "Medial Meniscus",
      "Lateral Meniscus",
    ],
  },
  {
    group: "Osteoarthritis",
    items: [
      "Medial OA",
      "Lateral OA",
      "PF OA",
    ],
  },
  {
    group: "Joint / Fluid",
    items: [
      "Effusion",
      "Synovitis",
      "Baker's",
    ],
  },
  {
    group: "Bone",
    items: [
      "Contusion",
      "Fracture",
    ],
  },
];

const architecture = [
  {
    icon: ImageIcon,
    title: "MRI Study",
    subtitle: "DICOM / ZIP",
  },
  {
    icon: Workflow,
    title: "Image Processing",
    subtitle: "Prepare & organize",
  },
  {
    icon: Brain,
    title: "KneeNova Model",
    subtitle: "Image analysis",
  },
  {
    icon: Activity,
    title: "12 Predictions",
    subtitle: "Finding scores",
  },
  {
    icon: FileText,
    title: "Report",
    subtitle: "Structured output",
  },
];

export default function About({ onBack, onAnalyze }) {
  return (
    <main className="about-page">

      {/* =========================================
          HEADER
      ========================================== */}

      <header className="about-navbar">

        <div className="about-container about-nav-inner">

          <button
            type="button"
            className="about-brand"
            onClick={onBack}
          >
            <img
              src="/assets/kneenova-logo.png"
              alt="KneeNova"
            />

            <div>
              <strong>KneeNova</strong>

              <span>
                Medical Workspace
              </span>
            </div>
          </button>

          <button
            type="button"
            className="about-back"
            onClick={onBack}
          >
            <ArrowLeft size={15} />
            Back to workspace
          </button>

        </div>

      </header>


      {/* =========================================
          HERO
      ========================================== */}

      <section className="about-hero">

        <div className="about-container about-hero-grid">

          <motion.div
            className="about-hero-copy"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            <span className="about-label">
              ABOUT KNEENOVA
            </span>

            <h1>
              From MRI study
              <br />
              to structured
              <span> insight.</span>
            </h1>

            <p>
              KneeNova brings knee MRI viewing, image
              analysis, finding review, and structured
              reporting together in one focused medical
              imaging workspace.
            </p>

            <div className="about-hero-actions">

              <button
                type="button"
                className="about-primary-action"
                onClick={onAnalyze}
              >
                Analyze a new MRI
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="about-secondary-action"
                onClick={() =>
                  document
                    .getElementById(
                      "kneenova-workflow"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                See how it works
              </button>

            </div>

          </motion.div>


          {/* Product summary card */}

          <motion.div
            className="about-product-card"
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
          >

            <div className="product-card-top">

              <div className="product-card-icon">
                <Activity size={22} />
              </div>

              <span className="product-live">
                WORKSPACE
              </span>

            </div>

            <h2>
              One connected MRI workflow.
            </h2>

            <p>
              Keep the study, image viewer, analysis,
              findings, and report connected throughout
              the examination workflow.
            </p>

            <div className="product-card-stats">

              <div>
                <strong>
                  12
                </strong>

                <span>
                  Finding categories
                </span>
              </div>

              <div>
                <strong>
                  DICOM
                </strong>

                <span>
                  Imaging workflow
                </span>
              </div>

              <div>
                <strong>
                  01
                </strong>

                <span>
                  Connected workspace
                </span>
              </div>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =========================================
          WHAT KNEENOVA DOES
      ========================================== */}

      <section className="about-capabilities">

        <div className="about-container">

          <div className="about-section-heading">

            <span className="about-label">
              WHAT KNEENOVA DOES
            </span>

            <h2>
              The important parts of the
              <br />
              MRI workflow, together.
            </h2>

            <p>
              KneeNova is built around the study itself,
              keeping image preparation, visualization,
              analysis, findings, and reporting connected.
            </p>

          </div>


          <div className="capability-grid">

            <div className="capability-card">

              <div className="capability-icon blue">
                <Database size={20} />
              </div>

              <span>
                01
              </span>

              <h3>
                Study management
              </h3>

              <p>
                Add a complete MRI study and keep its
                imaging information organized.
              </p>

            </div>


            <div className="capability-card">

              <div className="capability-icon green">
                <ScanLine size={20} />
              </div>

              <span>
                02
              </span>

              <h3>
                MRI viewing
              </h3>

              <p>
                Navigate imaging series and individual
                slices inside a focused viewer.
              </p>

            </div>


            <div className="capability-card">

              <div className="capability-icon gold">
                <Brain size={20} />
              </div>

              <span>
                03
              </span>

              <h3>
                Image analysis
              </h3>

              <p>
                Process a selected MRI series through
                the trained KneeNova model.
              </p>

            </div>


            <div className="capability-card">

              <div className="capability-icon blue">
                <Activity size={20} />
              </div>

              <span>
                04
              </span>

              <h3>
                Finding review
              </h3>

              <p>
                Present scores across twelve knee
                abnormality categories in one view.
              </p>

            </div>


            <div className="capability-card">

              <div className="capability-icon green">
                <FileText size={20} />
              </div>

              <span>
                05
              </span>

              <h3>
                Structured reports
              </h3>

              <p>
                Move the analysis into an organized
                report ready for review and printing.
              </p>

            </div>


            <div className="capability-card">

              <div className="capability-icon gold">
                <ShieldCheck size={20} />
              </div>

              <span>
                06
              </span>

              <h3>
                Clear presentation
              </h3>

              <p>
                Keep technical information understandable
                throughout the user experience.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          WORKFLOW DIAGRAM
      ========================================== */}

      <section
        id="kneenova-workflow"
        className="about-workflow"
      >

        <div className="about-container">

          <div className="about-section-heading centered">

            <span className="about-label">
              KNEENOVA WORKFLOW
            </span>

            <h2>
              Study to report.
            </h2>

            <p>
              Each step connects to the next so the
              examination remains easy to follow.
            </p>

          </div>


          <div className="workflow-diagram">

            {workflowSteps.map(
              (step, index) => {

                const Icon = step.icon;

                return (
                  <div
                    className="workflow-item"
                    key={step.number}
                  >

                    <motion.div
                      className="workflow-node"
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                      }}
                      whileInView={{
                        opacity: 1,
                        scale: 1,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.4,
                        delay:
                          index * 0.07,
                      }}
                    >

                      <span className="workflow-number">
                        {step.number}
                      </span>

                      <div className="workflow-icon">
                        <Icon size={20} />
                      </div>

                      <h3>
                        {step.title}
                      </h3>

                      <p>
                        {step.text}
                      </p>

                    </motion.div>


                    {index <
                      workflowSteps.length - 1 && (
                      <div className="workflow-connector">
                        <ArrowRight size={16} />
                      </div>
                    )}

                  </div>
                );

              }
            )}

          </div>

        </div>

      </section>


      {/* =========================================
          INSIDE ANALYSIS
      ========================================== */}

      <section className="analysis-overview">

        <div className="about-container analysis-grid">

          <div className="analysis-copy">

            <span className="about-label">
              INSIDE THE ANALYSIS
            </span>

            <h2>
              What happens after
              <br />
              you press analyze?
            </h2>

            <p>
              KneeNova takes the selected MRI study
              through a defined image-processing and
              prediction workflow before returning the
              result to the interface.
            </p>

            <div className="analysis-points">

              <div>
                <CheckCircle2 size={16} />
                Study series is selected
              </div>

              <div>
                <CheckCircle2 size={16} />
                Images are prepared for inference
              </div>

              <div>
                <CheckCircle2 size={16} />
                Representative slices are processed
              </div>

              <div>
                <CheckCircle2 size={16} />
                Twelve prediction scores are returned
              </div>

            </div>

          </div>


          <div className="analysis-process-card">

            <div className="process-title">
              MODEL PIPELINE
            </div>


            <div className="process-stack">

              <div className="process-box">
                <ImageIcon size={18} />
                <div>
                  <strong>
                    MRI series
                  </strong>
                  <span>
                    Selected imaging data
                  </span>
                </div>
              </div>


              <div className="process-arrow-down">
                ↓
              </div>


              <div className="process-box">
                <Workflow size={18} />
                <div>
                  <strong>
                    Preprocessing
                  </strong>
                  <span>
                    Prepare images for inference
                  </span>
                </div>
              </div>


              <div className="process-arrow-down">
                ↓
              </div>


              <div className="process-box highlighted">
                <Brain size={18} />
                <div>
                  <strong>
                    KneeNova model
                  </strong>
                  <span>
                    Image-based prediction
                  </span>
                </div>
              </div>


              <div className="process-arrow-down">
                ↓
              </div>


              <div className="process-box">
                <Activity size={18} />
                <div>
                  <strong>
                    Prediction scores
                  </strong>
                  <span>
                    12 abnormality outputs
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          12 CATEGORIES
      ========================================== */}

      <section className="about-categories">

        <div className="about-container">

          <div className="about-section-heading">

            <span className="about-label">
              ASSESSMENT CATEGORIES
            </span>

            <h2>
              Twelve findings,
              <br />
              organized by region.
            </h2>

            <p>
              KneeNova currently presents prediction
              scores across twelve abnormality categories.
            </p>

          </div>


          <div className="category-groups">

            {categories.map(
              (category) => (
                <div
                  className="category-group"
                  key={category.group}
                >

                  <div className="category-group-header">

                    <span>
                      {category.group}
                    </span>

                    <div />

                  </div>


                  <div className="category-items">

                    {category.items.map(
                      (item) => (
                        <div
                          className="category-item"
                          key={item}
                        >

                          <span className="category-check">
                            ✓
                          </span>

                          {item}

                        </div>
                      )
                    )}

                  </div>

                </div>
              )
            )}

          </div>

        </div>

      </section>


      {/* =========================================
          SYSTEM ARCHITECTURE
      ========================================== */}

      <section className="architecture-section">

        <div className="about-container">

          <div className="about-section-heading centered">

            <span className="about-label">
              SYSTEM ARCHITECTURE
            </span>

            <h2>
              How the pieces connect.
            </h2>

            <p>
              The KneeNova interface communicates with
              a processing layer that handles the imaging
              workflow and model inference.
            </p>

          </div>


          <div className="architecture-diagram">

            <div className="architecture-user">

              <div className="architecture-user-icon">
                <Activity size={22} />
              </div>

              <strong>
                User
              </strong>

              <span>
                KneeNova workspace
              </span>

            </div>


            <div className="architecture-flow">

              {architecture.map(
                (item, index) => {

                  const Icon =
                    item.icon;

                  return (
                    <div
                      className="architecture-step"
                      key={item.title}
                    >

                      <div
                        className={`architecture-box ${
                          index === 2
                            ? "active"
                            : ""
                        }`}
                      >

                        <Icon size={19} />

                        <strong>
                          {item.title}
                        </strong>

                        <span>
                          {item.subtitle}
                        </span>

                      </div>


                      {index <
                        architecture.length - 1 && (
                        <div className="architecture-arrow">
                          <ArrowRight size={16} />
                        </div>
                      )}

                    </div>
                  );

                }
              )}

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          MRI VIEWER
      ========================================== */}

      <section className="viewer-overview">

        <div className="about-container viewer-grid">

          <div className="viewer-visual">

            <div className="viewer-window">

              <div className="fake-viewer-top">

                <span>
                  MRI STUDY VIEWER
                </span>

                <span>
                  12 / 36
                </span>

              </div>


              <div className="fake-mri-area">

                <div className="fake-knee">

                  <div className="fake-bone top" />
                  <div className="fake-joint" />
                  <div className="fake-bone bottom" />

                  <div className="fake-ligament blue" />
                  <div className="fake-ligament green" />

                </div>

              </div>


              <div className="fake-controls">

                <span>
                  Slice
                </span>

                <div />

                <span>
                  100%
                </span>

              </div>

            </div>

          </div>


          <div className="viewer-copy">

            <span className="about-label">
              MRI VIEWER
            </span>

            <h2>
              Review the study
              <br />
              before analysis.
            </h2>

            <p>
              The imaging workspace is designed to keep
              the MRI visible while providing controls for
              slice navigation, image adjustment, zoom,
              and study information.
            </p>


            <div className="viewer-features">

              <div>
                <ScanLine size={16} />
                Series-aware study review
              </div>

              <div>
                <Layers3 size={16} />
                Slice navigation
              </div>

              <div>
                <Activity size={16} />
                Analysis from the selected series
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          RESPONSIBLE USE
      ========================================== */}

      <section className="responsible-section">

        <div className="about-container">

          <div className="responsible-card">

            <div className="responsible-icon">
              <ShieldCheck size={23} />
            </div>

            <div>

              <span className="about-label">
                RESPONSIBLE USE
              </span>

              <h2>
                Clear results, clear context.
              </h2>

              <p>
                KneeNova presents model-generated prediction
                scores to support image review. The results
                should be considered together with the MRI
                study and appropriate clinical information,
                and should not be treated as a standalone
                diagnosis.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          FINAL CTA
      ========================================== */}

      <section className="about-final">

        <div className="about-container">

          <div className="final-card">

            <div>

              <span className="about-label">
                KNEENOVA
              </span>

              <h2>
                Ready to explore a study?
              </h2>

              <p>
                Move from MRI upload to image review,
                analysis, findings, and reporting in
                one connected workspace.
              </p>

            </div>


            <div className="final-actions">

              <button
                type="button"
                className="about-primary-action"
                onClick={onAnalyze}
              >
                Analyze a new MRI
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="about-secondary-action"
                onClick={onBack}
              >
                Back to workspace
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          FOOTER
      ========================================== */}

      <footer className="about-footer">

        <div className="about-container about-footer-inner">

          <div>
            <strong>
              KneeNova
            </strong>

            <span>
              Medical Imaging Workspace
            </span>
          </div>

          <span>
            © 2026 KneeNova
          </span>

        </div>

      </footer>

    </main>
  );
}