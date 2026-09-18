import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CashierSideDashboard from "../pages/cashierSideDashboard";

/**
 * StoreLayout handles operational / cashier-facing sub-routes
 */
function StoreLayout({ onLogout }) {
  const [activeStoreModule, setActiveStoreModule] = useState(() => {
    const hash = window.location.hash || "";
    if (hash === "#cashier-pos" || hash === "#pos") return "POS / New Sale";
    if (hash === "#cashier-reports" || hash === "#reports") return "Reports";
    return "Dashboard";
  });

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash || "";
      if (hash === "#cashier-pos" || hash === "#pos") {
        setActiveStoreModule("POS / New Sale");
      } else if (hash === "#cashier-reports" || hash === "#reports") {
        setActiveStoreModule("Reports");
      } else if (hash === "#cashier-dashboard" || hash === "#cashier") {
        setActiveStoreModule("Dashboard");
      }
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  function handleStoreNavigate(moduleName) {
    setActiveStoreModule(moduleName);
    try {
      if (moduleName === "POS / New Sale") {
        window.location.hash = "cashier-pos";
      } else if (moduleName === "Reports") {
        window.location.hash = "cashier-reports";
      } else {
        window.location.hash = "cashier-dashboard";
      }
    } catch {
      // Ignore in non-browser environments
    }
  }

  return (
    <div className="rch-store-layout">
      <CashierSideDashboard
        onLogout={onLogout}
        onNavigate={handleStoreNavigate}
        activeModule={activeStoreModule}
      />
    </div>
  );
}

StoreLayout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default StoreLayout;

