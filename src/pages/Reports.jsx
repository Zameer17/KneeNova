import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  Activity,
  ShieldCheck,
  CalendarDays,
  Layers3,
  ScanLine,
  CheckCircle2,
  Info,
} from "lucide-react";

const getScoreLabel = (score) => {
  if (score >= 0.65) {
    return {
      label: "Higher score",
      className: "higher",
    };
  }

  if (score >= 0.5) {
    return {
      label: "Intermediate score",
      className: "intermediate",
    };
  }

  return {
    label: "Lower score",
    className: "lower",
  };
};

export default function Reports({
  result,
  onBack,
  onHome,
}) {
  const predictions =
    Array.isArray(result?.predictions)
      ? [...result.predictions].sort(
          (a, b) => b.score - a.score
        )
      : [];

  const topFinding =
    predictions.length > 0
      ? predictions[0]
      : null;

  const generatedAt =
    new Date().toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  const averageScore =
    predictions.length
      ? predictions.reduce(
          (total, item) =>
            total + item.score,
          0
        ) / predictions.length
      : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const reportLines = [
      "KNEENOVA",
      "STRUCTURED KNEE MRI ANALYSIS REPORT",
      "",
      `Study file: ${
        result?.study_file || "Not provided"
      }`,
      `Series UID: ${
        result?.series_uid || "Not provided"
      }`,
      `Slices analyzed: ${
        result?.slice_count ?? "Not provided"
      }`,
      `Model checkpoint: ${
        result?.checkpoint_epoch != null
          ? `Epoch ${result.checkpoint_epoch}`
          : "Not provided"
      }`,
      `Generated: ${generatedAt}`,
      "",
      "KEY FINDING",
      topFinding
        ? `${topFinding.abnormality}: ${(
            topFinding.score * 100
          ).toFixed(1)}%`
        : "No prediction available",
      "",
      "PREDICTION FINDINGS",
      "",
      ...predictions.map(
        (item, index) =>
          `${String(index + 1).padStart(
            2,
            "0"
          )}. ${
            item.abnormality
          } — ${(
            item.score * 100
          ).toFixed(1)}%`
      ),
      "",
      "SUMMARY",
      topFinding
        ? `The highest model score was ${
            topFinding.abnormality
          } at ${(
            topFinding.score * 100
          ).toFixed(1)}%.`
        : "No model finding available.",
      "",
      "IMPORTANT NOTE",
      "The displayed values are model-generated prediction scores.",
      "They should be reviewed together with the MRI study and appropriate clinical information.",
      "They are not a standalone medical diagnosis.",
    ];

    const blob = new Blob(
      [reportLines.join("\n")],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "KneeNova_MRI_Report.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <main className="report-page">

      {/* =====================================
          TOP APP HEADER
      ====================================== */}

      <header className="report-app-header">

        <div className="report-app-left">

          <button
            type="button"
            className="report-icon-button"
            onClick={onBack}
            title="Back to results"
          >
            <ArrowLeft size={17} />
          </button>

          <img
            src="/assets/kneenova-logo.png"
            alt="KneeNova"
            className="report-app-logo"
          />

          <div className="report-app-title">

            <strong>
              KneeNova
            </strong>

            <span>
              Structured Report
            </span>

          </div>

        </div>


        <div className="report-app-actions">

          <button
            type="button"
            className="report-header-secondary"
            onClick={handlePrint}
          >
            <Printer size={16} />
            Print
          </button>

          <button
            type="button"
            className="report-header-primary"
            onClick={handleDownload}
          >
            <Download size={16} />
            Download
          </button>

        </div>

      </header>


      {/* =====================================
          REPORT DOCUMENT
      ====================================== */}

      <section className="report-document">

        {/* =================================
            REPORT HEADER
        ================================== */}

        <div className="document-header">

          <div>

            <div className="document-brand">

              <img
                src="/assets/kneenova-logo.png"
                alt=""
              />

              <div>

                <strong>
                  KneeNova
                </strong>

                <span>
                  MEDICAL IMAGING WORKSPACE
                </span>

              </div>

            </div>

            <div className="document-title-block">

              <span>
                STRUCTURED MRI ANALYSIS
              </span>

              <h1>
                Knee MRI Report
              </h1>

              <p>
                Model-generated analysis summary
                for the selected knee MRI study.
              </p>

            </div>

          </div>


          <div className="document-status">

            <CheckCircle2 size={15} />

            <div>

              <strong>
                Analysis complete
              </strong>

              <span>
                {generatedAt}
              </span>

            </div>

          </div>

        </div>


        {/* =================================
            STUDY INFORMATION
        ================================== */}

        <section className="report-section">

          <div className="report-section-header">

            <div className="report-section-icon blue">
              <ScanLine size={17} />
            </div>

            <div>

              <span>
                STUDY
              </span>

              <h2>
                Study information
              </h2>

            </div>

          </div>


          <div className="study-information-grid">

            <div className="study-field wide">

              <span>
                Study file
              </span>

              <strong>
                {result?.study_file ||
                  "Not provided"}
              </strong>

            </div>


            <div className="study-field">

              <span>
                Imaging series
              </span>

              <strong>
                {result?.series_uid
                  ? result.series_uid
                  : "Not provided"}
              </strong>

            </div>


            <div className="study-field">

              <span>
                Slices analyzed
              </span>

              <strong>
                {result?.slice_count ??
                  "Not provided"}
              </strong>

            </div>


            <div className="study-field">

              <span>
                Analysis date
              </span>

              <strong>
                {generatedAt}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================
            SUMMARY CARDS
        ================================== */}

        <section className="report-section">

          <div className="report-section-header">

            <div className="report-section-icon green">
              <Activity size={17} />
            </div>

            <div>

              <span>
                SUMMARY
              </span>

              <h2>
                Analysis overview
              </h2>

            </div>

          </div>


          <div className="report-overview-grid">

            <div className="report-overview-card">

              <div className="overview-card-icon blue">
                <Activity size={19} />
              </div>

              <div>

                <span>
                  HIGHEST MODEL SCORE
                </span>

                <strong>
                  {topFinding?.abnormality ||
                    "No result"}
                </strong>

                <small>
                  {topFinding
                    ? `${(
                        topFinding.score * 100
                      ).toFixed(1)}%`
                    : "—"}
                </small>

              </div>

            </div>


            <div className="report-overview-card">

              <div className="overview-card-icon green">
                <Layers3 size={19} />
              </div>

              <div>

                <span>
                  CATEGORIES
                </span>

                <strong>
                  {predictions.length}
                </strong>

                <small>
                  Findings evaluated
                </small>

              </div>

            </div>


            <div className="report-overview-card">

              <div className="overview-card-icon gold">
                <Activity size={19} />
              </div>

              <div>

                <span>
                  AVERAGE SCORE
                </span>

                <strong>
                  {(
                    averageScore * 100
                  ).toFixed(1)}%
                </strong>

                <small>
                  Across all categories
                </small>

              </div>

            </div>

          </div>

        </section>


        {/* =================================
            KEY FINDING
        ================================== */}

        <section className="key-finding">

          <div className="key-finding-left">

            <div className="key-finding-icon">
              <Activity size={21} />
            </div>

            <div>

              <span>
                HIGHEST MODEL SCORE
              </span>

              <h2>
                {topFinding?.abnormality ||
                  "No finding available"}
              </h2>

              <p>
                {topFinding
                  ? `Prediction score: ${(
                      topFinding.score * 100
                    ).toFixed(1)}%`
                  : "The study did not return a prediction."}
              </p>

            </div>

          </div>


          <div className="key-score">

            <strong>
              {topFinding
                ? `${(
                    topFinding.score * 100
                  ).toFixed(1)}%`
                : "—"}
            </strong>

            <span>
              Model score
            </span>

          </div>

        </section>


        {/* =================================
            FINDINGS TABLE
        ================================== */}

        <section className="report-section">

          <div className="report-section-header">

            <div className="report-section-icon blue">
              <FileText size={17} />
            </div>

            <div>

              <span>
                FINDINGS
              </span>

              <h2>
                Prediction overview
              </h2>

            </div>

          </div>


          <div className="report-findings-table">

            <div className="report-table-head">

              <span>
                #
              </span>

              <span>
                Finding
              </span>

              <span>
                Score
              </span>

              <span>
                Model level
              </span>

            </div>


            {predictions.map(
              (item, index) => {

                const percentage =
                  item.score * 100;

                const level =
                  getScoreLabel(
                    item.score
                  );

                return (
                  <div
                    className="report-table-row"
                    key={
                      item.abnormality
                    }
                  >

                    <span className="report-rank">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>


                    <div className="report-name-cell">

                      <strong>
                        {item.abnormality}
                      </strong>

                    </div>


                    <div className="report-table-score">

                      <strong>
                        {percentage.toFixed(1)}%
                      </strong>

                      <div className="report-table-track">

                        <div
                          className={`report-table-fill ${level.className}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>


                    <span
                      className={`report-model-level ${level.className}`}
                    >
                      {level.label}
                    </span>

                  </div>
                );
              }
            )}

          </div>

        </section>


        {/* =================================
            VISUAL SCORE PROFILE
        ================================== */}

        <section className="report-section">

          <div className="report-section-header">

            <div className="report-section-icon green">
              <Activity size={17} />
            </div>

            <div>

              <span>
                SCORE PROFILE
              </span>

              <h2>
                Twelve-category overview
              </h2>

            </div>

          </div>


          <div className="score-profile">

            {predictions.map(
              (item) => {

                const percentage =
                  item.score * 100;

                return (
                  <div
                    className="profile-row"
                    key={
                      item.abnormality
                    }
                  >

                    <div className="profile-label">
                      {item.abnormality}
                    </div>

                    <div className="profile-track">

                      <div
                        className="profile-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <strong>
                      {percentage.toFixed(1)}%
                    </strong>

                  </div>
                );
              }
            )}

          </div>

        </section>


        {/* =================================
            INTERPRETATION
        ================================== */}

        <section className="report-section">

          <div className="report-section-header">

            <div className="report-section-icon gold">
              <FileText size={17} />
            </div>

            <div>

              <span>
                INTERPRETATION
              </span>

              <h2>
                Analysis summary
              </h2>

            </div>

          </div>


          <div className="interpretation-card">

            {topFinding ? (

              <>
                <p>
                  The KneeNova model generated prediction
                  scores across{" "}
                  <strong>
                    {predictions.length}
                  </strong>{" "}
                  abnormality categories for the
                  selected MRI study.
                </p>

                <p>
                  The highest model score was observed for{" "}
                  <strong>
                    {topFinding.abnormality}
                  </strong>{" "}
                  at{" "}
                  <strong>
                    {(
                      topFinding.score * 100
                    ).toFixed(1)}%
                  </strong>.
                </p>

                <p>
                  The remaining prediction scores are
                  presented in the findings table above
                  for review alongside the corresponding
                  MRI study.
                </p>
              </>

            ) : (

              <p>
                No model-generated prediction result
                is currently available for this report.
              </p>

            )}

          </div>

        </section>


        {/* =================================
            ANALYSIS DETAILS
        ================================== */}

        <section className="report-section">

          <div className="report-section-header">

            <div className="report-section-icon blue">
              <Layers3 size={17} />
            </div>

            <div>

              <span>
                ANALYSIS DETAILS
              </span>

              <h2>
                Model information
              </h2>

            </div>

          </div>


          <div className="analysis-details-grid">

            <div>

              <span>
                Model
              </span>

              <strong>
                KneeNova
              </strong>

            </div>


            <div>

              <span>
                Checkpoint
              </span>

              <strong>
                {result?.checkpoint_epoch != null
                  ? `Epoch ${result.checkpoint_epoch}`
                  : "Not provided"}
              </strong>

            </div>


            <div>

              <span>
                Output type
              </span>

              <strong>
                Multi-label prediction
              </strong>

            </div>


            <div>

              <span>
                Categories
              </span>

              <strong>
                {predictions.length}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================
            IMPORTANT NOTE
        ================================== */}

        <section className="report-important">

          <div className="report-important-icon">

            <Info size={18} />

          </div>

          <div>

            <strong>
              Important information
            </strong>

            <p>
              KneeNova displays model-generated prediction
              scores to support review of the selected MRI
              study. These scores should be considered
              together with the MRI images and appropriate
              clinical information and should not be used
              as a standalone medical diagnosis.
            </p>

          </div>

        </section>


        {/* =================================
            SIGNATURE / FOOTER
        ================================== */}

        <div className="report-document-footer">

          <div>

            <span>
              KNEENOVA
            </span>

            <strong>
              Structured MRI Analysis
            </strong>

          </div>


          <div>

            <span>
              REPORT STATUS
            </span>

            <strong>
              Generated
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================
          BOTTOM ACTIONS
      ====================================== */}

      <div className="report-bottom-actions">

        <button
          type="button"
          className="report-bottom-secondary"
          onClick={onBack}
        >
          <ArrowLeft size={15} />
          Back to results
        </button>

        <button
          type="button"
          className="report-bottom-primary"
          onClick={handlePrint}
        >
          <Printer size={16} />
          Print / Save as PDF
        </button>

        <button
          type="button"
          className="report-bottom-secondary"
          onClick={onHome}
        >
          Back to workspace
        </button>

      </div>

    </main>
  );
}