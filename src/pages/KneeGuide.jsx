import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Info,
  ShieldCheck,
  ChevronRight,
  Crosshair,
} from "lucide-react";

const findings = [
  {
    id: "acl",
    name: "ACL",
    group: "Ligaments",
    location: "Center of the knee",
    short: "Anterior cruciate ligament",
    description:
      "The anterior cruciate ligament is one of the major stabilizing ligaments of the knee. It helps control forward movement and rotational stability.",
    mri:
      "MRI can be used to assess the ACL for structural changes, sprain, partial injury, or tear.",
  },

  {
    id: "mcl",
    name: "MCL",
    group: "Ligaments",
    location: "Inner side of the knee",
    short: "Medial collateral ligament",
    description:
      "The medial collateral ligament is located along the inner side of the knee and contributes to side-to-side stability.",
    mri:
      "MRI can show changes involving the MCL and surrounding soft tissues.",
  },

  {
    id: "medial-meniscus",
    name: "Medial Meniscus",
    group: "Menisci",
    location: "Inner joint compartment",
    short: "Inner meniscus",
    description:
      "The medial meniscus is a crescent-shaped cartilage structure located between the femur and tibia on the inner side of the knee.",
    mri:
      "MRI is commonly used to evaluate meniscal structure and possible tears or other abnormalities.",
  },

  {
    id: "lateral-meniscus",
    name: "Lateral Meniscus",
    group: "Menisci",
    location: "Outer joint compartment",
    short: "Outer meniscus",
    description:
      "The lateral meniscus is located between the lateral femoral condyle and tibial plateau.",
    mri:
      "MRI can evaluate the lateral meniscus for structural abnormalities.",
  },

  {
    id: "medial-oa",
    name: "Medial OA",
    group: "Osteoarthritis",
    location: "Inner knee compartment",
    short: "Medial compartment",
    description:
      "Medial osteoarthritis affects the inner compartment of the knee joint.",
    mri:
      "MRI may demonstrate cartilage and bone changes associated with degenerative joint disease.",
  },

  {
    id: "lateral-oa",
    name: "Lateral OA",
    group: "Osteoarthritis",
    location: "Outer knee compartment",
    short: "Lateral compartment",
    description:
      "Lateral osteoarthritis affects structures within the outer compartment of the knee.",
    mri:
      "MRI can help visualize cartilage and other structural changes in this compartment.",
  },

  {
    id: "pf-oa",
    name: "PF OA",
    group: "Osteoarthritis",
    location: "Patellofemoral joint",
    short: "Kneecap joint",
    description:
      "Patellofemoral osteoarthritis involves the joint between the patella and femur.",
    mri:
      "MRI can demonstrate cartilage and subchondral changes in the patellofemoral compartment.",
  },

  {
    id: "effusion",
    name: "Effusion",
    group: "Joint / Fluid",
    location: "Knee joint cavity",
    short: "Joint fluid",
    description:
      "Joint effusion refers to an increased amount of fluid within the knee joint.",
    mri:
      "MRI can demonstrate fluid within the joint and its distribution around the knee.",
  },

  {
    id: "synovitis",
    name: "Synovitis",
    group: "Joint / Fluid",
    location: "Synovial lining",
    short: "Joint lining",
    description:
      "Synovitis involves inflammation or abnormal thickening of the synovial lining of a joint.",
    mri:
      "MRI can help demonstrate synovial changes and associated fluid or inflammatory findings.",
  },

  {
    id: "bakers",
    name: "Baker's",
    group: "Joint / Fluid",
    location: "Back of the knee",
    short: "Popliteal region",
    description:
      "A Baker's cyst is a fluid-filled structure that develops in the region behind the knee.",
    mri:
      "MRI can show the cyst and its relationship to surrounding structures.",
  },

  {
    id: "contusion",
    name: "Contusion",
    group: "Bone",
    location: "Bone marrow",
    short: "Bone bruise",
    description:
      "A bone contusion is an injury associated with changes within the bone marrow.",
    mri:
      "MRI is useful for demonstrating bone marrow signal changes associated with contusion.",
  },

  {
    id: "fracture",
    name: "Fracture",
    group: "Bone",
    location: "Bones around the knee",
    short: "Bone injury",
    description:
      "A fracture is a break or crack involving a bone around the knee joint.",
    mri:
      "MRI can demonstrate fracture-related marrow and soft-tissue findings.",
  },
];

const groups = [
  "All",
  "Ligaments",
  "Menisci",
  "Osteoarthritis",
  "Joint / Fluid",
  "Bone",
];

export default function KneeGuide({ onBack }) {
  const [selected, setSelected] =
    useState(findings[0]);

  const [activeGroup, setActiveGroup] =
    useState("All");

  const filteredFindings =
    activeGroup === "All"
      ? findings
      : findings.filter(
          (item) =>
            item.group === activeGroup
        );

  const selectFinding = (id) => {
    const finding =
      findings.find(
        (item) => item.id === id
      );

    if (finding) {
      setSelected(finding);
    }
  };

  return (
    <main className="knee-guide-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="guide-header">

        <div className="guide-container guide-header-inner">

          <button
            type="button"
            className="guide-brand"
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
            className="guide-back"
            onClick={onBack}
          >

            <ArrowLeft size={16} />

            Back to workspace

          </button>

        </div>

      </header>


      {/* =====================================
          HERO
      ====================================== */}

      <section className="guide-hero">

        <div className="guide-container">

          <motion.div
            className="guide-hero-copy"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            <span className="guide-label">
              KNEE ANATOMY & FINDINGS
            </span>

            <h1>
              Explore the
              <br />
              anatomy behind the
              <span> findings.</span>
            </h1>

            <p>
              Select a structure or finding to
              understand where it is located and
              how it relates to knee MRI review.
            </p>

          </motion.div>

        </div>

      </section>


      {/* =====================================
          INTERACTIVE ANATOMY
      ====================================== */}

      <section className="guide-explorer">

        <div className="guide-container explorer-grid">


          {/* ===================================
              ANATOMICAL MAP
          ==================================== */}

          <div className="anatomy-card">

            <div className="anatomy-card-header">

              <div>

                <span>
                  INTERACTIVE ANATOMY
                </span>

                <strong>
                  Select an area
                </strong>

              </div>

              <Crosshair size={19} />

            </div>


            <div className="interactive-knee">

              {/* Decorative grid */}

              <div className="anatomy-grid-bg" />


              {/* ===============================
                  KNEE SVG
              ================================= */}

              <svg
                className="knee-svg"
                viewBox="0 0 520 620"
                role="img"
                aria-label="Interactive knee anatomy"
              >

                {/* Femur */}

                <path
                  className="bone bone-femur"
                  d="
                    M184 45
                    C184 30 204 20 260 20
                    C316 20 336 30 336 45
                    L328 175
                    C325 205 315 226 292 244
                    L228 244
                    C205 226 195 205 192 175
                    Z
                  "
                />

                {/* Femur condyles */}

                <ellipse
                  className="bone-condyle"
                  cx="215"
                  cy="248"
                  rx="61"
                  ry="43"
                />

                <ellipse
                  className="bone-condyle"
                  cx="305"
                  cy="248"
                  rx="61"
                  ry="43"
                />

                {/* Tibia */}

                <path
                  className="bone bone-tibia"
                  d="
                    M155 292
                    C180 270 214 270 260 278
                    C306 270 340 270 365 292
                    L350 548
                    C344 578 322 596 294 600
                    L226 600
                    C198 596 176 578 170 548
                    Z
                  "
                />

                {/* Tibial plateau */}

                <ellipse
                  className="bone-condyle"
                  cx="204"
                  cy="292"
                  rx="56"
                  ry="30"
                />

                <ellipse
                  className="bone-condyle"
                  cx="316"
                  cy="292"
                  rx="56"
                  ry="30"
                />

                {/* Patella */}

                <ellipse
                  className={`patella ${
                    selected.id === "pf-oa"
                      ? "active"
                      : ""
                  }`}
                  cx="260"
                  cy="215"
                  rx="47"
                  ry="58"
                  onClick={() =>
                    selectFinding("pf-oa")
                  }
                />

                {/* Joint space */}

                <path
                  className={`joint-space-svg ${
                    selected.id === "effusion"
                      ? "active"
                      : ""
                  }`}
                  d="
                    M160 285
                    Q260 315 360 285
                    Q260 338 160 285
                    Z
                  "
                  onClick={() =>
                    selectFinding("effusion")
                  }
                />


                {/* ============================
                    MENISCI
                ============================= */}

                <path
                  className={`meniscus-svg medial ${
                    selected.id ===
                    "medial-meniscus"
                      ? "active"
                      : ""
                  }`}
                  d="
                    M163 286
                    Q205 265 249 286
                    Q212 302 166 296
                    Z
                  "
                  onClick={() =>
                    selectFinding(
                      "medial-meniscus"
                    )
                  }
                />

                <path
                  className={`meniscus-svg lateral ${
                    selected.id ===
                    "lateral-meniscus"
                      ? "active"
                      : ""
                  }`}
                  d="
                    M271 286
                    Q315 265 357 286
                    Q314 302 274 296
                    Z
                  "
                  onClick={() =>
                    selectFinding(
                      "lateral-meniscus"
                    )
                  }
                />


                {/* ============================
                    ACL
                ============================= */}

                <path
                  className={`ligament-svg acl ${
                    selected.id === "acl"
                      ? "active"
                      : ""
                  }`}
                  d="
                    M230 238
                    L282 335
                  "
                  onClick={() =>
                    selectFinding("acl")
                  }
                />

                {/* PCL-style visual reference */}

                <path
                  className="ligament-svg pcl"
                  d="
                    M287 238
                    L239 335
                  "
                />


                {/* ============================
                    MCL
                ============================= */}

                <path
                  className={`ligament-svg mcl ${
                    selected.id === "mcl"
                      ? "active"
                      : ""
                  }`}
                  d="
                    M157 250
                    C133 310 139 350 160 395
                  "
                  onClick={() =>
                    selectFinding("mcl")
                  }
                />


                {/* ============================
                    LCL
                ============================= */}

                <path
                  className="ligament-svg lcl"
                  d="
                    M363 250
                    C387 310 381 350 360 395
                  "
                />


                {/* ============================
                    OA AREAS
                ============================= */}

                <path
                  className={`oa-zone medial-oa-zone ${
                    selected.id ===
                    "medial-oa"
                      ? "active"
                      : ""
                  }`}
                  d="
                    M165 300
                    Q205 316 250 304
                    L242 345
                    Q203 358 170 342
                    Z
                  "
                  onClick={() =>
                    selectFinding(
                      "medial-oa"
                    )
                  }
                />

                <path
                  className={`oa-zone lateral-oa-zone ${
                    selected.id ===
                    "lateral-oa"
                      ? "active"
                      : ""
                  }`}
                  d="
                    M270 304
                    Q315 316 355 300
                    L350 342
                    Q317 358 278 345
                    Z
                  "
                  onClick={() =>
                    selectFinding(
                      "lateral-oa"
                    )
                  }
                />


                {/* ============================
                    EFFUSION
                ============================= */}

                <ellipse
                  className={`fluid-zone ${
                    selected.id === "effusion"
                      ? "active"
                      : ""
                  }`}
                  cx="260"
                  cy="319"
                  rx="73"
                  ry="34"
                  onClick={() =>
                    selectFinding("effusion")
                  }
                />


                {/* ============================
                    SYNOVITIS
                ============================= */}

                <path
                  className={`synovial-zone ${
                    selected.id ===
                    "synovitis"
                      ? "active"
                      : ""
                  }`}
                  d="
                    M159 278
                    Q260 331 361 278
                  "
                  onClick={() =>
                    selectFinding(
                      "synovitis"
                    )
                  }
                />


                {/* ============================
                    CONTUSION
                ============================= */}

                <ellipse
                  className={`contusion-zone ${
                    selected.id ===
                    "contusion"
                      ? "active"
                      : ""
                  }`}
                  cx="204"
                  cy="420"
                  rx="28"
                  ry="42"
                  onClick={() =>
                    selectFinding(
                      "contusion"
                    )
                  }
                />


                {/* ============================
                    FRACTURE
                ============================= */}

                <path
                  className={`fracture-zone ${
                    selected.id === "fracture"
                      ? "active"
                      : ""
                  }`}
                  d="
                    M194 470
                    L270 492
                    L253 509
                    L188 488
                    Z
                  "
                  onClick={() =>
                    selectFinding(
                      "fracture"
                    )
                  }
                />


                {/* ============================
                    BAKER'S CYST
                ============================= */}

                <ellipse
                  className={`bakers-zone ${
                    selected.id === "bakers"
                      ? "active"
                      : ""
                  }`}
                  cx="330"
                  cy="450"
                  rx="43"
                  ry="31"
                  onClick={() =>
                    selectFinding("bakers")
                  }
                />

              </svg>


              {/* ===============================
                  LABELS
              ================================= */}

              <button
                type="button"
                className={`anatomy-hotspot hotspot-acl ${
                  selected.id === "acl"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectFinding("acl")
                }
              >
                ACL
              </button>

              <button
                type="button"
                className={`anatomy-hotspot hotspot-mcl ${
                  selected.id === "mcl"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectFinding("mcl")
                }
              >
                MCL
              </button>

              <button
                type="button"
                className={`anatomy-hotspot hotspot-medial ${
                  selected.id ===
                  "medial-meniscus"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectFinding(
                    "medial-meniscus"
                  )
                }
              >
                Medial
              </button>

              <button
                type="button"
                className={`anatomy-hotspot hotspot-lateral ${
                  selected.id ===
                  "lateral-meniscus"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectFinding(
                    "lateral-meniscus"
                  )
                }
              >
                Lateral
              </button>

              <button
                type="button"
                className={`anatomy-hotspot hotspot-pf ${
                  selected.id === "pf-oa"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectFinding("pf-oa")
                }
              >
                PF OA
              </button>

              <button
                type="button"
                className={`anatomy-hotspot hotspot-bakers ${
                  selected.id === "bakers"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  selectFinding("bakers")
                }
              >
                Baker's
              </button>

              <div className="anatomy-instruction">
                <Crosshair size={14} />
                Select a highlighted structure
              </div>

            </div>


            <div className="anatomy-caption">

              <Info size={14} />

              <span>
                Simplified anatomical illustration
                for orientation and education.
              </span>

            </div>

          </div>


          {/* ===================================
              DETAIL PANEL
          ==================================== */}

          <motion.div
            className="finding-detail-card"
            key={selected.id}
            initial={{
              opacity: 0,
              x: 12,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.3,
            }}
          >

            <span className="guide-label">
              SELECTED FINDING
            </span>

            <div className="selected-group">
              {selected.group}
            </div>

            <h2>
              {selected.name}
            </h2>

            <p className="selected-short">
              {selected.short}
            </p>


            <div className="detail-location">

              <span>
                WHERE
              </span>

              <strong>
                {selected.location}
              </strong>

            </div>


            <div className="detail-divider" />


            <div className="detail-block">

              <span>
                ABOUT
              </span>

              <p>
                {selected.description}
              </p>

            </div>


            <div className="detail-block">

              <span>
                MRI RELEVANCE
              </span>

              <p>
                {selected.mri}
              </p>

            </div>


            <div className="selected-action">

              <div className="selected-action-icon">
                <Crosshair size={17} />
              </div>

              <div>
                <span>
                  CURRENT SELECTION
                </span>

                <strong>
                  {selected.name}
                </strong>
              </div>

            </div>


            <div className="detail-note">

              <ShieldCheck size={15} />

              <span>
                This information is provided to
                help users understand knee anatomy
                and the findings evaluated by KneeNova.
              </span>

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================
          FINDINGS LIBRARY
      ====================================== */}

      <section className="findings-library">

        <div className="guide-container">

          <div className="library-heading">

            <div>

              <span className="guide-label">
                FINDINGS LIBRARY
              </span>

              <h2>
                Explore the 12 categories.
              </h2>

              <p>
                Select a category to highlight its
                location and read an overview.
              </p>

            </div>

            <div className="finding-count">
              12 categories
            </div>

          </div>


          <div className="group-filters">

            {groups.map(
              (group) => (

                <button
                  type="button"
                  key={group}
                  className={
                    activeGroup === group
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveGroup(
                      group
                    )
                  }
                >
                  {group}
                </button>

              )
            )}

          </div>


          <div className="finding-library-grid">

            {filteredFindings.map(
              (item, index) => {

                const isSelected =
                  selected.id ===
                  item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`guide-finding-card ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelected(item)
                    }
                  >

                    <div className="guide-card-number">
                      {String(
                        findings.indexOf(
                          item
                        ) + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="guide-card-content">

                      <span>
                        {item.group}
                      </span>

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.location}
                      </p>

                    </div>

                    <ChevronRight
                      size={16}
                      className="guide-card-arrow"
                    />

                  </button>
                );
              }
            )}

          </div>

        </div>

      </section>


      {/* =====================================
          EDUCATIONAL NOTE
      ====================================== */}

      <section className="guide-note-section">

        <div className="guide-container">

          <div className="guide-note">

            <div className="guide-note-icon">
              <Info size={19} />
            </div>

            <div>

              <span>
                ABOUT THIS GUIDE
              </span>

              <p>
                The anatomy illustration and explanations
                on this page are intended for orientation
                and education. They help users understand
                the structures and categories evaluated by
                KneeNova and are not a diagnostic tool.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          FOOTER
      ====================================== */}

      <footer className="guide-footer">

        <div className="guide-container guide-footer-inner">

          <span>
            KneeNova Medical Workspace
          </span>

          <span>
            Knee Anatomy & Findings
          </span>

        </div>

      </footer>

    </main>
  );
}