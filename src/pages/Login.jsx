import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { loginUser, createDemoUserSession } from "../services/api";

export default function Login({ onLogin, onNavigateSignup }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  // Timer for server spin-up notifications
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setStatusMessage(
          "Connecting to secure server... (Cloud instances may take up to 45s to wake up on first visit)"
        );
      }, 2500);
    } else {
      setStatusMessage("");
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({
        email: email.trim(),
        password: password.trim(),
      });
      if (onLogin) {
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("demo@kneenova.ai");
    setPassword("Password123!");
    setError("");
  };

  const handleInstantDemoLogin = () => {
    const session = createDemoUserSession(email || "demo@kneenova.ai");
    if (onLogin) {
      onLogin(session.user);
    }
  };

  return (
    <main className="login-page">
      {/* =====================================
          LEFT SIDE
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
            <div className="intro-label">KNEENOVA MEDICAL WORKSPACE</div>

            <h1>
              Better insight
              <br />
              into every
              <span> knee study.</span>
            </h1>

            <p>
              A focused workspace for reviewing knee MRI studies, organizing
              findings, and generating structured analysis.
            </p>
          </motion.div>

          <motion.div
            className="intro-features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="intro-feature">
              <span className="feature-icon blue">✓</span>
              <div>
                <strong>Structured MRI analysis</strong>
                <small>Review studies in an organized workspace.</small>
              </div>
            </div>

            <div className="intro-feature">
              <span className="feature-icon green">✓</span>
              <div>
                <strong>Multiple findings</strong>
                <small>Track important knee abnormalities together.</small>
              </div>
            </div>

            <div className="intro-feature">
              <span className="feature-icon gold">✓</span>
              <div>
                <strong>Report-ready workflow</strong>
                <small>Keep analysis and reporting in one place.</small>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================
          RIGHT SIDE
      ====================================== */}
      <section className="login-form-section" style={{ overflowY: "auto", padding: "40px 24px" }}>
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="login-heading">
            <div className="heading-badge">
              <ShieldCheck size={16} />
              Secure workspace
            </div>

            <h2>Welcome back</h2>
            <p>Sign in to continue to your KneeNova workspace.</p>
          </div>

          {/* Quick Demo Autofill Button */}
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "9px 14px",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #f0fdf4 0%, #e6f9ed 100%)",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              color: "#166534",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <Sparkles size={14} color="#15803d" />
            <span>Use Demo Account (demo@kneenova.ai)</span>
          </button>

          {/* Error Banner with Instant Demo Fallback */}
          {error && (
            <div
              style={{
                padding: "12px 14px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                color: "#b91c1c",
                fontSize: "13px",
                lineHeight: "1.4",
                marginBottom: "18px",
              }}
            >
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>{error}</span>
              </div>

              <div
                style={{
                  borderTop: "1px dashed #fca5a5",
                  paddingTop: "8px",
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "11px", color: "#7f1d1d" }}>
                  Server unavailable or taking too long?
                </span>
                <button
                  type="button"
                  onClick={handleInstantDemoLogin}
                  style={{
                    padding: "5px 10px",
                    background: "#b91c1c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Enter via Demo Mode →
                </button>
              </div>
            </div>
          )}

          {/* Active Status Notice for Server Wait */}
          {statusMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "8px",
                color: "#1d4ed8",
                fontSize: "12px",
                marginBottom: "16px",
              }}
            >
              <Loader2 size={15} className="animate-spin" style={{ flexShrink: 0 }} />
              <span>{statusMessage}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="input-box">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="password-heading">
                <label htmlFor="password">Password</label>
              </div>

              <div className="input-box">
                <Lock size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

            {/* Remember */}
            <label className="remember-row">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
              style={{
                opacity: loading ? 0.75 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <span />
            <small>OR</small>
            <span />
          </div>

          {/* Signup Switch */}
          <div className="signup-row">
            <span>Don't have an account?</span>
            <button
              type="button"
              className="signup-button"
              onClick={onNavigateSignup}
            >
              Create account
            </button>
          </div>

          {/* Security */}
          <div className="security-message">
            <ShieldCheck size={15} />
            <span>
              Your workspace is designed for secure clinical and research use.
            </span>
          </div>

          <div className="login-footer">KneeNova Research Platform</div>
        </motion.div>
      </section>
    </main>
  );
}
