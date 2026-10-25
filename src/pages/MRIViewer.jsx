import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  Contrast,
  Info,
  ScanLine,
  Activity,
  Layers3,
  CheckCircle2,
} from "lucide-react";

import dicomParser from "dicom-parser";
import JSZip from "jszip";

import {
  inspectMRI,
  analyzeMRI,
} from "../services/api";

/* =========================================================
   HELPERS
========================================================= */

function getNumber(value, fallback = 0) {
  if (
    value === undefined ||
    value === null
  ) {
    return fallback;
  }

  const number = Number(
    Array.isArray(value)
      ? value[0]
      : value
  );

  return Number.isFinite(number)
    ? number
    : fallback;
}


function getText(value, fallback = "") {
  if (
    value === undefined ||
    value === null
  ) {
    return fallback;
  }

  return String(
    Array.isArray(value)
      ? value[0]
      : value
  );
}


/* =========================================================
   DICOM PARSER
========================================================= */

function parseDicom(buffer, name) {
  const byteArray =
    new Uint8Array(buffer);

  const dataSet =
    dicomParser.parseDicom(
      byteArray
    );

  const rows =
    dataSet.uint16(
      "x00280010"
    );

  const columns =
    dataSet.uint16(
      "x00280011"
    );

  const bitsAllocated =
    dataSet.uint16(
      "x00280100"
    ) || 16;

  const pixelRepresentation =
    dataSet.uint16(
      "x00280103"
    ) || 0;

  const samplesPerPixel =
    dataSet.uint16(
      "x00280002"
    ) || 1;

  const photometric =
    dataSet.string(
      "x00280004"
    ) || "MONOCHROME2";

  const slope =
    getNumber(
      dataSet.string(
        "x00281053"
      ),
      1
    );

  const intercept =
    getNumber(
      dataSet.string(
        "x00281052"
      ),
      0
    );

  const instanceNumber =
    getNumber(
      dataSet.string(
        "x00200013"
      ),
      0
    );

  const seriesUID =
    getText(
      dataSet.string(
        "x0020000e"
      ),
      "UNKNOWN"
    );

  const seriesDescription =
    getText(
      dataSet.string(
        "x0008103e"
      ),
      ""
    );

  const protocolName =
    getText(
      dataSet.string(
        "x00181030"
      ),
      ""
    );

  const imagePositionRaw =
    dataSet.string(
      "x00200032"
    );

  const imagePosition =
    imagePositionRaw
      ? imagePositionRaw
          .split("\\")
          .map(Number)
      : [];

  const imageOrientationRaw =
    dataSet.string(
      "x00200037"
    );

  const imageOrientation =
    imageOrientationRaw
      ? imageOrientationRaw
          .split("\\")
          .map(Number)
      : [];

  const pixelElement =
    dataSet.elements[
      "x7fe00010"
    ];

  if (!pixelElement) {
    throw new Error(
      `Pixel data not found in ${name}`
    );
  }

  if (samplesPerPixel !== 1) {
    throw new Error(
      `${name}: color DICOM is not supported.`
    );
  }

  if (
    bitsAllocated !== 8 &&
    bitsAllocated !== 16
  ) {
    throw new Error(
      `${name}: unsupported BitsAllocated=${bitsAllocated}`
    );
  }

  const pixelOffset =
    pixelElement.dataOffset;

  const pixelLength =
    pixelElement.length;

  let pixels;

  if (bitsAllocated === 8) {
    pixels =
      new Float32Array(
        rows * columns
      );

    for (
      let index = 0;
      index < rows * columns;
      index++
    ) {
      let value =
        byteArray[
          pixelOffset + index
        ];

      if (
        pixelRepresentation === 1 &&
        value > 127
      ) {
        value -= 256;
      }

      pixels[index] =
        value * slope +
        intercept;
    }
  } else {
    const dataView =
      new DataView(
        buffer,
        pixelOffset,
        pixelLength
      );

    pixels =
      new Float32Array(
        rows * columns
      );

    for (
      let index = 0;
      index < rows * columns;
      index++
    ) {
      let value;

      if (
        pixelRepresentation === 1
      ) {
        value =
          dataView.getInt16(
            index * 2,
            true
          );
      } else {
        value =
          dataView.getUint16(
            index * 2,
            true
          );
      }

      pixels[index] =
        value * slope +
        intercept;
    }
  }

  return {
    name,
    rows,
    columns,
    pixels,
    instanceNumber,
    seriesUID,
    seriesDescription,
    protocolName,
    imagePosition,
    imageOrientation,
    photometric,
  };
}


/* =========================================================
   FILE READERS
========================================================= */

async function readDicomFile(file) {
  const buffer =
    await file.arrayBuffer();

  return parseDicom(
    buffer,
    file.name
  );
}


async function readZip(file) {
  const zip =
    await JSZip.loadAsync(file);

  const entries = [];

  zip.forEach(
    (path, entry) => {
      if (
        !entry.dir &&
        !path.endsWith("/")
      ) {
        entries.push(entry);
      }
    }
  );

  const slices = [];

  for (const entry of entries) {
    try {
      const buffer =
        await entry.async(
          "arraybuffer"
        );

      const slice =
        parseDicom(
          buffer,
          entry.name
        );

      slices.push(slice);
    } catch {
      /*
        Ignore files that are not
        readable DICOM images.
      */
    }
  }

  if (!slices.length) {
    throw new Error(
      "No readable DICOM images were found in the ZIP file."
    );
  }

  return slices;
}


/* =========================================================
   SLICE SORTING
========================================================= */

function sortSlices(slices) {
  return [...slices].sort(
    (a, b) => {

      if (
        a.imagePosition.length >= 3 &&
        b.imagePosition.length >= 3
      ) {
        const az =
          Number(
            a.imagePosition[2]
          );

        const bz =
          Number(
            b.imagePosition[2]
          );

        if (
          Number.isFinite(az) &&
          Number.isFinite(bz) &&
          az !== bz
        ) {
          return az - bz;
        }
      }

      return (
        a.instanceNumber -
        b.instanceNumber
      );
    }
  );
}


/* =========================================================
   CANVAS RENDERER
========================================================= */

function renderSlice(
  canvas,
  slice,
  windowCenter,
  windowWidth,
  zoom
) {
  if (
    !canvas ||
    !slice
  ) {
    return;
  }

  const ctx =
    canvas.getContext(
      "2d"
    );

  if (!ctx) {
    return;
  }

  const {
    rows,
    columns,
    pixels,
    photometric,
  } = slice;

  const image =
    ctx.createImageData(
      columns,
      rows
    );

  let lower =
    windowCenter -
    windowWidth / 2;

  let upper =
    windowCenter +
    windowWidth / 2;

  if (
    !Number.isFinite(lower) ||
    !Number.isFinite(upper) ||
    upper <= lower
  ) {
    lower = 0;
    upper = 255;
  }

  for (
    let index = 0;
    index < pixels.length;
    index++
  ) {
    let normalized =
      ((pixels[index] - lower) /
        (upper - lower)) *
      255;

    normalized = Math.max(
      0,
      Math.min(
        255,
        normalized
      )
    );

    if (
      photometric ===
      "MONOCHROME1"
    ) {
      normalized =
        255 - normalized;
    }

    const offset =
      index * 4;

    image.data[offset] =
      normalized;

    image.data[offset + 1] =
      normalized;

    image.data[offset + 2] =
      normalized;

    image.data[offset + 3] =
      255;
  }

  canvas.width =
    columns;

  canvas.height =
    rows;

  ctx.putImageData(
    image,
    0,
    0
  );

  canvas.style.transform =
    `scale(${zoom})`;
}


/* =========================================================
   MAIN VIEWER
========================================================= */

export default function MRIViewer({
  studyFile,
  onBack,
  onAnalyze,
}) {
  const canvasRef =
    useRef(null);

  /* -----------------------------
     Study data
  ----------------------------- */

  const [
    allSlices,
    setAllSlices,
  ] = useState([]);

  const [
    seriesList,
    setSeriesList,
  ] = useState([]);

  const [
    selectedSeriesUID,
    setSelectedSeriesUID,
  ] = useState("");

  const [
    currentSlice,
    setCurrentSlice,
  ] = useState(0);

  /* -----------------------------
     Image controls
  ----------------------------- */

  const [
    zoom,
    setZoom,
  ] = useState(1);

  const [
    windowWidth,
    setWindowWidth,
  ] = useState(800);

  const [
    windowCenter,
    setWindowCenter,
  ] = useState(400);

  /* -----------------------------
     Status
  ----------------------------- */

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    inspecting,
    setInspecting,
  ] = useState(false);

  const [
    analyzing,
    setAnalyzing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    analysisError,
    setAnalysisError,
  ] = useState("");


  /* =======================================================
     LOAD + INSPECT STUDY
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadStudy() {
      if (!studyFile) {
        setError(
          "No MRI study was selected."
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setInspecting(false);
        setError("");
        setAllSlices([]);
        setSeriesList([]);
        setSelectedSeriesUID("");

        const fileName =
          studyFile.name.toLowerCase();

        let loadedSlices = [];

        /* ---------------------------------
           Read browser-side DICOM
        --------------------------------- */

        if (
          fileName.endsWith(".zip")
        ) {
          loadedSlices =
            await readZip(
              studyFile
            );
        } else if (
          fileName.endsWith(".dcm") ||
          fileName.endsWith(".dicom")
        ) {
          loadedSlices = [
            await readDicomFile(
              studyFile
            ),
          ];
        } else {
          throw new Error(
            "Please upload a DICOM file or ZIP study."
          );
        }

        if (cancelled) {
          return;
        }

        setAllSlices(
          loadedSlices
        );

        /* ---------------------------------
           Backend inspection
        --------------------------------- */

        if (
          fileName.endsWith(".zip")
        ) {
          try {
            setInspecting(true);

            const info =
              await inspectMRI(
                studyFile
              );

            if (cancelled) {
              return;
            }

            const detectedSeries =
              Array.isArray(
                info.series
              )
                ? info.series
                : [];

            setSeriesList(
              detectedSeries
            );

            /* ---------------------------------
               Prefer Sagittal series
            --------------------------------- */

            const sagittal =
              detectedSeries.find(
                (series) =>
                  String(
                    series.plane
                  ).toLowerCase() ===
                  "sagittal"
              );

            const preferred =
              sagittal ||
              detectedSeries[0];

            if (preferred) {
              setSelectedSeriesUID(
                preferred.series_uid
              );
            }
          } catch (inspectionError) {
            console.warn(
              "Backend inspection failed:",
              inspectionError
            );

            /*
              Don't stop the viewer.
              We can still use the
              browser-side DICOM data.
            */
          } finally {
            if (!cancelled) {
              setInspecting(false);
            }
          }
        } else {
          /* Single DICOM */
          const first =
            loadedSlices[0];

          if (first) {
            setSelectedSeriesUID(
              first.seriesUID
            );

            setSeriesList([
              {
                series_uid:
                  first.seriesUID,
                plane: "Unknown",
                slice_count: 1,
                description:
                  first.seriesDescription,
                protocol:
                  first.protocolName,
              },
            ]);
          }
        }

      } catch (loadError) {

        if (!cancelled) {
          setError(
            loadError.message ||
            "Unable to load MRI study."
          );
        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStudy();

    return () => {
      cancelled = true;
    };
  }, [studyFile]);


  /* =======================================================
     SELECTED SERIES
  ======================================================= */

  const selectedSlices =
    useMemo(() => {

      if (!selectedSeriesUID) {
        return sortSlices(
          allSlices
        );
      }

      return sortSlices(
        allSlices.filter(
          (slice) =>
            slice.seriesUID ===
            selectedSeriesUID
        )
      );

    }, [
      allSlices,
      selectedSeriesUID,
    ]);


  /* =======================================================
     RESET SLICE WHEN SERIES CHANGES
  ======================================================= */

  useEffect(() => {
    setCurrentSlice(0);
    setZoom(1);
  }, [
    selectedSeriesUID,
  ]);


  /* =======================================================
     CURRENT SLICE
  ======================================================= */

  const current =
    selectedSlices[
      currentSlice
    ];


  /* =======================================================
     IMAGE WINDOW INITIALIZATION
  ======================================================= */

  useEffect(() => {

    if (!current) {
      return;
    }

    const values =
      current.pixels;

    let min = Infinity;
    let max = -Infinity;

    for (
      const value of values
    ) {
      min = Math.min(
        min,
        value
      );

      max = Math.max(
        max,
        value
      );
    }

    if (
      Number.isFinite(min) &&
      Number.isFinite(max)
    ) {
      setWindowCenter(
        (min + max) / 2
      );

      setWindowWidth(
        Math.max(
          1,
          max - min
        )
      );
    }

  }, [
    current,
  ]);


  /* =======================================================
     DRAW IMAGE
  ======================================================= */

  useEffect(() => {
    renderSlice(
      canvasRef.current,
      current,
      windowCenter,
      windowWidth,
      zoom
    );
  }, [
    current,
    windowCenter,
    windowWidth,
    zoom,
  ]);


  /* =======================================================
     SELECTED SERIES INFO
  ======================================================= */

  const selectedSeries =
    useMemo(() => {

      return (
        seriesList.find(
          (series) =>
            series.series_uid ===
            selectedSeriesUID
        ) || null
      );

    }, [
      seriesList,
      selectedSeriesUID,
    ]);


  /* =======================================================
     CHANGE SERIES
  ======================================================= */

  const handleSeriesChange =
    (seriesUID) => {

      setSelectedSeriesUID(
        seriesUID
      );

      setAnalysisError("");
    };


  /* =======================================================
     SLICE NAVIGATION
  ======================================================= */

  const previousSlice =
    () => {
      setCurrentSlice(
        (value) =>
          Math.max(
            0,
            value - 1
          )
      );
    };


  const nextSlice =
    () => {
      setCurrentSlice(
        (value) =>
          Math.min(
            selectedSlices.length - 1,
            value + 1
          )
      );
    };


  /* =======================================================
     RESET VIEW
  ======================================================= */

  const resetView =
    () => {

      setZoom(1);

      if (!current) {
        return;
      }

      const values =
        current.pixels;

      let min = Infinity;
      let max = -Infinity;

      for (
        const value of values
      ) {
        min = Math.min(
          min,
          value
        );

        max = Math.max(
          max,
          value
        );
      }

      if (
        Number.isFinite(min) &&
        Number.isFinite(max)
      ) {
        setWindowCenter(
          (min + max) / 2
        );

        setWindowWidth(
          Math.max(
            1,
            max - min
          )
        );
      }
    };


  /* =======================================================
     ANALYZE STUDY
  ======================================================= */

  const handleAnalyze =
    async () => {

      if (!studyFile) {
        setAnalysisError(
          "No MRI study is loaded."
        );

        return;
      }

      if (!selectedSeriesUID) {
        setAnalysisError(
          "Please select an MRI series first."
        );

        return;
      }

      if (
        !studyFile.name
          .toLowerCase()
          .endsWith(".zip")
      ) {
        setAnalysisError(
          "Model analysis currently requires a complete ZIP MRI study."
        );

        return;
      }

      try {

        setAnalyzing(true);
        setAnalysisError("");

        const result =
          await analyzeMRI(
            studyFile,
            selectedSeriesUID
          );

        /*
          Send the real backend result
          to App.jsx.
        */
        onAnalyze(result);

      } catch (analysisFailure) {

        setAnalysisError(
          analysisFailure.message ||
          "KneeNova analysis failed."
        );

      } finally {

        setAnalyzing(false);
      }
    };


  /* =======================================================
     STUDY NAME
  ======================================================= */

  const studyName =
    studyFile?.name ||
    "MRI Study";


  /* =======================================================
     METADATA
  ======================================================= */

  const metadata =
    useMemo(() => {

      if (!current) {
        return null;
      }

      return {
        dimensions:
          `${current.columns} × ${current.rows}`,

        instance:
          current.instanceNumber,

        file:
          current.name,
      };

    }, [
      current,
    ]);


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="viewer-page">

      {/* =========================================
          HEADER
      ========================================== */}

      <header className="viewer-header">

        <div className="viewer-header-left">

          <button
            type="button"
            className="viewer-back"
            onClick={onBack}
            title="Back"
          >
            <ArrowLeft size={17} />
          </button>

          <img
            src="/assets/kneenova-logo.png"
            alt="KneeNova"
            className="viewer-logo"
          />

          <div className="viewer-title">

            <strong>
              MRI Study Viewer
            </strong>

            <span>
              {studyName}
            </span>

          </div>

        </div>


        <div className="viewer-header-right">

          <div className="viewer-status">

            <span />

            {inspecting
              ? "Inspecting study"
              : "Study loaded"}

          </div>

          <button
            type="button"
            className="analyze-button"
            onClick={
              handleAnalyze
            }
            disabled={
              analyzing ||
              !selectedSeriesUID
            }
          >

            <Activity size={16} />

            {analyzing
              ? "Analyzing..."
              : "Analyze study"}

          </button>

        </div>

      </header>


      {/* =========================================
          MAIN WORKSPACE
      ========================================== */}

      <section className="viewer-main">

        <div className="viewer-workspace">


          {/* =====================================
              IMAGE PANEL
          ====================================== */}

          <div className="image-panel">

            <div className="image-panel-top">

              <div>

                <span>
                  MRI VIEW
                </span>

                <strong>
                  {selectedSeries?.plane ||
                    "MRI Image"}
                </strong>

              </div>

              <div className="slice-counter">

                {selectedSlices.length
                  ? `${currentSlice + 1} / ${selectedSlices.length}`
                  : "—"}

              </div>

            </div>


            {/* Image stage */}

            <div className="image-stage">

              {loading ? (

                <div className="viewer-loading">

                  <div className="loading-spinner" />

                  <strong>
                    Loading MRI study
                  </strong>

                  <span>
                    Reading DICOM images...
                  </span>

                </div>

              ) : error ? (

                <div className="viewer-error">

                  <Info size={22} />

                  <strong>
                    Unable to display study
                  </strong>

                  <p>
                    {error}
                  </p>

                </div>

              ) : !current ? (

                <div className="viewer-error">

                  <Info size={22} />

                  <strong>
                    No images in selected series
                  </strong>

                  <p>
                    Choose another MRI series.
                  </p>

                </div>

              ) : (

                <div
                  className="canvas-wrapper"
                >

                  <canvas
                    ref={canvasRef}
                    className="dicom-canvas"
                  />

                </div>

              )}

            </div>


            {/* Slice controls */}

            <div className="viewer-controls">

              <button
                type="button"
                onClick={
                  previousSlice
                }
                disabled={
                  currentSlice === 0 ||
                  !selectedSlices.length
                }
              >
                <ChevronLeft size={18} />
              </button>


              <div className="slice-slider">

                <input
                  type="range"

                  min="0"

                  max={Math.max(
                    0,
                    selectedSlices.length - 1
                  )}

                  value={
                    selectedSlices.length
                      ? currentSlice
                      : 0
                  }

                  onChange={(event) =>
                    setCurrentSlice(
                      Number(
                        event.target.value
                      )
                    )
                  }

                  disabled={
                    !selectedSlices.length
                  }
                />

              </div>


              <button
                type="button"
                onClick={
                  nextSlice
                }
                disabled={
                  !selectedSlices.length ||
                  currentSlice >=
                    selectedSlices.length - 1
                }
              >
                <ChevronRight size={18} />
              </button>

            </div>

          </div>


          {/* =====================================
              SIDEBAR
          ====================================== */}

          <aside className="viewer-sidebar">


            {/* ===================================
                SERIES
            ==================================== */}

            <div className="sidebar-section">

              <div className="sidebar-heading">

                <Layers3 size={16} />

                <span>
                  MRI series
                </span>

              </div>


              <div
                className="series-list"
              >

                {seriesList.length ? (

                  seriesList.map(
                    (series) => {

                      const active =
                        series.series_uid ===
                        selectedSeriesUID;

                      return (
                        <button
                          type="button"
                          key={
                            series.series_uid
                          }

                          className={`series-item ${
                            active
                              ? "active"
                              : ""
                          }`}

                          onClick={() =>
                            handleSeriesChange(
                              series.series_uid
                            )
                          }
                        >

                          <div className="series-item-top">

                            <strong>
                              {series.plane ||
                                "Unknown"}
                            </strong>

                            {active && (
                              <CheckCircle2
                                size={15}
                              />
                            )}

                          </div>


                          <span>
                            {series.slice_count ||
                              0}{" "}
                            slices
                          </span>


                          {series.description && (

                            <small>
                              {series.description}
                            </small>

                          )}

                        </button>
                      );
                    }
                  )

                ) : (

                  <div className="no-series">
                    No series detected.
                  </div>

                )}

              </div>

            </div>


            {/* ===================================
                STUDY
            ==================================== */}

            <div className="sidebar-section">

              <div className="sidebar-heading">

                <ScanLine size={16} />

                <span>
                  Study
                </span>

              </div>


              <div className="study-info">

                <div>

                  <small>
                    File
                  </small>

                  <strong>
                    {studyName}
                  </strong>

                </div>


                <div>

                  <small>
                    Selected series
                  </small>

                  <strong>
                    {selectedSeries?.plane ||
                      "—"}
                  </strong>

                </div>


                <div>

                  <small>
                    Image dimensions
                  </small>

                  <strong>
                    {metadata?.dimensions ||
                      "—"}
                  </strong>

                </div>


                <div>

                  <small>
                    Current slice
                  </small>

                  <strong>
                    {selectedSlices.length
                      ? currentSlice + 1
                      : "—"}
                  </strong>

                </div>

              </div>

            </div>


            {/* ===================================
                IMAGE CONTROLS
            ==================================== */}

            <div className="sidebar-section">

              <div className="sidebar-heading">

                <Contrast size={16} />

                <span>
                  Image controls
                </span>

              </div>


              <div className="control-group">

                <div className="control-label">

                  <span>
                    Brightness
                  </span>

                  <strong>
                    {Math.round(
                      windowCenter
                    )}
                  </strong>

                </div>


                <input
                  type="range"

                  min="-1000"

                  max="3000"

                  value={
                    windowCenter
                  }

                  onChange={(event) =>
                    setWindowCenter(
                      Number(
                        event.target.value
                      )
                    )
                  }

                  disabled={!current}
                />

              </div>


              <div className="control-group">

                <div className="control-label">

                  <span>
                    Contrast
                  </span>

                  <strong>
                    {Math.round(
                      windowWidth
                    )}
                  </strong>

                </div>


                <input
                  type="range"

                  min="50"

                  max="5000"

                  value={
                    windowWidth
                  }

                  onChange={(event) =>
                    setWindowWidth(
                      Number(
                        event.target.value
                      )
                    )
                  }

                  disabled={!current}
                />

              </div>


              <div className="zoom-controls">

                <button
                  type="button"
                  onClick={() =>
                    setZoom(
                      Math.max(
                        0.5,
                        zoom - 0.1
                      )
                    )
                  }
                  disabled={!current}
                >
                  <Minus size={16} />
                </button>


                <span>
                  {Math.round(
                    zoom * 100
                  )}
                  %
                </span>


                <button
                  type="button"
                  onClick={() =>
                    setZoom(
                      Math.min(
                        2,
                        zoom + 0.1
                      )
                    )
                  }
                  disabled={!current}
                >
                  <Plus size={16} />
                </button>


                <button
                  type="button"
                  onClick={
                    resetView
                  }
                  disabled={!current}
                  title="Reset image"
                >
                  <RotateCcw size={15} />
                </button>

              </div>

            </div>


            {/* ===================================
                ANALYSIS CARD
            ==================================== */}

            <div className="analysis-card">

              <div className="analysis-icon">

                <Activity size={20} />

              </div>


              <div>

                <strong>
                  Ready for analysis
                </strong>

                <p>
                  {selectedSeries
                    ? `KneeNova will analyze the selected ${selectedSeries.plane || "MRI"} series.`
                    : "Select an MRI series to begin."}
                </p>

              </div>


              <button
                type="button"
                onClick={
                  handleAnalyze
                }
                disabled={
                  analyzing ||
                  !selectedSeriesUID
                }
              >

                {analyzing
                  ? "Analyzing..."
                  : "Analyze study"}

                <ChevronRight size={15} />

              </button>


              {analysisError && (

                <div className="analysis-error">

                  <Info size={14} />

                  <span>
                    {analysisError}
                  </span>

                </div>

              )}

            </div>


            {/* ===================================
                DISCLAIMER
            ==================================== */}

            <div className="viewer-disclaimer">

              KneeNova provides
              model-generated predictions
              for review and should not be
              used as a standalone medical
              diagnosis.

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}