import { useState, useMemo, useEffect, useCallback } from "react";
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
import "./userManagement.css";
import { initialLoginActivities, initialArchives } from "./userData";

const navItems = [
  { id: "Dashboard", label: "Dashboard", icon: Home },
  { id: "Inventory", label: "Inventory", icon: ShoppingBag },
  { id: "Products", label: "Products", icon: ShoppingCart },
  { id: "User Management", label: "User Management", icon: User },
  { id: "Supplier Module", label: "Supplier Module", icon: Boxes },
  { id: "Settings", label: "Settings", icon: Settings },
];

function UserManagement({ onLogout, onNavigate }) {
  const [activeNav, setActiveNav] = useState("User Management");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("Admin");

  // Activities state
  const [activities, setActivities] = useState(initialLoginActivities);
  const [archives, setArchives] = useState(initialArchives);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals
  const [modal, setModal] = useState(null);

  // Add User error state
  const [addError, setAddError] = useState('');

  // Add User Form State
  const [addForm, setAddForm] = useState({
    userId: "",
    username: "",
    firstName: "",
    middleName: "",
    lastName: "",
    role: "Cashier",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  // Fetch next sequential user code from the backend based on selected role
  const fetchNextCode = useCallback((role) => {
    const API = 'http://localhost:5000';
    fetch(`${API}/api/users/next-code?role=${role}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code) {
          setAddForm((prev) => ({ ...prev, userId: data.code }));
        }
      })
      .catch((err) => console.error('Failed to fetch next user code:', err));
  }, []);

  // When the "add" modal opens, auto-populate User ID for the current role
  useEffect(() => {
    if (modal === 'add') {
      fetchNextCode(addForm.role);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  // Load all users from DB on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then((res) => res.json())
      .then((users) => {
        if (!Array.isArray(users)) return;
        const loaded = users.map((u, idx) => ({
          id: u.user_code || `USR-${String(idx + 1).padStart(3, '0')}`,
          userId: u.user_code || String(u.id),
          username: u.username,
          name: u.full_name || `${u.first_name} ${u.last_name}`.trim(),
          role: u.role,
          loginTime: new Date(u.created_at).toLocaleString(),
          loginTimeout: '--:--',
          status: u.status || 'Active',
        }));
        setActivities(loaded);
      })
      .catch((err) => console.error('Failed to load users:', err));
  }, []);
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

  function handleAddSubmit(e) {
    e.preventDefault();
    setAddError('');
    const payload = {
      userCode: addForm.userId,
      username: addForm.username.trim(),
      password: addForm.password,
      role: addForm.role,
      email: addForm.email,
      phone: addForm.phone,
      firstName: addForm.firstName,
      middleName: addForm.middleName,
      lastName: addForm.lastName,
      address: addForm.address,
    };
    fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create user');
        return data;
      })
      .then((newUser) => {
        const newActivity = {
          id: `LOG-${String(activities.length + 1).padStart(3, '0')}`,
          userId: newUser.user_code || newUser.id,
          username: newUser.username,
          name: `${newUser.first_name}${newUser.middle_name ? ' ' + newUser.middle_name : ''} ${newUser.last_name}`.trim(),
          role: newUser.role,
          loginTime: new Date().toLocaleString(),
          loginTimeout: '--:--',
          status: 'Active',
        };
        setActivities([newActivity, ...activities]);
        setAddForm({
          userId: '',
          username: '',
          firstName: '',
          middleName: '',
          lastName: '',
          role: 'Cashier',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          address: '',
        });
        setAddError('');
        setModal(null);
      })
      .catch((err) => {
        console.error('Add user error:', err.message);
        // Fallback for offline local state
        const fullName = `${addForm.firstName} ${addForm.middleName ? addForm.middleName + ' ' : ''}${addForm.lastName}`.trim();
        const fallbackActivity = {
          id: `LOG-${String(activities.length + 1).padStart(3, '0')}`,
          userId: addForm.userId.trim() || `CSH-${String(activities.length + 1).padStart(3, '0')}`,
          username: addForm.username.trim() || 'newuser',
          name: fullName || 'New User',
          role: addForm.role,
          loginTime: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          loginTimeout: '--:--',
          status: 'Active',
        };
        setActivities([fallbackActivity, ...activities]);
        setAddForm({
          userId: '',
          username: '',
          firstName: '',
          middleName: '',
          lastName: '',
          role: 'Cashier',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          address: '',
        });
        setAddError('');
        setModal(null);
      });
  }

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.userId.toLowerCase().includes(q) ||
        item.username.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q);

      const matchesRole =
        selectedRole === "All" ||
        item.role.toLowerCase() === selectedRole.toLowerCase();

      const matchesStatus =
        selectedStatus === "All" ||
        item.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [activities, searchQuery, selectedRole, selectedStatus]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage) || 1;
  const paginatedActivities = filteredActivities.slice(
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
                  <h1>User Management</h1>
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

                {isProfileOpen && (
                  <div className="rch-profile-dropdown" role="menu">
                    <div className="rch-profile-dropdown-header">
                      <strong>{profileName}</strong>
                      <small>admin@riderscityhub.ph</small>
                    </div>
                    <button
                      className="rch-dropdown-item"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setModal("profile");
                      }}
                    >
                      <User size={14} />
                      View Profile
                    </button>
                    <button
                      className="rch-dropdown-item"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setModal("edit-profile");
                      }}
                    >
                      <Settings size={14} />
                      Edit Profile
                    </button>
                    <button
                      className="rch-dropdown-item rch-dropdown-logout"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
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

                <div className="rch-user-select-wrap">
                  <select
                    className="rch-user-select"
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown size={14} className="rch-user-select-arrow" />
                </div>
              </div>

              <div className="rch-user-toolbar-right">
                <button
                  className="rch-btn-add-user"
                  onClick={() => setModal("add")}
                >
                  + Add new user
                </button>
              </div>
            </div>
          </header>

          {/* Primary Table Card */}
          <div className="rch-user-card">
            <h2 className="rch-user-card-heading">Login Activity</h2>

            <div className="rch-user-table-container">
              <table className="rch-user-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Login Time</th>
                    <th>Login Timeout</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedActivities.length > 0 ? (
                    paginatedActivities.map((item) => (
                      <tr key={item.id} className="rch-user-row">
                        <td>{item.userId}</td>
                        <td>{item.username}</td>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>{item.role}</td>
                        <td>{item.loginTime}</td>
                        <td>{item.loginTimeout}</td>
                        <td>
                          <span
                            className={`rch-status-badge status-${item.status.toLowerCase()}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="rch-user-empty">
                        No login activity found matching your filters.
                      </td>
                    </tr>
                  )}

                  {/* Empty decorative rows to match 1:1 Figma wireframe */}
                  {Array.from({
                    length: Math.max(0, 4 - paginatedActivities.length),
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

          {/* Bottom Bar: 3 buttons on bottom left matching media_1789045133215.png */}
          <div className="rch-user-bottom-bar">
            <div className="rch-user-bottom-left">
              <button
                className="rch-btn-pill-dark"
                onClick={() => setModal("archive")}
              >
                User Archive
              </button>
              <button
                className="rch-btn-pill-dark"
                onClick={() => onNavigate && onNavigate("User Audit Logs")}
              >
                Audit Logs
              </button>
              <button
                className="rch-btn-pill-dark"
                onClick={() => onNavigate && onNavigate("User List")}
              >
                User List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODALS WITH BACKDROP BLUR (1:1 Ratio UI)                            */}
      {/* =================================================================== */}

      {/* USER ARCHIVE MODAL (matching Inventory History & Product Archive UI) */}
      {modal === "archive" && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div
            className="rch-modal-box rch-archive-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="rch-modal-title">User Archive</h2>

            <div className="rch-archive-table-wrap">
              {archives.length > 0 ? (
                <table className="rch-archive-table">
                  <thead>
                    <tr>
                      <th>Date Archived</th>
                      <th>Archived By</th>
                      <th>User ID</th>
                      <th>Role</th>
                      <th>Full Name</th>
                      <th>Username</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archives.map((a) => (
                      <tr key={a.id}>
                        <td>{a.dateArchived}</td>
                        <td>{a.archivedBy}</td>
                        <td>{a.userId}</td>
                        <td>{a.role}</td>
                        <td>
                          <strong>{a.fullName}</strong>
                        </td>
                        <td>{a.username}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="rch-btn-restore"
                            onClick={() =>
                              setArchives((prev) =>
                                prev.filter((item) => item.id !== a.id)
                              )
                            }
                            title="Restore User Account"
                          >
                            <RotateCcw size={13} />
                            Restore
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="rch-archive-empty">
                  No archived users found.
                </p>
              )}
            </div>

            <div className="rch-modal-actions">
              <button
                type="button"
                className="rch-btn-cancel-dark"
                onClick={() => setModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD A NEW USER MODAL (media_1789045192583.png) */}
      {modal === "add" && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div className="rch-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="rch-modal-title">Add a New User</h2>

            <form onSubmit={handleAddSubmit} className="rch-modal-form">
              <div className="rch-form-grid-2col">
                {/* Col 1: User ID */}
                <div className="rch-field-group">
                  <label>User ID</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.userId}
                    onChange={(e) =>
                      setAddForm({ ...addForm, userId: e.target.value })
                    }
                    placeholder="e.g. CSH-005"
                    required
                  />
                </div>

                {/* Col 2: E-Mail */}
                <div className="rch-field-group">
                  <label>E-Mail</label>
                  <input
                    type="email"
                    className="rch-field-input"
                    value={addForm.email}
                    onChange={(e) =>
                      setAddForm({ ...addForm, email: e.target.value })
                    }
                    placeholder="user@riderscityhub.ph"
                    required
                  />
                </div>

                {/* Col 1: Username */}
                <div className="rch-field-group">
                  <label>Username</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.username}
                    onChange={(e) =>
                      setAddForm({ ...addForm, username: e.target.value })
                    }
                    placeholder="Enter username"
                    required
                  />
                </div>

                {/* Col 2: Phone No. */}
                <div className="rch-field-group">
                  <label>Phone No.</label>
                  <input
                    type="tel"
                    className="rch-field-input"
                    value={addForm.phone}
                    onChange={(e) =>
                      setAddForm({ ...addForm, phone: e.target.value })
                    }
                    placeholder="0917-000-0000"
                    required
                  />
                </div>

                {/* Col 1: First Name */}
                <div className="rch-field-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.firstName}
                    onChange={(e) =>
                      setAddForm({ ...addForm, firstName: e.target.value })
                    }
                    placeholder="First name"
                    required
                  />
                </div>

                {/* Col 2: Enter Password */}
                <div className="rch-field-group">
                  <label>Enter Password</label>
                  <input
                    type="password"
                    className="rch-field-input"
                    value={addForm.password}
                    onChange={(e) =>
                      setAddForm({ ...addForm, password: e.target.value })
                    }
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Col 1: Middle Name (Optional) */}
                <div className="rch-field-group">
                  <label>
                    Middle Name <em>(Optional)</em>
                  </label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.middleName}
                    onChange={(e) =>
                      setAddForm({ ...addForm, middleName: e.target.value })
                    }
                    placeholder="Middle name"
                  />
                </div>

                {/* Col 2: Confirm Password */}
                <div className="rch-field-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="rch-field-input"
                    value={addForm.confirmPassword}
                    onChange={(e) =>
                      setAddForm({ ...addForm, confirmPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Col 1: Last Name */}
                <div className="rch-field-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.lastName}
                    onChange={(e) =>
                      setAddForm({ ...addForm, lastName: e.target.value })
                    }
                    placeholder="Last name"
                    required
                  />
                </div>

                {/* Col 2: Address */}
                <div className="rch-field-group">
                  <label>Address</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.address}
                    onChange={(e) =>
                      setAddForm({ ...addForm, address: e.target.value })
                    }
                    placeholder="City, Country"
                    required
                  />
                </div>

                {/* Col 1: Role Dropdown */}
                <div className="rch-field-group">
                  <label>Role</label>
                  <div className="rch-modal-select-wrap">
                    <select
                      className="rch-field-input rch-modal-select"
                      value={addForm.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setAddForm({ ...addForm, role: newRole });
                        fetchNextCode(newRole);
                      }}
                    >
                      <option value="Cashier">Cashier</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <ChevronDown size={14} className="rch-modal-select-arrow" />
                  </div>
                </div>

                {/* Col 2: Empty Spacer */}
                <div className="rch-field-group" aria-hidden="true" />
              </div>

              {/* Error message */}
              {addError && (
                <p style={{ color: '#c0392b', background: '#fdecea', border: '1px solid #e74c3c', borderRadius: '6px', padding: '8px 12px', marginBottom: '10px', fontSize: '13px' }}>
                  ⚠ {addError}
                </p>
              )}
              {/* Action Buttons */}
              <div className="rch-modal-actions">
                <button type="submit" className="rch-btn-submit-orange">
                  Add User
                </button>
                <button
                  type="button"
                  className="rch-btn-cancel-dark"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {modal === "profile" && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div
            className="rch-modal-box"
            style={{ maxWidth: "420px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="rch-modal-title">User Profile</h2>
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#c8f2d0",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "800",
                  marginBottom: "8px",
                }}
              >
                {profileName.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ margin: "4px 0", fontSize: "16px" }}>{profileName}</h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "12px" }}>
                admin@riderscityhub.ph
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  background: "#fee2e2",
                  color: "#b91c1c",
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                }}
              >
                Administrator
              </span>
            </div>
            <div className="rch-modal-actions">
              <button
                type="button"
                className="rch-btn-cancel-dark"
                onClick={() => setModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {modal === "edit-profile" && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div
            className="rch-modal-box"
            style={{ maxWidth: "440px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="rch-modal-title">Edit Profile</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModal(null);
              }}
              className="rch-modal-form"
            >
              <div className="rch-field-group">
                <label>Display Name</label>
                <input
                  type="text"
                  className="rch-field-input"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>
              <div className="rch-field-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="rch-field-input"
                  defaultValue="admin@riderscityhub.ph"
                  disabled
                />
              </div>
              <div className="rch-modal-actions">
                <button type="submit" className="rch-btn-submit-orange">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="rch-btn-cancel-dark"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

UserManagement.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
};

export default UserManagement;

