import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Dashboard from "../pages/dashboard";
import Inventory from "../pages/inventory";
import Products from "../pages/products";
import UserManagement from "../pages/userManagement";
import UserManagementUserList from "../pages/userManagementUserList";
import UserManagementAuditlogs from "../pages/userManagementAuditlogs";
import UserArchive from "../pages/userArchive";
import Supplier from "../pages/supplier";
import Settings from "../pages/settings";

/**
 * AdminLayout encapsulates all administrative sub-routes and hierarchy.
 * Decouples App.jsx from the monolithic star topology.
 */
function AdminLayout({ onLogout }) {
  const [currentSubRoute, setCurrentSubRoute] = useState(
    window.location.hash || "#dashboard"
  );

  useEffect(() => {
    function handleHashChange() {
      if (window.location.hash) {
        setCurrentSubRoute(window.location.hash);
      }
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

    const target = routeMap[page] || "#dashboard";
    setCurrentSubRoute(target);
    try {
      window.location.hash = target.replace("#", "");
    } catch {
      // Ignore in non-browser environments
    }
  }

  // Render matching sub-module component
  function renderSubModule() {
    switch (currentSubRoute) {
      case "#user-archive":
        return <UserArchive onLogout={onLogout} onNavigate={handleNavigate} />;
      case "#user-audit-logs":
        return <UserManagementAuditlogs onLogout={onLogout} onNavigate={handleNavigate} />;
      case "#user-list":
        return <UserManagementUserList onLogout={onLogout} onNavigate={handleNavigate} />;
      case "#user-management":
        return <UserManagement onLogout={onLogout} onNavigate={handleNavigate} />;
      case "#supplier":
        return <Supplier onLogout={onLogout} onNavigate={handleNavigate} />;
      case "#settings":
      case "#settings-module":
        return <Settings onLogout={onLogout} onNavigate={handleNavigate} />;
      case "#products":
        return <Products onLogout={onLogout} onNavigate={handleNavigate} />;
      case "#inventory":
        return <Inventory onLogout={onLogout} onNavigate={handleNavigate} />;
      case "#dashboard":
      default:
        return <Dashboard onLogout={onLogout} onNavigate={handleNavigate} />;
    }
  }

  return <div className="rch-admin-layout">{renderSubModule()}</div>;
}

AdminLayout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default AdminLayout;

