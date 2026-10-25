import { motion } from "framer-motion";
import {
  ArrowLeft,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText,
  RefreshCw,
} from "lucide-react";

const getLevel = (score) => {
  if (score >= 0.65) {
    return {
      label: "High",
      className: "high",
    };
  }

  if (score >= 0.50) {
    return {
      label: "Moderate",
      className: "moderate",
    };
  }

  return {
    label: "Low",
    className: "low",
  };
};

export default function Results({
  result,
  onBack,
  onReport,
}) {
  const predictions =
    result?.predictions || [];

  const sortedPredictions =
    [...predictions].sort(
      (a, b) =>
        b.score - a.score
    );

  const topFinding =
    sortedPredictions[0];

  return (
    <main className="results-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="results-header">

        <div className="results-header-left">

          <button
            type="button"
            className="results-back"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
          </button>

          <img
            src="/assets/kneenova-logo.png"
            alt="KneeNova"
            className="results-logo"
          />

          <div className="results-title">

            <strong>
              Analysis Results
            </strong>

            <span>
              {result?.study_file ||
                "MRI Study"}
            </span>

          </div>

        </div>


        <div className="results-header-right">

          <div className="results-status">
            <span />
            Analysis complete
          </div>

          <button
            type="button"
            className="report-button"
            onClick={onReport}
          >
            <FileText size={16} />
            Generate report
          </button>

        </div>

      </header>


      {/* =====================================
          MAIN
      ====================================== */}

      <section className="results-main">

        <div className="results-container">

          {/* Page heading */}

          <motion.div
            className="results-page-heading"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >

            <div>

              <span className="results-label">
                KNEENOVA ANALYSIS
              </span>

              <h1>
                Study findings
              </h1>

              <p>
                Model-generated prediction scores
                across the twelve KneeNova assessment
                categories.
              </p>

            </div>

            <div className="results-meta">

              <div>
                <small>
                  SERIES
                </small>

                <strong>
                  {result?.series_uid
                    ? result.series_uid.slice(
                        0,
                        18
                      ) + "..."
                    : "—"}
                </strong>
              </div>

              <div>
                <small>
                  SLICES
                </small>

                <strong>
                  {result?.slice_count ||
                    "—"}
                </strong>
              </div>

              <div>
                <small>
                  MODEL
                </small>

                <strong>
                  KneeNova
                </strong>
              </div>

            </div>

          </motion.div>


          {/* =================================
              SUMMARY
          ================================== */}

          <div className="results-summary">

            <div className="summary-card">

              <div className="summary-card-icon blue">
                <Activity size={21} />
              </div>

              <div>

                <span>
                  TOP MODEL FINDING
                </span>

                <strong>
                  {topFinding?.abnormality ||
                    "No result"}
                </strong>

                <small>
                  {topFinding
                    ? `${(
                        topFinding.score *
                        100
                      ).toFixed(1)}% prediction score`
                    : "—"}
                </small>

              </div>

            </div>


            <div className="summary-card">

              <div className="summary-card-icon green">
                <CheckCircle2 size={21} />
              </div>

              <div>

                <span>
                  CATEGORIES ANALYZED
                </span>

                <strong>
                  {predictions.length}
                </strong>

                <small>
                  Assessment categories
                </small>

              </div>

            </div>


            <div className="summary-card">

              <div className="summary-card-icon gold">
                <Activity size={21} />
              </div>

              <div>

                <span>
                  CHECKPOINT
                </span>

                <strong>
                  Epoch{" "}
                  {result?.checkpoint_epoch ??
                    "—"}
                </strong>

                <small>
                  KneeNova final model
                </small>

              </div>

            </div>

          </div>


          {/* =================================
              FINDINGS
          ================================== */}

          <div className="findings-heading">

            <div>

              <span className="results-label">
                FINDINGS
              </span>

              <h2>
                Prediction overview
              </h2>

            </div>

            <span className="finding-count">
              {predictions.length} categories
            </span>

          </div>


          <div className="findings-grid">

            {sortedPredictions.map(
              (item, index) => {

                const percentage =
                  item.score * 100;

                const level =
                  getLevel(
                    item.score
                  );

                return (
                  <motion.div
                    className="finding-card"
                    key={
                      item.abnormality
                    }
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.04,
                    }}
                  >

                    <div className="finding-top">

                      <div>

                        <span className="finding-rank">
                          #{index + 1}
                        </span>

                        <h3>
                          {item.abnormality}
                        </h3>

                      </div>

                      <span
                        className={`finding-level ${level.className}`}
                      >
                        {level.label}
                      </span>

                    </div>


                    <div className="finding-score-row">

                      <strong>
                        {percentage.toFixed(1)}%
                      </strong>

                      <span>
                        Prediction score
                      </span>

                    </div>


                    <div className="score-track">

                      <div
                        className={`score-fill ${level.className}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>


                    <div className="finding-footer">

                      {level.label ===
                      "High" ? (
                        <>
                          <AlertCircle
                            size={14}
                          />

                          <span>
                            Higher model score
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2
                            size={14}
                          />

                          <span>
                            Model score for review
                          </span>
                        </>
                      )}

                    </div>

                  </motion.div>
                );
              }
            )}

          </div>


          {/* =================================
              ACTIONS
          ================================== */}

          <div className="results-actions">

            <button
              type="button"
              className="secondary-result-button"
              onClick={onBack}
            >
              <RefreshCw size={16} />
              Review MRI again
            </button>

            <button
              type="button"
              className="primary-result-button"
              onClick={onReport}
            >
              <FileText size={17} />
              Generate structured report
            </button>

          </div>


          {/* =================================
              DISCLAIMER
          ================================== */}

          <div className="results-disclaimer">

            <AlertCircle size={15} />

            <p>
              These values are model-generated
              prediction scores. They are intended
              to support image review and should
              not be interpreted as a standalone
              medical diagnosis.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}