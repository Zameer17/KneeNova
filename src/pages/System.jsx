import { motion } from "framer-motion";
import {
  Database,
  ScanLine,
  Brain,
  Activity,
  FileText,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Database,
    title: "MRI Study",
    text: "A knee MRI study is added to the KneeNova workspace and organized by its available imaging series.",
    color: "blue",
  },
  {
    number: "02",
    icon: ScanLine,
    title: "Image Processing",
    text: "The selected MRI series is prepared and converted into the image format required for analysis.",
    color: "green",
  },
  {
    number: "03",
    icon: Brain,
    title: "KneeNova Analysis",
    text: "The trained KneeNova model evaluates the study across twelve knee abnormality categories.",
    color: "blue",
  },
  {
    number: "04",
    icon: Activity,
    title: "Findings",
    text: "Prediction scores are organized into a clear results view for easier study review.",
    color: "gold",
  },
  {
    number: "05",
    icon: FileText,
    title: "Structured Report",
    text: "The findings can be reviewed and organized into a structured research report.",
    color: "green",
  },
];

const categories = [
  "ACL",
  "MCL",
  "Medial Meniscus",
  "Lateral Meniscus",
  "Medial OA",
  "Lateral OA",
  "PF OA",
  "Effusion",
  "Synovitis",
  "Baker's",
  "Contusion",
  "Fracture",
];

export default function System({ onBack }) {
  return (
    <main className="system-page">

      {/* Navigation */}
      <header className="system-navbar">
        <div className="system-container system-nav-inner">

          <button
            className="system-brand"
            type="button"
            onClick={onBack}
          >
            <img
              src="/assets/kneenova-logo.png"
              alt="KneeNova"
            />

            <div>
              <strong>KneeNova</strong>
              <span>Medical Workspace</span>
            </div>
          </button>

          <button
            className="back-home"
            type="button"
            onClick={onBack}
          >
            Back to workspace
            <ArrowRight size={15} />
          </button>

        </div>
      </header>

      {/* Hero */}
      <section className="system-hero">

        <div className="system-container system-hero-inner">

          <motion.div
            className="system-hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >

            <span className="system-label">
              HOW KNEENOVA WORKS
            </span>

            <h1>
              A focused workflow
              <br />
              from <span>MRI to findings.</span>
            </h1>

            <p>
              KneeNova brings MRI preparation, image analysis,
              findings, and structured reporting together in one
              medical research workspace.
            </p>

            <div className="system-hero-note">
              <ShieldCheck size={17} />

              <span>
                Designed for academic and research use.
              </span>
            </div>

          </motion.div>

          <motion.div
            className="system-overview-card"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >

            <div className="overview-top">

              <div>
                <span>WORKFLOW OVERVIEW</span>
                <strong>Knee MRI Study</strong>
              </div>

              <div className="overview-status">
                <span />
                Ready
              </div>

            </div>

            <div className="overview-flow">

              <div className="overview-node">
                <Database size={18} />
                <span>Study</span>
              </div>

              <div className="overview-line" />

              <div className="overview-node">
                <ScanLine size={18} />
                <span>Imaging</span>
              </div>

              <div className="overview-line" />

              <div className="overview-node active">
                <Brain size={18} />
                <span>Analysis</span>
              </div>

              <div className="overview-line" />

              <div className="overview-node">
                <FileText size={18} />
                <span>Report</span>
              </div>

            </div>

            <div className="overview-footer">
              12 abnormality categories
            </div>

          </motion.div>

        </div>

      </section>

      {/* Process */}
      <section className="process-section">

        <div className="system-container">

          <div className="system-section-heading">

            <span className="system-label">
              THE PROCESS
            </span>

            <h2>
              Four simple stages.
            </h2>

            <p>
              Each stage keeps the examination process
              organized and easy to follow.
            </p>

          </div>

          <div className="process-list">

            {steps.map((step, index) => {

              const Icon = step.icon;

              return (
                <motion.div
                  className="process-row"
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.08,
                  }}
                >

                  <div className="process-number">
                    {step.number}
                  </div>

                  <div
                    className={`process-icon ${step.color}`}
                  >
                    <Icon size={21} />
                  </div>

                  <div className="process-copy">

                    <h3>
                      {step.title}
                    </h3>

                    <p>
                      {step.text}
                    </p>

                  </div>

                  <ArrowRight
                    className="process-arrow"
                    size={18}
                  />

                </motion.div>
              );

            })}

          </div>

        </div>

      </section>

      {/* Categories */}
      <section className="categories-section">

        <div className="system-container categories-grid">

          <div>

            <span className="system-label">
              ASSESSMENT CATEGORIES
            </span>

            <h2>
              Twelve findings.
            </h2>

            <p>
              KneeNova currently evaluates the following
              abnormality categories in its multi-label
              prediction workflow.
            </p>

          </div>

          <div className="category-list">

            {categories.map((category, index) => (
              <div
                className="category-chip"
                key={category}
              >
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                {category}
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* Research */}
      <section className="research-section">

        <div className="system-container">

          <div className="research-card">

            <div className="research-icon">
              <ShieldCheck size={22} />
            </div>

            <div>

              <span className="system-label">
                RESEARCH PLATFORM
              </span>

              <h2>
                Built for academic exploration.
              </h2>

              <p>
                KneeNova is an academic research prototype.
                Its predictions are intended to support study
                exploration and are not a substitute for
                professional medical diagnosis.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="system-footer">

        <div className="system-container system-footer-inner">

          <span>
            KneeNova Medical Workspace
          </span>

          <span>
            Academic Research Platform · 2026
          </span>

        </div>

      </footer>

    </main>
  );
}