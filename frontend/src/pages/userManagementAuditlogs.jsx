import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import "./userManagementAuditLogs.css";
import { initialAuditLogs } from "./userData";

const navItems = [
  { id: "Dashboard", label: "Dashboard", icon: Home },
  { id: "Inventory", label: "Inventory", icon: ShoppingBag },
  { id: "Products", label: "Products", icon: ShoppingCart },
  { id: "User Management", label: "User Management", icon: User },
  { id: "Supplier Module", label: "Supplier Module", icon: Boxes },
  { id: "Settings", label: "Settings", icon: Settings },
];

function UserManagementAuditlogs({ onLogout, onNavigate }) {
  const [activeNav, setActiveNav] = useState("User Management");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName] = useState("Admin");

  // Logs state
  const [logs] = useState(initialAuditLogs);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  function handleNavClick(itemId) {
    setActiveNav(itemId);
    setIsSidebarOpen(false);
    if (itemId === "Dashboard" && onNavigate) onNavigate("Dashboard");
    if (itemId === "Inventory" && onNavigate) onNavigate("Inventory");
    if (itemId === "Products" && onNavigate) onNavigate("Products");
    if (itemId === "User Management" && onNavigate) onNavigate("User Management");
    if (itemId === "Supplier Module" && onNavigate) onNavigate("Supplier Module");
    if (itemId === "Settings" && onNavigate) onNavigate("Settings");
  }

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.dateTime.toLowerCase().includes(q);

      const matchesAction =
        selectedAction === "All" ||
        log.action.toLowerCase().includes(selectedAction.toLowerCase());

      const matchesDate =
        selectedDateFilter === "All" ||
        log.dateTime.toLowerCase().includes(selectedDateFilter.toLowerCase());

      return matchesSearch && matchesAction && matchesDate;
    });
  }, [logs, searchQuery, selectedAction, selectedDateFilter]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rch-user-root">
      {/* Sidebar Navigation */}
      <aside className={`rch-sidebar ${isSidebarOpen ? "is-open" : ""}`} aria-label="Sidebar">
        <div className="rch-sidebar-inner">
          <div className="rch-brand">
            <div className="rch-brand-badge" aria-hidden="true">
              <ShoppingBag size={20} strokeWidth={2.4} />
            </div>
            <span className="rch-brand-title">Riderscityhub.ph</span>
            <button
              className="rch-sidebar-close"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="rch-nav" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  className={`rch-nav-button ${isActive ? "active" : ""}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="rch-nav-icon">
                    <Icon size={19} strokeWidth={2.2} />
                  </span>
                  <span className="rch-nav-text">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="rch-sidebar-footer">
            <button className="rch-logout-button" onClick={onLogout}>
              <span className="rch-nav-icon">
                <LogOut size={19} strokeWidth={2.2} />
              </span>
              <span className="rch-nav-text">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="rch-mobile-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Container */}
      <div className="rch-user-main">
        <div className="rch-user-canvas">
          {/* Top Header Card */}
          <header className="rch-user-header-card">
            <div className="rch-user-header-top">
              <div className="rch-user-title-area">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    className="rch-hamburger"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Toggle navigation"
                  >
                    <Menu size={22} />
                  </button>
                  <h1>User Management - Audit Logs</h1>
                </div>
                <p className="rch-user-subtitle">
                  Manage user accounts, roles, and access permissions securely and efficiently.
                </p>
              </div>

              {/* Profile Avatar */}
              <div className="rch-profile-anchor">
                <button
                  className="rch-avatar-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="User Profile"
                >
                  {profileName.charAt(0).toUpperCase()}
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="rch-user-toolbar">
              <div className="rch-user-toolbar-left">
                <div className="rch-user-search-box">
                  <Search size={16} className="rch-user-search-icon" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div className="rch-user-select-wrap">
                  <select
                    className="rch-user-select"
                    value={selectedAction}
                    onChange={(e) => {
                      setSelectedAction(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All Actions</option>
                    <option value="Added">Added</option>
                    <option value="Completed a sale">Completed a sale</option>
                    <option value="Updated">Updated</option>
                    <option value="Deleted">Deleted</option>
                  </select>
                  <ChevronDown size={14} className="rch-user-select-arrow" />
                </div>

                <div className="rch-user-select-wrap">
                  <select
                    className="rch-user-select"
                    value={selectedDateFilter}
                    onChange={(e) => {
                      setSelectedDateFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">Date</option>
                    <option value="Aug 26">Aug 26</option>
                    <option value="Aug 27">Aug 27</option>
                    <option value="Aug 28">Aug 28</option>
                  </select>
                  <ChevronDown size={14} className="rch-user-select-arrow" />
                </div>
              </div>
            </div>
          </header>

          {/* Primary Table Card */}
          <div className="rch-user-card">
            <h2 className="rch-user-card-heading">Audit Logs</h2>

            <div className="rch-user-table-container">
              <table className="rch-user-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.length > 0 ? (
                    paginatedLogs.map((log) => (
                      <tr key={log.id} className="rch-user-row">
                        <td>{log.dateTime}</td>
                        <td>
                          <strong>{log.user}</strong>
                        </td>
                        <td>{log.action}</td>
                        <td>{log.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="rch-user-empty">
                        No audit logs found matching your filters.
                      </td>
                    </tr>
                  )}

                  {/* Empty rows to match 1:1 Figma wireframe */}
                  {Array.from({
                    length: Math.max(0, 4 - paginatedLogs.length),
                  }).map((_, i) => (
                    <tr
                      key={`empty-${i}`}
                      className="rch-user-empty-row"
                      aria-hidden="true"
                    >
                      <td colSpan="4">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="rch-user-pagination">
              <button
                className="rch-page-arrow"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`rch-page-num ${currentPage === page ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="rch-page-arrow"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Bottom Bar: Back button */}
          <div className="rch-user-bottom-bar">
            <div />
            <button
              className="rch-btn-back-orange"
              onClick={() => onNavigate && onNavigate("User Management")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

UserManagementAuditlogs.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
};

export default UserManagementAuditlogs;

