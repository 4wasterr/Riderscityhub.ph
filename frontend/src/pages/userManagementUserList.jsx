import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  User,
  X,
} from "lucide-react";
import "./userManagementUserList.css";

const navItems = [
  { id: "Dashboard", label: "Dashboard", icon: Home },
  { id: "Inventory", label: "Inventory", icon: ShoppingBag },
  { id: "Products", label: "Products", icon: ShoppingCart },
  { id: "User Management", label: "User Management", icon: User },
  { id: "Supplier Module", label: "Supplier Module", icon: Boxes },
  { id: "Settings", label: "Settings", icon: Settings },
];

function UserManagementUserList({ onLogout, onNavigate }) {
  const [activeNav, setActiveNav] = useState("User Management");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("Admin");

  // Users state — loaded from DB
  const [users, setUsers] = useState([]);

  // Load users from DB on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const mapped = data.map((u) => ({
          id: u.id,
          userId: u.user_code || String(u.id),
          username: u.username,
          firstName: u.first_name,
          middleName: u.middle_name || '',
          lastName: u.last_name,
          name: u.full_name || `${u.first_name} ${u.last_name}`.trim(),
          role: u.role,
          email: u.email,
          phone: u.phone || '',
          address: u.address || '',
          status: u.status || 'Active',
          createdAt: u.created_at,
        }));
        setUsers(mapped);
      })
      .catch((err) => console.error('Failed to load users:', err));
  }, []);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals: null | 'add' | 'edit' | 'delete' | 'profile' | 'edit-profile'
  const [modal, setModal] = useState(null);
  const [targetUser, setTargetUser] = useState(null);

  // Form State for Add User
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

  // Form State for Edit User
  const [editForm, setEditForm] = useState({
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
    status: "Active",
  });

  // Navigation click
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

  // Open Edit Modal
  function handleOpenEdit(u) {
    setTargetUser(u);
    setEditForm({
      userId: u.id,
      username: u.username,
      firstName: u.firstName || u.name.split(" ")[0] || "",
      middleName: u.middleName || "",
      lastName: u.lastName || u.name.split(" ").slice(1).join(" ") || "",
      role: u.role,
      email: u.email || "",
      phone: u.phone || "",
      password: "",
      confirmPassword: "",
      address: u.address || "",
      status: u.status,
    });
    setModal("edit");
  }

  // Open Delete Modal
  function handleOpenDelete(u) {
    setTargetUser(u);
    setModal("delete");
  }

  // Submit Add User
  function handleAddSubmit(e) {
    e.preventDefault();
    const fullName = `${addForm.firstName} ${addForm.middleName ? addForm.middleName + " " : ""}${addForm.lastName}`.trim();
    const newUser = {
      id: addForm.userId.trim() || `CSH-${String(users.length + 1).padStart(3, "0")}`,
      username: addForm.username.trim() || "newuser",
      firstName: addForm.firstName.trim(),
      middleName: addForm.middleName.trim(),
      lastName: addForm.lastName.trim(),
      name: fullName || "New User",
      role: addForm.role,
      email: addForm.email.trim(),
      phone: addForm.phone.trim(),
      address: addForm.address.trim(),
      status: "Active",
      dateCreated: new Date().toISOString().split("T")[0],
    };

    setUsers([newUser, ...users]);
    setAddForm({
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
    setModal(null);
  }

  // Submit Edit User
  function handleEditSubmit(e) {
    e.preventDefault();
    if (!targetUser) return;
    const fullName = `${editForm.firstName} ${editForm.middleName ? editForm.middleName + " " : ""}${editForm.lastName}`.trim();

    setUsers(
      users.map((u) =>
        u.id === targetUser.id
          ? {
              ...u,
              username: editForm.username.trim(),
              firstName: editForm.firstName.trim(),
              middleName: editForm.middleName.trim(),
              lastName: editForm.lastName.trim(),
              name: fullName || u.name,
              role: editForm.role,
              email: editForm.email.trim(),
              phone: editForm.phone.trim(),
              address: editForm.address.trim(),
              status: editForm.status,
            }
          : u
      )
    );
    setModal(null);
    setTargetUser(null);
  }

  // Confirm Delete
  function handleDeleteConfirm() {
    if (!targetUser) return;
    setUsers(users.filter((u) => u.id !== targetUser.id));
    setModal(null);
    setTargetUser(null);
  }

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.id.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q);

      const matchesRole =
        selectedRole === "All" ||
        u.role.toLowerCase() === selectedRole.toLowerCase();

      const matchesStatus =
        selectedStatus === "All" ||
        u.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
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
                  <h1>User List</h1>
                </div>
                <p className="rch-user-subtitle">
                  Manage user accounts, roles, and access permissions securely and efficiently.
                </p>
              </div>

              {/* Avatar Profile */}
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
                    <option value="Archived">Archived</option>
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
            <h2 className="rch-user-card-heading">User List</h2>

            <div className="rch-user-table-container">
              <table className="rch-user-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((u) => (
                      <tr key={u.id} className="rch-user-row">
                        <td>{u.id}</td>
                        <td>{u.username}</td>
                        <td>
                          <strong>{u.name}</strong>
                        </td>
                        <td>{u.role}</td>
                        <td>
                          <span
                            className={`rch-status-badge status-${u.status.toLowerCase()}`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td>
                          <div className="rch-user-actions" style={{ justifyContent: "center" }}>
                            <button
                              className="rch-action-icon-btn edit-btn"
                              onClick={() => handleOpenEdit(u)}
                              title="Edit User"
                              aria-label="Edit User"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="rch-action-icon-btn delete-btn"
                              onClick={() => handleOpenDelete(u)}
                              title="Delete User"
                              aria-label="Delete User"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="rch-user-empty">
                        No users found matching your filters.
                      </td>
                    </tr>
                  )}

                  {/* Empty decorative rows to match 1:1 Figma wireframe */}
                  {Array.from({
                    length: Math.max(0, 4 - paginatedUsers.length),
                  }).map((_, i) => (
                    <tr
                      key={`empty-${i}`}
                      className="rch-user-empty-row"
                      aria-hidden="true"
                    >
                      <td colSpan="6">&nbsp;</td>
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

          {/* Bottom Bar: Audit Logs button & Back button */}
          <div className="rch-user-bottom-bar">
            <button
              className="rch-btn-pill-dark"
              onClick={() => onNavigate && onNavigate("User Audit Logs")}
            >
              Audit Logs
            </button>

            <button
              className="rch-btn-back-orange"
              onClick={() => onNavigate && onNavigate("User Management")}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODALS WITH BACKDROP BLUR (1:1 Ratio UI)                            */}
      {/* =================================================================== */}

      {/* 1. ADD A NEW USER MODAL (media_1789045192583.png) */}
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
                      onChange={(e) =>
                        setAddForm({ ...addForm, role: e.target.value })
                      }
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

      {/* 2. EDIT USER MODAL (media_1789045192583.png) */}
      {modal === "edit" && targetUser && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div className="rch-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="rch-modal-title">Edit User</h2>

            <form onSubmit={handleEditSubmit} className="rch-modal-form">
              <div className="rch-form-grid-2col">
                {/* Col 1: User ID */}
                <div className="rch-field-group">
                  <label>User ID</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={editForm.userId}
                    disabled
                  />
                </div>

                {/* Col 2: E-Mail */}
                <div className="rch-field-group">
                  <label>E-Mail</label>
                  <input
                    type="email"
                    className="rch-field-input"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Col 1: Username */}
                <div className="rch-field-group">
                  <label>Username</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Col 2: Phone No. */}
                <div className="rch-field-group">
                  <label>Phone No.</label>
                  <input
                    type="tel"
                    className="rch-field-input"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Col 1: First Name */}
                <div className="rch-field-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Col 2: Enter Password */}
                <div className="rch-field-group">
                  <label>Enter Password</label>
                  <input
                    type="password"
                    className="rch-field-input"
                    value={editForm.password}
                    onChange={(e) =>
                      setEditForm({ ...editForm, password: e.target.value })
                    }
                    placeholder="Leave blank to keep unchanged"
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
                    value={editForm.middleName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, middleName: e.target.value })
                    }
                  />
                </div>

                {/* Col 2: Confirm Password */}
                <div className="rch-field-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="rch-field-input"
                    value={editForm.confirmPassword}
                    onChange={(e) =>
                      setEditForm({ ...editForm, confirmPassword: e.target.value })
                    }
                    placeholder="Leave blank to keep unchanged"
                  />
                </div>

                {/* Col 1: Last Name */}
                <div className="rch-field-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, lastName: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Col 2: Address */}
                <div className="rch-field-group">
                  <label>Address</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm({ ...editForm, address: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Col 1: Role Dropdown */}
                <div className="rch-field-group">
                  <label>Role</label>
                  <div className="rch-modal-select-wrap">
                    <select
                      className="rch-field-input rch-modal-select"
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                    >
                      <option value="Cashier">Cashier</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <ChevronDown size={14} className="rch-modal-select-arrow" />
                  </div>
                </div>

                {/* Col 2: Status Dropdown */}
                <div className="rch-field-group">
                  <label>Status</label>
                  <div className="rch-modal-select-wrap">
                    <select
                      className="rch-field-input rch-modal-select"
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({ ...editForm, status: e.target.value })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Archived">Archived</option>
                    </select>
                    <ChevronDown size={14} className="rch-modal-select-arrow" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="rch-modal-actions">
                <button type="submit" className="rch-btn-submit-orange">
                  Save
                </button>
                <button
                  type="button"
                  className="rch-btn-cancel-dark"
                  onClick={() => {
                    setModal(null);
                    setTargetUser(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DELETE USER CONFIRMATION MODAL */}
      {modal === "delete" && targetUser && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div
            className="rch-modal-box rch-delete-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rch-delete-icon-wrap">
              <Trash2 size={28} />
            </div>
            <h2 className="rch-modal-title">Delete User?</h2>
            <p className="rch-delete-desc">
              Are you sure you want to delete user <strong>{targetUser.name}</strong>{" "}
              (Username: <code>{targetUser.username}</code>)?
              <br />
              This will permanently revoke their access and account.
            </p>

            <div className="rch-modal-actions">
              <button
                type="button"
                className="rch-btn-delete-confirm"
                onClick={handleDeleteConfirm}
              >
                Delete User
              </button>
              <button
                type="button"
                className="rch-btn-cancel-dark"
                onClick={() => {
                  setModal(null);
                  setTargetUser(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PROFILE MODAL */}
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

      {/* 5. EDIT PROFILE MODAL */}
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

UserManagementUserList.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
};

export default UserManagementUserList;

