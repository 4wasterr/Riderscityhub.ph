import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Boxes,
  Calendar,
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
import "./products.css";

const navItems = [
  { id: "Dashboard", label: "Dashboard", icon: Home },
  { id: "Inventory", label: "Inventory", icon: ShoppingBag },
  { id: "Products", label: "Products", icon: ShoppingCart },
  { id: "User Management", label: "User Management", icon: User },
  { id: "Supplier Module", label: "Supplier Module", icon: Boxes },
  { id: "Settings", label: "Settings", icon: Settings },
];

const initialProducts = [
  {
    id: "PROD-001",
    name: "1L Engine Oil",
    sku: "EGO-001",
    category: "Engine Oil",
    brand: "Shimano",
    type: "Engine Oil",
    sellingPrice: "₱1,500",
    status: "Active",
    date: "2026-08-16",
  },
  {
    id: "PROD-002",
    name: "Xtra Helmet",
    sku: "XTR-045",
    category: "Helmet",
    brand: "Honda",
    type: "Accessory",
    sellingPrice: "₱1,500",
    status: "Inactive",
    date: "2026-08-18",
  },
  {
    id: "PROD-003",
    name: "LED Headlight",
    sku: "LHT-123",
    category: "Headlight",
    brand: "Yamaha",
    type: "Light",
    sellingPrice: "₱1,500",
    status: "Archived",
    date: "2026-08-19",
  },
  {
    id: "PROD-004",
    name: "Disc Brake Pad",
    sku: "DBP-088",
    category: "Brakes",
    brand: "Brembo",
    type: "Brake",
    sellingPrice: "₱850",
    status: "Active",
    date: "2026-08-15",
  },
  {
    id: "PROD-005",
    name: "Drive Chain 520",
    sku: "CHN-520",
    category: "Transmission",
    brand: "DID",
    type: "Chain",
    sellingPrice: "₱2,200",
    status: "Active",
    date: "2026-08-20",
  },
];

function Products({ onLogout, onNavigate }) {
  const [activeNav, setActiveNav] = useState("Products");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("Admin");

  // Products Data
  const [products, setProducts] = useState(initialProducts);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [fromDate, setFromDate] = useState("2026-08-15");
  const [toDate, setToDate] = useState("2026-08-20");
  const [dateSortOrder, setDateSortOrder] = useState("desc"); // 'asc' | 'desc'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals: null | 'add' | 'edit' | 'delete' | 'archive' | 'profile' | 'edit-profile'
  const [modal, setModal] = useState(null);

  // Active product selected for Edit or Delete
  const [targetProduct, setTargetProduct] = useState(null);

  // Form State for Add Product
  const [addForm, setAddForm] = useState({
    name: "",
    category: "",
    brand: "",
    type: "",
    sku: "",
    sellingPrice: "",
  });

  // Form State for Edit Product
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    category: "",
    brand: "",
    type: "",
    sku: "",
    sellingPrice: "",
    status: "Active",
    date: "",
  });

  // Unique Categories & Types for Filter Dropdowns
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [products]);

  const types = useMemo(() => {
    const set = new Set(products.map((p) => p.type).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [products]);

  // Handle navigation
  function handleNavClick(itemId) {
    setActiveNav(itemId);
    setIsSidebarOpen(false);
    if (itemId === "Dashboard" && onNavigate) onNavigate("Dashboard");
    if (itemId === "Inventory" && onNavigate) onNavigate("Inventory");
    if (itemId === "User Management" && onNavigate) onNavigate("User Management");
    if (itemId === "Supplier Module" && onNavigate) onNavigate("Supplier Module");
    if (itemId === "Settings" && onNavigate) onNavigate("Settings");
  }

  // Open Edit Modal
  function handleOpenEdit(prod) {
    setTargetProduct(prod);
    setEditForm({ ...prod });
    setModal("edit");
  }

  // Open Delete Modal
  function handleOpenDelete(prod) {
    setTargetProduct(prod);
    setModal("delete");
  }

  // Handle Add Product Submit
  function handleAddSubmit(e) {
    e.preventDefault();
    const newProd = {
      id: `PROD-${String(products.length + 1).padStart(3, "0")}`,
      name: addForm.name.trim() || "New Product",
      sku: addForm.sku.trim() || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      category: addForm.category.trim() || "General",
      brand: addForm.brand.trim() || "Generic",
      type: addForm.type.trim() || "Standard",
      sellingPrice: addForm.sellingPrice.trim().startsWith("₱")
        ? addForm.sellingPrice.trim()
        : `₱${addForm.sellingPrice.trim().replace(/[^\d.]/g, "") || "1,000"}`,
      status: "Active",
      date: new Date().toISOString().split("T")[0],
    };

    setProducts([newProd, ...products]);
    setAddForm({
      name: "",
      category: "",
      brand: "",
      type: "",
      sku: "",
      sellingPrice: "",
    });
    setModal(null);
  }

  // Handle Edit Product Submit
  function handleEditSubmit(e) {
    e.preventDefault();
    if (!targetProduct) return;

    const updatedPrice = editForm.sellingPrice.trim().startsWith("₱")
      ? editForm.sellingPrice.trim()
      : `₱${editForm.sellingPrice.trim().replace(/[^\d.]/g, "") || "1,000"}`;

    setProducts(
      products.map((p) =>
        p.id === targetProduct.id
          ? {
              ...p,
              name: editForm.name.trim(),
              category: editForm.category.trim(),
              brand: editForm.brand.trim(),
              type: editForm.type.trim(),
              sku: editForm.sku.trim(),
              sellingPrice: updatedPrice,
              status: editForm.status,
            }
          : p
      )
    );
    setModal(null);
    setTargetProduct(null);
  }

  // Handle Delete Confirmation
  function handleDeleteConfirm() {
    if (!targetProduct) return;
    setProducts(products.filter((p) => p.id !== targetProduct.id));
    setModal(null);
    setTargetProduct(null);
  }

  // Handle Restore Archived Product
  function handleRestoreProduct(prodId) {
    setProducts(
      products.map((p) => (p.id === prodId ? { ...p, status: "Active" } : p))
    );
  }

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Search query
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q);

        // Category filter
        const matchesCat =
          selectedCategory === "All" ||
          item.category.toLowerCase() === selectedCategory.toLowerCase();

        // Type filter
        const matchesType =
          selectedType === "All" ||
          item.type.toLowerCase() === selectedType.toLowerCase();

        // Date Range filter
        let matchesDate = true;
        if (fromDate && item.date < fromDate) matchesDate = false;
        if (toDate && item.date > toDate) matchesDate = false;

        return matchesSearch && matchesCat && matchesType && matchesDate;
      })
      .sort((a, b) => {
        if (dateSortOrder === "asc") {
          return a.date.localeCompare(b.date);
        }
        return b.date.localeCompare(a.date);
      });
  }, [products, searchQuery, selectedCategory, selectedType, fromDate, toDate, dateSortOrder]);

  // Paginated View
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Archived products count & list
  const archivedProducts = useMemo(() => {
    return products.filter((p) => p.status.toLowerCase() === "archived");
  }, [products]);

  // Reset Date Filters
  function handleResetDates() {
    setFromDate("");
    setToDate("");
  }

  return (
    <div className="rch-products-root">
      {/* Sidebar Navigation */}
      <aside className={`rch-sidebar ${isSidebarOpen ? "is-open" : ""}`} aria-label="Sidebar">
        <div className="rch-sidebar-inner">
          {/* Brand Header */}
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

          {/* Nav Items */}
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

          {/* Logout */}
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
      <div className="rch-products-main">
        <div className="rch-products-canvas">
          {/* Top Header Card (Title, Search, Category, Type, Add Button) */}
          <header className="rch-prod-header-card">
            {/* Top row: Title + Profile Avatar */}
            <div className="rch-prod-header-top">
              <div className="rch-prod-title-area">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    className="rch-hamburger"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Toggle navigation"
                  >
                    <Menu size={22} />
                  </button>
                  <h1>Products</h1>
                </div>
                <p className="rch-prod-subtitle">
                  Manage product details, pricing, and categories.
                </p>
              </div>

              {/* Avatar & Profile Dropdown */}
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

            {/* Bottom row: Search, Category, Type, Add New Product */}
            <div className="rch-prod-toolbar">
              <div className="rch-prod-toolbar-left">
                {/* Search Bar */}
                <div className="rch-prod-search-box">
                  <Search size={16} className="rch-prod-search-icon" />
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

                {/* Category Dropdown */}
                <div className="rch-prod-select-wrap">
                  <select
                    className="rch-prod-select"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">Category</option>
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                  <ChevronDown size={14} className="rch-prod-select-arrow" />
                </div>

                {/* Type Dropdown */}
                <div className="rch-prod-select-wrap">
                  <select
                    className="rch-prod-select"
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">Type</option>
                    {types
                      .filter((t) => t !== "All")
                      .map((typ) => (
                        <option key={typ} value={typ}>
                          {typ}
                        </option>
                      ))}
                  </select>
                  <ChevronDown size={14} className="rch-prod-select-arrow" />
                </div>
              </div>

              {/* + Add new Product Button */}
              <div className="rch-prod-toolbar-right">
                <button
                  className="rch-btn-add-product"
                  onClick={() => setModal("add")}
                >
                  + Add new Product
                </button>
              </div>
            </div>
          </header>

          {/* Main Table Card (Date filter, Products Table, Pagination) */}
          <div className="rch-products-card">
            {/* Date Filters Header Row */}
            <div className="rch-prod-date-bar">
              <div className="rch-date-picker-group">
                {/* From Date */}
                <div className="rch-date-input-wrap">
                  <Calendar size={15} className="rch-calendar-icon" />
                  <span className="rch-date-label">From:</span>
                  <input
                    type="date"
                    className="rch-date-native"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  <span className="rch-date-display">
                    [{fromDate ? fromDate.replace(/-/g, "/") : "MM/DD/YYYY"}]
                  </span>
                </div>

                {/* To Date */}
                <div className="rch-date-input-wrap">
                  <Calendar size={15} className="rch-calendar-icon" />
                  <span className="rch-date-label">To:</span>
                  <input
                    type="date"
                    className="rch-date-native"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  <span className="rch-date-display">
                    [{toDate ? toDate.replace(/-/g, "/") : "MM/DD/YYYY"}]
                  </span>
                </div>

                {/* Reset / Sort date button */}
                <button
                  className="rch-date-sort-btn"
                  onClick={() =>
                    setDateSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  title={`Sorted: ${dateSortOrder === "asc" ? "Oldest First" : "Newest First"}`}
                >
                  Sort Date ({dateSortOrder === "asc" ? "↑" : "↓"})
                </button>

                {(fromDate || toDate) && (
                  <button
                    className="rch-date-reset-btn"
                    onClick={handleResetDates}
                    title="Clear Date Range"
                  >
                    <RotateCcw size={13} />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Products Table */}
            <div className="rch-prod-table-container">
              <table className="rch-prod-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Type</th>
                    <th>Selling Price</th>
                    <th>Status</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((item) => (
                      <tr key={item.id} className="rch-prod-row">
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>{item.sku}</td>
                        <td>{item.category}</td>
                        <td>{item.brand}</td>
                        <td>{item.type}</td>
                        <td>{item.sellingPrice}</td>
                        <td>
                          <span
                            className={`rch-status-badge status-${item.status.toLowerCase()}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div className="rch-prod-actions">
                            <button
                              className="rch-action-icon-btn edit-btn"
                              onClick={() => handleOpenEdit(item)}
                              title="Edit Product"
                              aria-label="Edit Product"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="rch-action-icon-btn delete-btn"
                              onClick={() => handleOpenDelete(item)}
                              title="Delete Product"
                              aria-label="Delete Product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="rch-prod-empty">
                        No products found matching your date or search filters.
                      </td>
                    </tr>
                  )}

                  {/* Empty decorative rows to match wireframe 1:1 ratio */}
                  {Array.from({
                    length: Math.max(0, 4 - paginatedProducts.length),
                  }).map((_, i) => (
                    <tr
                      key={`empty-${i}`}
                      className="rch-prod-empty-row"
                      aria-hidden="true"
                    >
                      <td colSpan="8">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="rch-prod-pagination">
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

          {/* Bottom Bar: Product Archive Button */}
          <div className="rch-prod-bottom-bar">
            <button
              className="rch-btn-archive"
              onClick={() => setModal("archive")}
            >
              Product Archive
              {archivedProducts.length > 0 && (
                <span className="rch-archive-count">
                  {archivedProducts.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODALS WITH BACKDROP BLUR (1:1 Ratio UI)                            */}
      {/* =================================================================== */}

      {/* 1. ADD NEW PRODUCT MODAL */}
      {modal === "add" && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div className="rch-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="rch-modal-title">Add new product</h2>

            <form onSubmit={handleAddSubmit} className="rch-modal-form">
              <div className="rch-form-grid-2col">
                {/* Column 1 (Left): Product Name, Category, Brand, Type */}
                <div className="rch-field-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.name}
                    onChange={(e) =>
                      setAddForm({ ...addForm, name: e.target.value })
                    }
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Column 2 (Right): SKU */}
                <div className="rch-field-group">
                  <label>SKU</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.sku}
                    onChange={(e) =>
                      setAddForm({ ...addForm, sku: e.target.value })
                    }
                    placeholder="e.g. EGO-001"
                    required
                  />
                </div>

                {/* Column 1: Category */}
                <div className="rch-field-group">
                  <label>Category</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.category}
                    onChange={(e) =>
                      setAddForm({ ...addForm, category: e.target.value })
                    }
                    placeholder="e.g. Engine Oil"
                    required
                  />
                </div>

                {/* Column 2: Selling Price */}
                <div className="rch-field-group">
                  <label>Selling Price</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.sellingPrice}
                    onChange={(e) =>
                      setAddForm({ ...addForm, sellingPrice: e.target.value })
                    }
                    placeholder="e.g. 1500"
                    required
                  />
                </div>

                {/* Column 1: Brand */}
                <div className="rch-field-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.brand}
                    onChange={(e) =>
                      setAddForm({ ...addForm, brand: e.target.value })
                    }
                    placeholder="e.g. Shimano"
                    required
                  />
                </div>

                {/* Column 2: Empty Spacer to maintain 2-col layout */}
                <div className="rch-field-group" aria-hidden="true" />

                {/* Column 1: Type */}
                <div className="rch-field-group">
                  <label>Type</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={addForm.type}
                    onChange={(e) =>
                      setAddForm({ ...addForm, type: e.target.value })
                    }
                    placeholder="e.g. Engine Oil"
                    required
                  />
                </div>

                {/* Column 2: Empty Spacer */}
                <div className="rch-field-group" aria-hidden="true" />
              </div>

              {/* Action Buttons */}
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

      {/* 2. EDIT PRODUCT MODAL */}
      {modal === "edit" && targetProduct && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div className="rch-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="rch-modal-title">Edit product</h2>

            <form onSubmit={handleEditSubmit} className="rch-modal-form">
              <div className="rch-form-grid-2col">
                {/* Column 1: Product Name */}
                <div className="rch-field-group">
                  <label>Product Name</label>
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

                {/* Column 2: SKU */}
                <div className="rch-field-group">
                  <label>SKU</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={editForm.sku}
                    onChange={(e) =>
                      setEditForm({ ...editForm, sku: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Column 1: Category */}
                <div className="rch-field-group">
                  <label>Category</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Column 2: Selling Price */}
                <div className="rch-field-group">
                  <label>Selling Price</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={editForm.sellingPrice}
                    onChange={(e) =>
                      setEditForm({ ...editForm, sellingPrice: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Column 1: Brand */}
                <div className="rch-field-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={editForm.brand}
                    onChange={(e) =>
                      setEditForm({ ...editForm, brand: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Column 2: Status Dropdown */}
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

                {/* Column 1: Type */}
                <div className="rch-field-group">
                  <label>Type</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={editForm.type}
                    onChange={(e) =>
                      setEditForm({ ...editForm, type: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Column 2: Empty Spacer */}
                <div className="rch-field-group" aria-hidden="true" />
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
                    setTargetProduct(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DELETE CONFIRMATION MODAL */}
      {modal === "delete" && targetProduct && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div
            className="rch-modal-box rch-delete-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rch-delete-icon-wrap">
              <Trash2 size={28} />
            </div>
            <h2 className="rch-modal-title">Delete Product?</h2>
            <p className="rch-delete-desc">
              Are you sure you want to delete <strong>{targetProduct.name}</strong>{" "}
              (SKU: <code>{targetProduct.sku}</code>)?
              <br />
              This will remove the product from your inventory database.
            </p>

            <div className="rch-modal-actions">
              <button
                type="button"
                className="rch-btn-delete-confirm"
                onClick={handleDeleteConfirm}
              >
                Delete Product
              </button>
              <button
                type="button"
                className="rch-btn-cancel-dark"
                onClick={() => {
                  setModal(null);
                  setTargetProduct(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRODUCT ARCHIVE MODAL */}
      {modal === "archive" && (
        <div className="rch-blur-overlay" onClick={() => setModal(null)}>
          <div
            className="rch-modal-box rch-archive-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="rch-modal-title">Product Archive</h2>

            <div className="rch-archive-table-wrap">
              {archivedProducts.length > 0 ? (
                <table className="rch-archive-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Selling Price</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivedProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.name}</strong>
                        </td>
                        <td>{p.sku}</td>
                        <td>{p.category}</td>
                        <td>{p.sellingPrice}</td>
                        <td>{p.date}</td>
                        <td>
                          <button
                            className="rch-btn-restore"
                            onClick={() => handleRestoreProduct(p.id)}
                            title="Restore Product to Active"
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
                  No archived products. You can set a product status to
                  &quot;Archived&quot; in the Edit modal.
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

Products.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
};

export default Products;

