import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Login from "../pages/login";
import ForgotPassword from "../pages/forgotPassword";

/**
 * AuthLayout handles unauthenticated user flows (Login, Forgot Password)
 */
function AuthLayout({ onLogin }) {
  const [authView, setAuthView] = useState(
    window.location.hash === "#forgot-password" ? "forgot-password" : "login"
  );

  useEffect(() => {
    function handleHash() {
      if (window.location.hash === "#forgot-password") {
        setAuthView("forgot-password");
      } else {
        setAuthView("login");
      }
    }
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  function handleGoToForgot() {
    window.location.hash = "forgot-password";
    setAuthView("forgot-password");
  }

  function handleGoToLogin() {
    window.location.hash = "";
    setAuthView("login");
  }

  return (
    <div className="rch-auth-layout">
      {authView === "forgot-password" ? (
        <ForgotPassword onBackToLogin={handleGoToLogin} />
      ) : (
        <Login onForgotPassword={handleGoToForgot} onLogin={onLogin} />
      )}
    </div>
  );
}

AuthLayout.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default AuthLayout;

