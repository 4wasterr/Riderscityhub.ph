import { useState, useMemo } from "react";
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
  RotateCcw,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  User,
  X,
} from "lucide-react";
import "./supplier.css";

const navItems = [
  { id: "Dashboard", label: "Dashboard", icon: Home },
  { id: "Inventory", label: "Inventory", icon: ShoppingBag },
  { id: "Products", label: "Products", icon: ShoppingCart },
  { id: "User Management", label: "User Management", icon: User },
  { id: "Supplier Module", label: "Supplier Module", icon: Boxes },
  { id: "Settings", label: "Settings", icon: Settings },
];

const initialSuppliers = [
  {
    id: "SPL-143",
    name: "ABC Moto",
    contactNumber: "+63 912 1273 134",
    status: "Active",
    dateAdded: "2026-08-15",
  },
  {
    id: "SPL-144",
    name: "Moto X Parts",
    contactNumber: "+63 917 2345 678",
    status: "Active",
    dateAdded: "2026-08-18",
  },
  {
    id: "SPL-145",
    name: "Ninja Riders Supply",
    contactNumber: "+63 918 3456 789",
    status: "Inactive",
    dateAdded: "2026-08-20",
  },
  {
    id: "SPL-146",
    name: "SpeedTech Performance",
    contactNumber: "+63 919 4567 890",
    status: "Active",
    dateAdded: "2026-08-22",
  },
];

const initialArchivedSuppliers = [
  {
    id: "SPL-140",
    name: "SuperBikes Co.",
    contactNumber: "+63 915 9876 543",
    dateArchived: "Aug 28, 10:15 AM",
  },
  {
    id: "SPL-142",
    name: "FastTrack Spares",
    contactNumber: "+63 916 8765 432",
    dateArchived: "Sep 02, 02:40 PM",
  },
];

function Supplier({ onLogout, onNavigate }) {
  const [activeNav, setActiveNav] = useState("Supplier Module");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("Admin");

  // Suppliers state
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [archivedSuppliers, setArchivedSuppliers] = useState(initialArchivedSuppliers);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals: null | 'add' | 'edit' | 'delete' | 'archive' | 'profile' | 'edit-profile'
  const [modal, setModal] = useState(null);
  const [targetSupplier, setTargetSupplier] = useState(null);

  // Form State for Add Supplier
  const [addForm, setAddForm] = useState({
    id: "",
    name: "",
    contactNumber: "",
    status: "Active",
  });

  // Form State for Edit Supplier
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    contactNumber: "",
    status: "Active",
  });

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
  function handleOpenEdit(sup) {
    setTargetSupplier(sup);
    setEditForm({ ...sup });
    setModal("edit");
  }

  // Open Delete Modal
  function handleOpenDelete(sup) {
    setTargetSupplier(sup);
    setModal("delete");
  }

  // Add Supplier Submit
  function handleAddSubmit(e) {
    e.preventDefault();
    const newSup = {
      id: addForm.id.trim() || `SPL-${Math.floor(100 + Math.random() * 900)}`,
      name: addForm.name.trim() || "New Supplier",
      contactNumber: addForm.contactNumber.trim() || "+63 900 0000 000",
      status: addForm.status || "Active",
      dateAdded: new Date().toISOString().split("T")[0],
    };

    setSuppliers([newSup, ...suppliers]);
    setAddForm({
      id: "",
      name: "",
      contactNumber: "",
      status: "Active",
    });
    setModal(null);
  }

  // Edit Supplier Submit
  function handleEditSubmit(e) {
    e.preventDefault();
    if (!targetSupplier) return;

    if (editForm.status === "Archived") {
      // Move to archive
      setSuppliers(suppliers.filter((s) => s.id !== targetSupplier.id));
      setArchivedSuppliers([
        {
          id: targetSupplier.id,
          name: editForm.name.trim(),
          contactNumber: editForm.contactNumber.trim(),
          dateArchived: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" }) + ", " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        },
        ...archivedSuppliers,
      ]);
    } else {
      setSuppliers(
        suppliers.map((s) =>
          s.id === targetSupplier.id
            ? {
                ...s,
                name: editForm.name.trim(),
                contactNumber: editForm.contactNumber.trim(),
                status: editForm.status,
              }
            : s
        )
      );
    }
    setModal(null);
    setTargetSupplier(null);
  }

  // Delete Supplier Confirm
  function handleDeleteConfirm() {
    if (!targetSupplier) return;
    setSuppliers(suppliers.filter((s) => s.id !== targetSupplier.id));
    setModal(null);
    setTargetSupplier(null);
  }

  // Restore Archived Supplier
  function handleRestoreSupplier(arc) {
    const restored = {
      id: arc.id,
      name: arc.name,
      contactNumber: arc.contactNumber,
      status: "Active",
      dateAdded: new Date().toISOString().split("T")[0],
    };
    setArchivedSuppliers(archivedSuppliers.filter((a) => a.id !== arc.id));
    setSuppliers([restored, ...suppliers]);
  }

  // Filtered Suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((sup) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        sup.id.toLowerCase().includes(q) ||
        sup.name.toLowerCase().includes(q) ||
        sup.contactNumber.toLowerCase().includes(q) ||
        sup.status.toLowerCase().includes(q)
      );
    });
  }, [suppliers, searchQuery]);

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage) || 1;
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rch-sup-root">
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
      <div className="rch-sup-main">
        <div className="rch-sup-canvas">
          {/* Top Header Card (media_1789046941618.png) */}
          <header className="rch-sup-header-card">
            <div className="rch-sup-header-top">
              <div className="rch-sup-title-area">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    className="rch-hamburger"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Toggle navigation"
                  >
                    <Menu size={22} />
                  </button>
                  <h1>Supplier Module</h1>
                </div>
                <p className="rch-sup-subtitle">Keep track of your suppliers.</p>
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

            {/* Toolbar: Search input & + Add New Supplier button */}
            <div className="rch-sup-toolbar">
              <div className="rch-sup-toolbar-left">
                <div className="rch-sup-search-box">
                  <Search size={16} className="rch-sup-search-icon" />
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
              </div>

              <div className="rch-sup-toolbar-right">
                <button
                  className="rch-btn-add-sup"
                  onClick={() => setModal("add")}
                >
                  + Add New Supplier
                </button>
              </div>
            </div>
          </header>

          {/* Primary Table Card */}
          <div className="rch-sup-card">
            <div className="rch-sup-table-container">
              <table className="rch-sup-table">
                <thead>
                  <tr>
                    <th>Supplier ID</th>
                    <th>Supplier Name</th>
                    <th>Contact Number</th>
                    <th>Status</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSuppliers.length > 0 ? (
                    paginatedSuppliers.map((sup) => (
                      <tr key={sup.id} className="rch-sup-row">
                        <td>{sup.id}</td>
                        <td>
                          <strong>{sup.name}</strong>
                        </td>
                        <td>{sup.contactNumber}</td>
                        <td>
                          <span
                            className={`rch-status-badge status-${sup.status.toLowerCase()}`}
                          >
                            {sup.status}
                          </span>
                        </td>
                        <td>
                          <div className="rch-sup-actions" style={{ justifyContent: "center" }}>
                            <button
                              className="rch-action-icon-btn edit-btn"
                              onClick={() => handleOpenEdit(sup)}
                              title="Edit Supplier"
                              aria-label="Edit Supplier"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="rch-action-icon-btn delete-btn"
                              onClick={() => handleOpenDelete(sup)}
                              title="Delete Supplier"
                              aria-label="Delete Supplier"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="rch-sup-empty">
                        No suppliers found matching your search.
                      </td>
                    </tr>
                  )}

                  {/* Empty rows to match 1:1 Figma wireframe */}
                  {Array.from({
                    length: Math.max(0, 4 - paginatedSuppliers.length),
                  }).map((_, i) => (
                    <tr
                      key={`empty-${i}`}
                      className="rch-sup-empty-row"
                      aria-hidden="true"
                    >
                      <td colSpan="5">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="rch-sup-pagination">
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

          {/* Bottom Bar: Supplier Archive Button */}
          <div className="rch-sup-bottom-bar">
            <button
              className="rch-btn-pill-dark"
              onClick={() => setModal("archive")}
            >
              Supplier Archive
              {archivedSuppliers.length > 0 && (
                <span className="rch-sup-archive-count">
                  {archivedSuppliers.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODALS WITH BACKDROP BLUR (1:1 Ratio UI)                            */}
      {/* =================================================================== */}

      {/* 1. ADD SUPPLIER MODAL (media_1789046969348.png) */}
      {modal === "add" && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div className="rch-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="rch-modal-title">Add Supplier</h2>

            <form onSubmit={handleAddSubmit} className="rch-modal-form">
              <div className="rch-form-grid-2col">
                {/* Col 1: Supplier ID */}
                <div className="rch-field-group">
                  <label>Supplier ID</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.id}
                    onChange={(e) =>
                      setAddForm({ ...addForm, id: e.target.value })
                    }
                    placeholder="e.g. SPL-143"
                    required
                  />
                </div>

                {/* Col 2: Status */}
                <div className="rch-field-group">
                  <label>Status</label>
                  <div className="rch-modal-select-wrap">
                    <select
                      className="rch-field-input rch-modal-select"
                      value={addForm.status}
                      onChange={(e) =>
                        setAddForm({ ...addForm, status: e.target.value })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown size={14} className="rch-modal-select-arrow" />
                  </div>
                </div>

                {/* Col 1: Supplier Name */}
                <div className="rch-field-group">
                  <label>Supplier Name</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.name}
                    onChange={(e) =>
                      setAddForm({ ...addForm, name: e.target.value })
                    }
                    placeholder="Enter supplier name"
                    required
                  />
                </div>

                {/* Col 2: Empty Spacer */}
                <div className="rch-field-group" aria-hidden="true" />

                {/* Col 1: Contact Number */}
                <div className="rch-field-group">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    className="rch-field-input"
                    value={addForm.contactNumber}
                    onChange={(e) =>
                      setAddForm({ ...addForm, contactNumber: e.target.value })
                    }
                    placeholder="+63 912 1273 134"
                    required
                  />
                </div>

                {/* Col 2: Empty Spacer */}
                <div className="rch-field-group" aria-hidden="true" />
              </div>

              {/* Action Buttons: Orange Add + Dark Cancel */}
              <div className="rch-modal-actions">
                <button type="submit" className="rch-btn-submit-orange">
                  Add
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

      {/* 2. EDIT SUPPLIER MODAL (media_1789046969348.png) */}
      {modal === "edit" && targetSupplier && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div className="rch-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="rch-modal-title">Edit Supplier</h2>

            <form onSubmit={handleEditSubmit} className="rch-modal-form">
              <div className="rch-form-grid-2col">
                {/* Col 1: Supplier ID */}
                <div className="rch-field-group">
                  <label>Supplier ID</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={editForm.id}
                    disabled
                  />
                </div>

                {/* Col 2: Status */}
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

                {/* Col 1: Supplier Name */}
                <div className="rch-field-group">
                  <label>Supplier Name</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Col 2: Empty Spacer */}
                <div className="rch-field-group" aria-hidden="true" />

                {/* Col 1: Contact Number */}
                <div className="rch-field-group">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    className="rch-field-input"
                    value={editForm.contactNumber}
                    onChange={(e) =>
                      setEditForm({ ...editForm, contactNumber: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Col 2: Empty Spacer */}
                <div className="rch-field-group" aria-hidden="true" />
              </div>

              {/* Action Buttons: Orange Edit + Dark Cancel (matching screenshot button label "Edit") */}
              <div className="rch-modal-actions">
                <button type="submit" className="rch-btn-submit-orange">
                  Edit
                </button>
                <button
                  type="button"
                  className="rch-btn-cancel-dark"
                  onClick={() => {
                    setModal(null);
                    setTargetSupplier(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DELETE SUPPLIER CONFIRMATION MODAL */}
      {modal === "delete" && targetSupplier && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div
            className="rch-modal-box rch-delete-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rch-delete-icon-wrap">
              <Trash2 size={28} />
            </div>
            <h2 className="rch-modal-title">Delete Supplier?</h2>
            <p className="rch-delete-desc">
              Are you sure you want to delete supplier{" "}
              <strong>{targetSupplier.name}</strong> (ID:{" "}
              <code>{targetSupplier.id}</code>)?
              <br />
              This supplier will be removed from your active vendor list.
            </p>

            <div className="rch-modal-actions">
              <button
                type="button"
                className="rch-btn-delete-confirm"
                onClick={handleDeleteConfirm}
              >
                Delete Supplier
              </button>
              <button
                type="button"
                className="rch-btn-cancel-dark"
                onClick={() => {
                  setModal(null);
                  setTargetSupplier(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUPPLIER ARCHIVE MODAL (same UI as products and user archive with Restore button) */}
      {modal === "archive" && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div
            className="rch-modal-box rch-archive-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="rch-modal-title">Supplier Archive</h2>

            <div className="rch-archive-table-wrap">
              {archivedSuppliers.length > 0 ? (
                <table className="rch-archive-table">
                  <thead>
                    <tr>
                      <th>Supplier ID</th>
                      <th>Supplier Name</th>
                      <th>Contact Number</th>
                      <th>Date Archived</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivedSuppliers.map((arc) => (
                      <tr key={arc.id}>
                        <td>{arc.id}</td>
                        <td>
                          <strong>{arc.name}</strong>
                        </td>
                        <td>{arc.contactNumber}</td>
                        <td>{arc.dateArchived}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="rch-btn-restore"
                            onClick={() => handleRestoreSupplier(arc)}
                            title="Restore Supplier to Active"
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
                  No archived suppliers. When you set a supplier status to
                  &quot;Archived&quot;, it will appear here.
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

      {/* 5. PROFILE MODAL */}
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

      {/* 6. EDIT PROFILE MODAL */}
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

Supplier.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
};

export default Supplier;

