import { useEffect, useState } from "react";
import CashierSideDashboard from "./pages/cashierSideDashboard";
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
  const [userRole, setUserRole] = useState("admin"); // "admin" or "cashier"

  useEffect(() => {
    function handleHashChange() {
      setCurrentHash(window.location.hash);
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function handleNavigate(page) {
    const routeMap = {
      "Dashboard": "#dashboard",
      "Inventory": "#inventory",
      "Products": "#products",
      "User Management": "#user-management",
      "User List": "#user-list",
      "User Audit Logs": "#user-audit-logs",
      "User Archive": "#user-archive",
      "Supplier Module": "#supplier",
      "Supplier": "#supplier",
      "Settings": "#settings",
      "Settings Module": "#settings",
    };

    const targetHash = routeMap[page] || "#dashboard";
    setCurrentHash(targetHash);
    try {
      window.location.hash = targetHash.replace("#", "");
    } catch {
      // ignore
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setCurrentHash("");
    window.location.hash = "";
  }

  function handleLogin(role) {
    setUserRole(role || "admin");
    setIsAuthenticated(true);
    if (role === "cashier") {
      setCurrentHash("#cashier-dashboard");
      window.location.hash = "cashier-dashboard";
    } else {
      setCurrentHash("#dashboard");
      window.location.hash = "dashboard";
    }
  }

  const showForgotPassword = currentHash === "#forgot-password";
  const showUserArchive = isAuthenticated && currentHash === "#user-archive";
  const showUserAuditLogs = isAuthenticated && currentHash === "#user-audit-logs";
  const showUserList = isAuthenticated && currentHash === "#user-list";
  const showUserManagement = isAuthenticated && currentHash === "#user-management";
  const showSupplier = isAuthenticated && currentHash === "#supplier";
  const showSettings =
    isAuthenticated && (currentHash === "#settings" || currentHash === "#settings-module");
  const showProducts = isAuthenticated && currentHash === "#products";
  const showInventory = isAuthenticated && currentHash === "#inventory";
  const showCashierDashboard =
    isAuthenticated && (userRole === "cashier" || currentHash === "#cashier-dashboard");
  const showDashboard =
    isAuthenticated &&
    !showCashierDashboard &&
    !showUserArchive &&
    !showUserAuditLogs &&
    !showUserList &&
    !showUserManagement &&
    !showSupplier &&
    !showSettings &&
    !showProducts &&
    !showInventory &&
    !showForgotPassword;

  if (showCashierDashboard) {
    return <CashierSideDashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

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
      onLogin={handleLogin}
    />
  );
}

export default App;