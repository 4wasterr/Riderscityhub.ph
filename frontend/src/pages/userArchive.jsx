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
  RotateCcw,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import "./userArchive.css";
import { initialArchives } from "./userData";

const navItems = [
  { id: "Dashboard", label: "Dashboard", icon: Home },
  { id: "Inventory", label: "Inventory", icon: ShoppingBag },
  { id: "Products", label: "Products", icon: ShoppingCart },
  { id: "User Management", label: "User Management", icon: User },
  { id: "Supplier Module", label: "Supplier Module", icon: Boxes },
  { id: "Settings", label: "Settings", icon: Settings },
];

function UserArchive({ onLogout, onNavigate }) {
  const [activeNav, setActiveNav] = useState("User Management");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName] = useState("Admin");

  // Archives state
  const [archives, setArchives] = useState(initialArchives);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected item for action
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [modal, setModal] = useState(null);

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

  function handleRestore(arc) {
    setArchives(archives.filter((a) => a.id !== arc.id));
    setModal(null);
    setSelectedArchive(null);
  }

  // Filtered Archives
  const filteredArchives = useMemo(() => {
    return archives.filter((a) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.userId.toLowerCase().includes(q) ||
        a.username.toLowerCase().includes(q) ||
        a.fullName.toLowerCase().includes(q) ||
        a.archivedBy.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q);

      const matchesRole =
        selectedRole === "All" ||
        a.role.toLowerCase() === selectedRole.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [archives, searchQuery, selectedRole]);

  const totalPages = Math.ceil(filteredArchives.length / itemsPerPage) || 1;
  const paginatedArchives = filteredArchives.slice(
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
                  <h1>User Archive</h1>
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
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">Role</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <ChevronDown size={14} className="rch-user-select-arrow" />
                </div>
              </div>
            </div>
          </header>

          {/* Primary Table Card */}
          <div className="rch-user-card">
            <h2 className="rch-user-card-heading">Archive Activity</h2>

            <div className="rch-user-table-container">
              <table className="rch-user-table">
                <thead>
                  <tr>
                    <th>Date Archived</th>
                    <th>Archived By</th>
                    <th>User ID</th>
                    <th>Role</th>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedArchives.length > 0 ? (
                    paginatedArchives.map((a) => (
                      <tr key={a.id} className="rch-user-row">
                        <td>{a.dateArchived}</td>
                        <td>{a.archivedBy}</td>
                        <td>{a.userId}</td>
                        <td>{a.role}</td>
                        <td>
                          <strong>{a.fullName}</strong>
                        </td>
                        <td>{a.username}</td>
                        <td>
                          <div className="rch-user-actions" style={{ justifyContent: "center" }}>
                            <button
                              className="rch-btn-restore"
                              onClick={() => {
                                setSelectedArchive(a);
                                setModal("restore");
                              }}
                              title="Restore User"
                            >
                              <RotateCcw size={13} />
                              Restore
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="rch-user-empty">
                        No archived user activity found matching your search.
                      </td>
                    </tr>
                  )}

                  {/* Empty rows to match 1:1 Figma wireframe */}
                  {Array.from({
                    length: Math.max(0, 4 - paginatedArchives.length),
                  }).map((_, i) => (
                    <tr
                      key={`empty-${i}`}
                      className="rch-user-empty-row"
                      aria-hidden="true"
                    >
                      <td colSpan="7">&nbsp;</td>
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

      {/* Restore Confirmation Modal */}
      {modal === "restore" && selectedArchive && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div
            className="rch-modal-box rch-delete-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rch-delete-icon-wrap"
              style={{ background: "#e0f2fe", color: "#0284c7" }}
            >
              <RotateCcw size={28} />
            </div>
            <h2 className="rch-modal-title">Restore User Account?</h2>
            <p className="rch-delete-desc">
              Would you like to restore <strong>{selectedArchive.fullName}</strong>{" "}
              (User ID: <code>{selectedArchive.userId}</code>) back to active status?
            </p>

            <div className="rch-modal-actions">
              <button
                type="button"
                className="rch-btn-submit-orange"
                onClick={() => handleRestore(selectedArchive)}
              >
                Restore Account
              </button>
              <button
                type="button"
                className="rch-btn-cancel-dark"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

UserArchive.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
};

export default UserArchive;

