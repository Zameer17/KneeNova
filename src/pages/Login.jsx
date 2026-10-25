import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Academic-project local login for now.
    if (email.trim() && password.trim()) {
      onLogin();
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
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
            }}
          />

          <motion.div
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
              delay: 0.15,
            }}
          >

            <div className="intro-label">
              KNEENOVA MEDICAL WORKSPACE
            </div>

            <h1>
              Better insight
              <br />
              into every
              <span> knee study.</span>
            </h1>

            <p>
              A focused workspace for reviewing knee MRI
              studies, organizing findings, and generating
              structured analysis.
            </p>

          </motion.div>

          <motion.div
            className="intro-features"
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
              delay: 0.3,
            }}
          >

            <div className="intro-feature">
              <span className="feature-icon blue">
                ✓
              </span>

              <div>
                <strong>Structured MRI analysis</strong>
                <small>
                  Review studies in an organized workspace.
                </small>
              </div>
            </div>

            <div className="intro-feature">
              <span className="feature-icon green">
                ✓
              </span>

              <div>
                <strong>Multiple findings</strong>
                <small>
                  Track important knee abnormalities together.
                </small>
              </div>
            </div>

            <div className="intro-feature">
              <span className="feature-icon gold">
                ✓
              </span>

              <div>
                <strong>Report-ready workflow</strong>
                <small>
                  Keep analysis and reporting in one place.
                </small>
              </div>
            </div>

          </motion.div>

        </div>

      </section>

      {/* =====================================
          RIGHT SIDE
      ====================================== */}

      <section className="login-form-section">

        <motion.div
          className="login-card"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
        >

          <div className="login-heading">

            <div className="heading-badge">
              <ShieldCheck size={16} />
              Secure workspace
            </div>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to continue to your KneeNova workspace.
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-box">

                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

              </div>

            </div>

            {/* Password */}

            <div className="form-group">

              <div className="password-heading">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                >
                  Forgot password?
                </button>

              </div>

              <div className="input-box">

                <Lock size={18} />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Remember */}

            <label className="remember-row">

              <input
                type="checkbox"
              />

              <span>
                Remember me
              </span>

            </label>

            {/* Submit */}

            <button
              type="submit"
              className="login-button"
            >

              <span>
                Sign in
              </span>

              <ArrowRight size={18} />

            </button>

          </form>

          {/* Divider */}

          <div className="login-divider">

            <span />
            <small>OR</small>
            <span />

          </div>

          {/* Signup */}

          <div className="signup-row">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              className="signup-button"
            >
              Create account
            </button>

          </div>

          {/* Security */}

          <div className="security-message">

            <ShieldCheck size={15} />

            <span>
              Your workspace is designed for secure
              academic and research use.
            </span>

          </div>

          <div className="login-footer">
            KneeNova Research Platform
          </div>

        </motion.div>

      </section>

    </main>
  );
}