import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import "./login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") || "").trim();
    const password = String(form.get("password") || "");

    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setError("");
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 900);
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-visual">
          <div className="visual-copy">
            <h2>Welcome to Riderscityhub.ph</h2>
            <div className="visual-rule" />
            <p>Let&apos;s keep your business running smoothly.</p>
          </div>
          <img
    src="Images/f384a9d5e0d8b2ea1d2f6b821d32c9d1.jpg"
    alt="Login background"/>
        </div>

        <div className="login-form-side">
          <img
            className="login-logo"
            src="Images/f0ac9f40cf82f0aee7252a575074eec5-Photoroom.png"
            alt="Riders City Hub logo"
          />
          <div className="login-heading">
            <h1 id="login-title">Get Started</h1>
            <p>Manage. Sell. Ride.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="username">Enter your username or gmail</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="you@riderscityhub.ph"
            />

            <div className="field-password">
              <label htmlFor="password">Enter your password</label>
              <span className="password-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
                </button>
              </span>
            </div>

            <button type="button" className="forgot-button">
              Forgot Password
            </button>

            {error ? (
              <p className="login-error" role="alert">
                {error}
              </p>
            ) : null}

            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? "Signing in…" : "Login"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;
