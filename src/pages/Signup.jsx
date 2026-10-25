import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Building2,
  Stethoscope,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { registerUser } from "../services/api";

export default function Signup({ onSignupSuccess, onNavigateLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [role, setRole] = useState("Orthopedic Clinician");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        institution: institution.trim() || "KneeNova Medical AI Lab",
        role,
      });

      if (onSignupSuccess) {
        onSignupSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      {/* =====================================
          LEFT SIDE INTRO
      ====================================== */}
      <section className="login-intro">
        <div className="intro-inner">
          <motion.img
            src="/assets/kneenova-logo.png"
            alt="KneeNova"
            className="login-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="intro-label">KNEENOVA CLINICAL PORTAL</div>

            <h1>
              Join the next
              <br />
              generation of
              <span> MRI intelligence.</span>
            </h1>

            <p>
              Create your account to access our automated 12-abnormality knee
              analysis model, DICOM visualizer, and exportable clinical reports.
            </p>
          </motion.div>

          <motion.div
            className="intro-features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="intro-feature">
              <span className="feature-icon blue">
                <CheckCircle2 size={16} />
              </span>
              <div>
                <strong>Secure Patient-Centric Workflow</strong>
                <small>Local-first processing protects sensitive DICOM metadata.</small>
              </div>
            </div>

            <div className="intro-feature">
              <span className="feature-icon green">
                <CheckCircle2 size={16} />
              </span>
              <div>
                <strong>12 Key Pathologies Detected</strong>
                <small>Comprehensive analysis for ligaments, cartilage, and bone.</small>
              </div>
            </div>

            <div className="intro-feature">
              <span className="feature-icon gold">
                <CheckCircle2 size={16} />
              </span>
              <div>
                <strong>Instant Report Generation</strong>
                <small>Export clean diagnostic summaries ready for consultation.</small>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================
          RIGHT SIDE SIGNUP CARD
      ====================================== */}
      <section className="login-form-section" style={{ overflowY: "auto", padding: "40px 24px" }}>
        <motion.div
          className="login-card"
          style={{ maxWidth: "480px" }}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="login-heading">
            <div className="heading-badge">
              <ShieldCheck size={16} />
              New Practitioner Account
            </div>

            <h2>Create account</h2>

            <p>Set up your credentials to begin analyzing MRI studies.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "10px 14px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                color: "#b91c1c",
                fontSize: "13px",
                lineHeight: "1.4",
                marginBottom: "18px",
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
              <span>{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-box">
                <User size={18} />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Jane Doe"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="signup-email">Work Email</label>
              <div className="input-box">
                <Mail size={18} />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@hospital.org"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Role & Specialization */}
            <div className="form-group">
              <label htmlFor="role">Clinical Role</label>
              <div className="input-box">
                <Stethoscope size={18} />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "14px",
                    color: "#2c3e50",
                    cursor: "pointer",
                  }}
                >
                  <option value="Orthopedic Clinician">Orthopedic Clinician</option>
                  <option value="Radiologist">Radiologist</option>
                  <option value="Sports Medicine Specialist">Sports Medicine Specialist</option>
                  <option value="Medical Researcher">Medical Researcher</option>
                  <option value="Resident / Medical Student">Resident / Medical Student</option>
                </select>
              </div>
            </div>

            {/* Institution */}
            <div className="form-group">
              <label htmlFor="institution">Hospital / University (Optional)</label>
              <div className="input-box">
                <Building2 size={18} />
                <input
                  id="institution"
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. St. Jude Hospital or Research Lab"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="signup-password">Password (min 6 characters)</label>
              <div className="input-box">
                <Lock size={18} />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="input-box">
                <Lock size={18} />
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
              style={{
                opacity: loading ? 0.75 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "12px",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <span />
            <small>ALREADY REGISTERED?</small>
            <span />
          </div>

          {/* Signin Switch */}
          <div className="signup-row">
            <span>Already have an account?</span>
            <button
              type="button"
              className="signup-button"
              onClick={onNavigateLogin}
            >
              Sign in here
            </button>
          </div>

          <div className="login-footer" style={{ marginTop: "24px" }}>
            KneeNova Research Platform
          </div>
        </motion.div>
      </section>
    </main>
  );
}
