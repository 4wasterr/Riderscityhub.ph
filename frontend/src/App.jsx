import { useEffect, useState } from "react";
import Dashboard from "./pages/dashboard";
import ForgotPassword from "./pages/forgotPassword";
import Inventory from "./pages/inventory";
import Login from "./pages/login";

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    function handleHashChange() {
      setCurrentHash(window.location.hash);
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const showForgotPassword = currentHash === "#forgot-password";
  const showInventory = isAuthenticated && currentHash === "#inventory";
  const showDashboard = isAuthenticated && !showInventory && !showForgotPassword;

  if (showInventory) {
    return (
      <Inventory
        onLogout={() => {
          setIsAuthenticated(false);
          window.location.hash = "";
        }}
        onNavigate={(page) => {
          if (page === "Dashboard") {
            window.location.hash = "dashboard";
          }
        }}
      />
    );
  }

  if (showDashboard) {
    return (
      <Dashboard
        onLogout={() => {
          setIsAuthenticated(false);
          window.location.hash = "";
        }}
        onNavigate={(page) => {
          if (page === "Inventory") {
            window.location.hash = "inventory";
          }
        }}
      />
    );
  }

  return showForgotPassword ? (
    <ForgotPassword onBackToLogin={() => { window.location.hash = ""; }} />
  ) : (
    <Login
      onForgotPassword={() => { window.location.hash = "forgot-password"; }}
      onLogin={() => setIsAuthenticated(true)}
    />
  );
}

export default App;