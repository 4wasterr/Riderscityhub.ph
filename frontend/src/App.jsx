import { useEffect, useState } from "react";
import ForgotPassword from "./pages/forgotPassword";
import Login from "./pages/login";

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    function handleHashChange() {
      setCurrentHash(window.location.hash);
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const showForgotPassword = currentHash === "#forgot-password";

  return showForgotPassword ? (
    <ForgotPassword onBackToLogin={() => { window.location.hash = ""; }} />
  ) : (
    <Login onForgotPassword={() => { window.location.hash = "forgot-password"; }} />
  );
}

export default App;