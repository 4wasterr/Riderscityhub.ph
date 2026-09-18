import { useState, useEffect } from "react";
import AuthLayout from "./layouts/AuthLayout";
import StoreLayout from "./layouts/StoreLayout";
import AdminLayout from "./layouts/AdminLayout";

/**
 * App is the top-level hierarchical router:
 * - Unauthenticated users -> AuthLayout (Login, ForgotPassword)
 * - Cashier role          -> StoreLayout (POS, Cashier Dashboard, Shift Reports)
 * - Admin role            -> AdminLayout (Dashboard, Inventory, Products, Users, Supplier, Settings)
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userRole, setUserRole] = useState("admin"); // 'admin' or 'cashier'

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash || "";
      if (hash.startsWith("#cashier") || hash === "#pos" || hash === "#reports") {
        setUserRole("cashier");
      } else if (
        hash.startsWith("#dashboard") ||
        hash.startsWith("#inventory") ||
        hash.startsWith("#products") ||
        hash.startsWith("#settings") ||
        hash.startsWith("#supplier") ||
        hash.startsWith("#user")
      ) {
        setUserRole("admin");
      }
    }

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function handleLogin(role) {
    const assignedRole = (role || "admin").toLowerCase();
    setUserRole(assignedRole);
    setIsAuthenticated(true);
    if (assignedRole === "cashier") {
      window.location.hash = "cashier-dashboard";
    } else {
      window.location.hash = "dashboard";
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    window.location.hash = "";
  }

  // 1. Unauthenticated layout
  if (!isAuthenticated) {
    return <AuthLayout onLogin={handleLogin} />;
  }

  // 2. Operational / Cashier layout
  if (userRole === "cashier") {
    return <StoreLayout onLogout={handleLogout} />;
  }

  // 3. Administrative layout
  return <AdminLayout onLogout={handleLogout} />;
}

export default App;