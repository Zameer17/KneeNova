import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FolderOpen,
  FileImage,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  X,
} from "lucide-react";

export default function UploadMRI({ onBack, onContinue }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (file) => {
    setError("");

    if (!file) {
      return;
    }

    const validExtensions = [
      ".dcm",
      ".dicom",
      ".zip",
    ];

    const lowerName = file.name.toLowerCase();

    const isValid =
      validExtensions.some((extension) =>
        lowerName.endsWith(extension)
      );

    if (!isValid) {
      setSelectedFile(null);

      setError(
        "Please select a DICOM file or ZIP archive containing a DICOM study."
      );

      return;
    }

    setSelectedFile(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    handleFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    handleFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError("");
  };

  const handleContinue = () => {
    if (!selectedFile) {
      setError(
        "Please select an MRI study before continuing."
      );
      return;
    }

    onContinue(selectedFile);
  };

  return (
    <main className="upload-page">

      {/* =========================================
          HEADER
      ========================================== */}

      <header className="upload-header">

        <div className="upload-container upload-header-inner">

          <button
            type="button"
            className="upload-brand"
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

          <div className="upload-step-info">
            <span>STEP 01</span>
            <strong>MRI Study Upload</strong>
          </div>

          <button
            type="button"
            className="upload-cancel"
            onClick={onBack}
          >
            Cancel
          </button>

        </div>

      </header>


      {/* =========================================
          MAIN
      ========================================== */}

      <section className="upload-main">

        <div className="upload-container">

          {/* Heading */}

          <motion.div
            className="upload-heading"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            <span className="upload-label">
              NEW MRI STUDY
            </span>

            <h1>
              Upload a knee MRI study.
            </h1>

            <p>
              Add a DICOM study to begin image review
              and analysis. KneeNova supports DICOM
              files and ZIP archives containing a study.
            </p>

          </motion.div>


          {/* Upload area */}

          <motion.div
            className={`drop-zone ${
              dragActive ? "drag-active" : ""
            }`}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => {
              setDragActive(false);
            }}
            onDrop={handleDrop}
          >

            {!selectedFile ? (

              <>
                <div className="upload-icon">
                  <Upload size={25} />
                </div>

                <h2>
                  Drop your MRI study here
                </h2>

                <p>
                  or select a file from your computer
                </p>

                <label className="browse-button">

                  <FolderOpen size={17} />

                  Choose DICOM file

                  <input
                    type="file"
                    accept=".dcm,.dicom,.zip"
                    onChange={handleInputChange}
                    hidden
                  />

                </label>

                <div className="upload-format">

                  <span>
                    DICOM
                  </span>

                  <span>
                    ZIP
                  </span>

                  <span>
                    MRI study
                  </span>

                </div>
              </>

            ) : (

              <div className="selected-file">

                <div className="selected-file-icon">
                  <FileImage size={23} />
                </div>

                <div className="selected-file-info">

                  <strong>
                    {selectedFile.name}
                  </strong>

                  <span>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)}
                    {" "}
                    MB
                  </span>

                </div>

                <CheckCircle2
                  className="file-success"
                  size={21}
                />

                <button
                  type="button"
                  className="remove-file"
                  onClick={clearFile}
                >
                  <X size={17} />
                </button>

              </div>

            )}

          </motion.div>


          {/* Error */}

          {error && (

            <motion.div
              className="upload-error"
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >

              <AlertCircle size={16} />

              <span>
                {error}
              </span>

            </motion.div>

          )}


          {/* Information cards */}

          <div className="upload-info-grid">

            <div className="upload-info-card">

              <div className="info-card-icon blue">
                <ShieldCheck size={19} />
              </div>

              <div>
                <strong>
                  Secure processing
                </strong>

                <p>
                  Study files are processed inside
                  the KneeNova workspace.
                </p>
              </div>

            </div>


            <div className="upload-info-card">

              <div className="info-card-icon green">
                <FileImage size={19} />
              </div>

              <div>
                <strong>
                  DICOM study
                </strong>

                <p>
                  Upload an individual DICOM file or
                  a ZIP containing the study.
                </p>
              </div>

            </div>


            <div className="upload-info-card">

              <div className="info-card-icon gold">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <strong>
                  Ready for review
                </strong>

                <p>
                  Continue to the image workspace after
                  your study is selected.
                </p>
              </div>

            </div>

          </div>


          {/* Continue */}

          <div className="upload-footer-action">

            <div className="upload-security">

              <ShieldCheck size={15} />

              <span>
                Secure medical imaging workflow
              </span>

            </div>

            <button
              type="button"
              className={`continue-button ${
                !selectedFile
                  ? "disabled"
                  : ""
              }`}
              onClick={handleContinue}
            >
              Continue to MRI viewer
              <ArrowRight size={17} />
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}