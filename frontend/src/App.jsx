import { useEffect, useState } from "react";
import Dashboard from "./pages/dashboard";
import ForgotPassword from "./pages/forgotPassword";
import Inventory from "./pages/inventory";
import Login from "./pages/login";
import Products from "./pages/products";
import Settings from "./pages/settings";
import Supplier from "./pages/supplier";
import UserManagement from "./pages/userManagement";
import UserManagementUserList from "./pages/userManagementUserList";
import UserManagementAuditlogs from "./pages/userManagementAuditlogs";
import UserArchive from "./pages/userArchive";

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

  function handleNavigate(page) {
    if (page === "Dashboard") {
      window.location.hash = "dashboard";
    } else if (page === "Inventory") {
      window.location.hash = "inventory";
    } else if (page === "Products") {
      window.location.hash = "products";
    } else if (page === "User Management") {
      window.location.hash = "user-management";
    } else if (page === "User List") {
      window.location.hash = "user-list";
    } else if (page === "User Audit Logs") {
      window.location.hash = "user-audit-logs";
    } else if (page === "User Archive") {
      window.location.hash = "user-archive";
    } else if (page === "Supplier Module") {
      window.location.hash = "supplier";
    } else if (page === "Settings") {
      window.location.hash = "settings";
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    window.location.hash = "";
  }

  const showForgotPassword = currentHash === "#forgot-password";
  const showUserArchive = isAuthenticated && currentHash === "#user-archive";
  const showUserAuditLogs = isAuthenticated && currentHash === "#user-audit-logs";
  const showUserList = isAuthenticated && currentHash === "#user-list";
  const showUserManagement = isAuthenticated && currentHash === "#user-management";
  const showSupplier = isAuthenticated && currentHash === "#supplier";
  const showSettings = isAuthenticated && currentHash === "#settings";
  const showProducts = isAuthenticated && currentHash === "#products";
  const showInventory = isAuthenticated && currentHash === "#inventory";
  const showDashboard =
    isAuthenticated &&
    !showUserArchive &&
    !showUserAuditLogs &&
    !showUserList &&
    !showUserManagement &&
    !showSupplier &&
    !showSettings &&
    !showProducts &&
    !showInventory &&
    !showForgotPassword;

  if (showUserArchive) {
    return <UserArchive onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (showUserAuditLogs) {
    return <UserManagementAuditlogs onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (showUserList) {
    return <UserManagementUserList onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (showUserManagement) {
    return <UserManagement onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (showSupplier) {
    return <Supplier onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (showSettings) {
    return <Settings onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (showProducts) {
    return <Products onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (showInventory) {
    return <Inventory onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (showDashboard) {
    return <Dashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
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