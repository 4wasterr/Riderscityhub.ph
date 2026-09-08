import { useState } from "react";
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
import "./inventory.css";

const navItems = [
  { id: "Dashboard", label: "Dashboard", icon: Home },
  { id: "Inventory", label: "Inventory", icon: ShoppingBag },
  { id: "Products", label: "Products", icon: ShoppingCart },
  { id: "User Management", label: "User Management", icon: User },
  { id: "Supplier Module", label: "Supplier Module", icon: Boxes },
  { id: "Settings", label: "Settings", icon: Settings },
];

const initialInventory = [
  {
    id: "ID-123A",
    name: "1L Engine Oil",
    sku: "EGO-001",
    category: "Engine Oil",
    currentStock: 12,
    cost: "₱1,500",
    retailPrice: "₱1,700",
    supplier: "Moto X",
    brand: "Castrol",
    type: "Synthetic",
  },
  {
    id: "ID-123B",
    name: "LED Headlight",
    sku: "LDH-123",
    category: "Headlight",
    currentStock: 14,
    cost: "₱3,500",
    retailPrice: "₱3,700",
    supplier: "Ninja Riders",
    brand: "Osram",
    type: "LED",
  },
  {
    id: "ID-123C",
    name: "Brake Pads Pro",
    sku: "BKP-042",
    category: "Brakes",
    currentStock: 25,
    cost: "₱850",
    retailPrice: "₱1,100",
    supplier: "Moto X",
    brand: "Brembo",
    type: "Ceramic",
  },
  {
    id: "ID-123D",
    name: "Chain Lube 300ml",
    sku: "CHL-008",
    category: "Lubricant",
    currentStock: 18,
    cost: "₱450",
    retailPrice: "₱600",
    supplier: "SpeedTech",
    brand: "Motul",
    type: "Spray",
  },
  {
    id: "ID-123E",
    name: "Sport Helmet Visor",
    sku: "VSR-991",
    category: "Accessories",
    currentStock: 8,
    cost: "₱1,200",
    retailPrice: "₱1,550",
    supplier: "Ninja Riders",
    brand: "AGV",
    type: "Tinted",
  },
  {
    id: "ID-123F",
    name: "Front Fork Oil",
    sku: "FKO-204",
    category: "Engine Oil",
    currentStock: 10,
    cost: "₱750",
    retailPrice: "₱950",
    supplier: "Moto X",
    brand: "Yamalube",
    type: "Mineral",
  },
];

const initialHistory = [
  {
    id: "#HST-001",
    type: "Stock In",
    productName: "1L Engine Oil",
    quantity: 10,
    date: "Sep 08, 02:30 PM",
    user: "Admin",
    supplier: "Moto X",
  },
  {
    id: "#HST-002",
    type: "Stock Out",
    productName: "LED Headlight",
    quantity: 2,
    date: "Sep 08, 01:15 PM",
    user: "Jane",
    supplier: "Ninja Riders",
  },
  {
    id: "#HST-003",
    type: "Stock In",
    productName: "Brake Pads Pro",
    quantity: 15,
    date: "Sep 07, 11:45 AM",
    user: "Admin",
    supplier: "Moto X",
  },
];

function Inventory({ onLogout, onNavigate }) {
  const [activeNav, setActiveNav] = useState("Inventory");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("Admin");

  // Inventory Table State
  const [inventory, setInventory] = useState(initialInventory);
  const [history, setHistory] = useState(initialHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Active Modal: null | 'stock-in' | 'stock-out' | 'history' | 'profile' | 'edit-profile'
  const [modal, setModal] = useState(null);

  // Stock In Form
  const [stockInForm, setStockInForm] = useState({
    productId: "",
    productName: "",
    category: "",
    brand: "",
    remainingStocks: "",
    price: "",
    type: "",
    supplier: "",
  });

  // Stock Out Form
  const [stockOutForm, setStockOutForm] = useState({
    productName: "",
    category: "",
    brand: "",
    type: "",
    remainingStocks: "",
    price: "",
    supplier: "",
  });

  // Navigation Helper
  function handleNavClick(itemId) {
    setActiveNav(itemId);
    setIsSidebarOpen(false);
    if (itemId === "Dashboard" && onNavigate) {
      onNavigate("Dashboard");
    }
  }

  // Stock In Handler
  function handleStockInSubmit(e) {
    e.preventDefault();
    const qty = parseInt(stockInForm.remainingStocks, 10) || 1;
    const existingIndex = inventory.findIndex(
      (item) =>
        (stockInForm.productId && item.id.toLowerCase() === stockInForm.productId.toLowerCase()) ||
        (stockInForm.productName && item.name.toLowerCase() === stockInForm.productName.toLowerCase())
    );

    if (existingIndex >= 0) {
      // Update existing item
      const updated = [...inventory];
      updated[existingIndex] = {
        ...updated[existingIndex],
        currentStock: updated[existingIndex].currentStock + qty,
        retailPrice: stockInForm.price ? `₱${stockInForm.price.replace(/[^\d.]/g, "")}` : updated[existingIndex].retailPrice,
      };
      setInventory(updated);
    } else {
      // Add new item
      const newItem = {
        id: stockInForm.productId || `ID-${Math.floor(100 + Math.random() * 900)}`,
        name: stockInForm.productName || "New Product",
        sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
        category: stockInForm.category || "General",
        currentStock: qty,
        cost: stockInForm.price ? `₱${stockInForm.price.replace(/[^\d.]/g, "")}` : "₱1,000",
        retailPrice: stockInForm.price ? `₱${(parseFloat(stockInForm.price.replace(/[^\d.]/g, "") || 1000) * 1.15).toFixed(0)}` : "₱1,200",
        supplier: stockInForm.supplier || "Standard Supplier",
        brand: stockInForm.brand || "Standard",
        type: stockInForm.type || "Standard",
      };
      setInventory([newItem, ...inventory]);
    }

    // Log History
    const newLog = {
      id: `#HST-${String(history.length + 1).padStart(3, "0")}`,
      type: "Stock In",
      productName: stockInForm.productName || stockInForm.productId || "Inventory Item",
      quantity: qty,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" }) + ", " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      user: profileName,
      supplier: stockInForm.supplier || "Supplier",
    };
    setHistory([newLog, ...history]);

    // Reset and Close
    setStockInForm({
      productId: "",
      productName: "",
      category: "",
      brand: "",
      remainingStocks: "",
      price: "",
      type: "",
      supplier: "",
    });
    setModal(null);
  }

  // Stock Out Handler
  function handleStockOutSubmit(e) {
    e.preventDefault();
    const qty = parseInt(stockOutForm.remainingStocks, 10) || 1;
    const existingIndex = inventory.findIndex(
      (item) =>
        stockOutForm.productName &&
        item.name.toLowerCase().includes(stockOutForm.productName.toLowerCase())
    );

    if (existingIndex >= 0) {
      const updated = [...inventory];
      const target = updated[existingIndex];
      const newStock = Math.max(0, target.currentStock - qty);
      updated[existingIndex] = { ...target, currentStock: newStock };
      setInventory(updated);
    }

    // Log History
    const newLog = {
      id: `#HST-${String(history.length + 1).padStart(3, "0")}`,
      type: "Stock Out",
      productName: stockOutForm.productName || "Inventory Item",
      quantity: qty,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" }) + ", " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      user: profileName,
      supplier: stockOutForm.supplier || "Dispatched",
    };
    setHistory([newLog, ...history]);

    // Reset and Close
    setStockOutForm({
      productName: "",
      category: "",
      brand: "",
      type: "",
      remainingStocks: "",
      price: "",
      supplier: "",
    });
    setModal(null);
  }

  // Auto-fill Stock Out when product name is typed
  function handleStockOutNameChange(name) {
    const match = inventory.find((i) => i.name.toLowerCase() === name.toLowerCase());
    if (match) {
      setStockOutForm({
        productName: match.name,
        category: match.category,
        brand: match.brand || "",
        type: match.type || "",
        remainingStocks: String(match.currentStock),
        price: match.retailPrice,
        supplier: match.supplier,
      });
    } else {
      setStockOutForm((prev) => ({ ...prev, productName: name }));
    }
  }

  // Filter Inventory
  const filteredInventory = inventory.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.id.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.supplier.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === "All" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Pagination Calculations
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage) || 1;
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="rch-inventory-root">
      {/* Left Sidebar */}
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

          {/* Sidebar Footer: Logout */}
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
      <div className="rch-inventory-main">
        <div className="rch-inventory-canvas">
          {/* Top Header Card (Separate White Box) */}
          <header className="rch-inv-header-card">
            <div className="rch-inv-title-area">
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  className="rch-hamburger"
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Toggle navigation"
                >
                  <Menu size={22} />
                </button>
                <h1>Inventory</h1>
              </div>
              <p className="rch-inv-subtitle">
                Keep your inventory accurate and organized.
              </p>
            </div>

            {/* Profile Avatar & Dropdown */}
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
          </header>

          {/* Main Inventory Card (Separate White Box) */}
          <div className="rch-inventory-card">
            {/* Toolbar: Search, Category, Stock Buttons */}
            <div className="rch-inv-toolbar">
              <div className="rch-inv-toolbar-left">
                {/* Search Bar */}
                <div className="rch-inv-search-box">
                  <Search size={16} className="rch-inv-search-icon" />
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
                <div className="rch-inv-category-select-wrap">
                  <select
                    className="rch-inv-category-select"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">Category</option>
                    <option value="Engine Oil">Engine Oil</option>
                    <option value="Headlight">Headlight</option>
                    <option value="Brakes">Brakes</option>
                    <option value="Lubricant">Lubricant</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                  <ChevronDown size={14} className="rch-inv-select-arrow" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="rch-inv-toolbar-right">
                <button
                  className="rch-btn-stock-in"
                  onClick={() => setModal("stock-in")}
                >
                  + Stock In
                </button>
                <button
                  className="rch-btn-stock-out"
                  onClick={() => setModal("stock-out")}
                >
                  - Stock Out
                </button>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="rch-inv-table-container">
              <table className="rch-inv-table">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Cost</th>
                    <th>Retail Price</th>
                    <th>Supplier</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInventory.length > 0 ? (
                    paginatedInventory.map((item) => (
                      <tr key={item.id} className="rch-inv-row">
                        <td>{item.id}</td>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>{item.sku}</td>
                        <td>{item.category}</td>
                        <td>
                          <span
                            className={`rch-stock-badge ${item.currentStock <= 10 ? "rch-stock-low" : ""}`}
                          >
                            {item.currentStock}
                          </span>
                        </td>
                        <td>{item.cost}</td>
                        <td>{item.retailPrice}</td>
                        <td>{item.supplier}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="rch-inv-empty">
                        No inventory items found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="rch-inv-pagination">
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

          {/* Bottom Bar: Inventory History Button */}
          <div className="rch-inv-bottom-bar">
            <button
              className="rch-btn-history"
              onClick={() => setModal("history")}
            >
              Inventory History
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MODALS WITH BACKDROP BLUR                                           */}
      {/* =================================================================== */}

      {/* 1. STOCK IN MODAL */}
      {modal === "stock-in" && (
        <div
          className="rch-blur-overlay"
          onClick={() => setModal(null)}
        >
          <div
            className="rch-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="rch-modal-title">Stock In</h2>

            <form onSubmit={handleStockInSubmit} className="rch-modal-form">
              <div className="rch-form-grid-2col">
                {/* Column 1 */}
                <div className="rch-field-group">
                  <label>Product ID</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockInForm.productId}
                    onChange={(e) =>
                      setStockInForm({ ...stockInForm, productId: e.target.value })
                    }
                    placeholder="e.g. ID-123A"
                    required
                  />
                </div>

                <div className="rch-field-group">
                  <label>Remaining Stocks</label>
                  <input
                    type="number"
                    min="1"
                    className="rch-field-input"
                    value={stockInForm.remainingStocks}
                    onChange={(e) =>
                      setStockInForm({ ...stockInForm, remainingStocks: e.target.value })
                    }
                    placeholder="Quantity to add"
                    required
                  />
                </div>

                <div className="rch-field-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockInForm.productName}
                    onChange={(e) =>
                      setStockInForm({ ...stockInForm, productName: e.target.value })
                    }
                    placeholder="e.g. 1L Engine Oil"
                    required
                  />
                </div>

                <div className="rch-field-group">
                  <label>Price</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockInForm.price}
                    onChange={(e) =>
                      setStockInForm({ ...stockInForm, price: e.target.value })
                    }
                    placeholder="e.g. 1500"
                  />
                </div>

                <div className="rch-field-group">
                  <label>Category</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockInForm.category}
                    onChange={(e) =>
                      setStockInForm({ ...stockInForm, category: e.target.value })
                    }
                    placeholder="e.g. Engine Oil"
                  />
                </div>

                <div className="rch-field-group">
                  <label>Type</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockInForm.type}
                    onChange={(e) =>
                      setStockInForm({ ...stockInForm, type: e.target.value })
                    }
                    placeholder="e.g. Synthetic"
                  />
                </div>

                <div className="rch-field-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockInForm.brand}
                    onChange={(e) =>
                      setStockInForm({ ...stockInForm, brand: e.target.value })
                    }
                    placeholder="e.g. Castrol"
                  />
                </div>

                <div className="rch-field-group">
                  <label>Supplier</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockInForm.supplier}
                    onChange={(e) =>
                      setStockInForm({ ...stockInForm, supplier: e.target.value })
                    }
                    placeholder="e.g. Moto X"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="rch-modal-actions">
                <button type="submit" className="rch-btn-submit-orange">
                  Stock In
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

      {/* 2. STOCK OUT MODAL */}
      {modal === "stock-out" && (
        <div
          className="rch-blur-overlay"
          onClick={() => setModal(null)}
        >
          <div
            className="rch-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="rch-modal-title">Stock Out</h2>

            <form onSubmit={handleStockOutSubmit} className="rch-modal-form">
              <div className="rch-form-grid-2col">
                {/* Column 1 */}
                <div className="rch-field-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockOutForm.productName}
                    onChange={(e) => handleStockOutNameChange(e.target.value)}
                    placeholder="Search or enter name"
                    required
                  />
                </div>

                <div className="rch-field-group">
                  <label>Remaining Stocks</label>
                  <input
                    type="number"
                    min="1"
                    className="rch-field-input"
                    value={stockOutForm.remainingStocks}
                    onChange={(e) =>
                      setStockOutForm({ ...stockOutForm, remainingStocks: e.target.value })
                    }
                    placeholder="Quantity to release"
                    required
                  />
                </div>

                <div className="rch-field-group">
                  <label>Category</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockOutForm.category}
                    onChange={(e) =>
                      setStockOutForm({ ...stockOutForm, category: e.target.value })
                    }
                    placeholder="Category"
                  />
                </div>

                <div className="rch-field-group">
                  <label>Price</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockOutForm.price}
                    onChange={(e) =>
                      setStockOutForm({ ...stockOutForm, price: e.target.value })
                    }
                    placeholder="Price"
                  />
                </div>

                <div className="rch-field-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockOutForm.brand}
                    onChange={(e) =>
                      setStockOutForm({ ...stockOutForm, brand: e.target.value })
                    }
                    placeholder="Brand"
                  />
                </div>

                <div className="rch-field-group">
                  <label>Supplier</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockOutForm.supplier}
                    onChange={(e) =>
                      setStockOutForm({ ...stockOutForm, supplier: e.target.value })
                    }
                    placeholder="Supplier"
                  />
                </div>

                <div className="rch-field-group">
                  <label>Type</label>
                  <input
                    type="text"
                    className="rch-field-input"
                    value={stockOutForm.type}
                    onChange={(e) =>
                      setStockOutForm({ ...stockOutForm, type: e.target.value })
                    }
                    placeholder="Type"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="rch-modal-actions">
                <button type="submit" className="rch-btn-submit-orange">
                  Stock Out
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

      {/* 3. INVENTORY HISTORY MODAL */}
      {modal === "history" && (
        <div
          className="rch-blur-overlay"
          onClick={() => setModal(null)}
        >
          <div
            className="rch-modal-box rch-history-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="rch-modal-title">Inventory History</h2>

            <div style={{ maxHeight: "320px", overflowY: "auto", marginBottom: "20px" }}>
              <table className="rch-history-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Action</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Date & Time</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <strong>{log.id}</strong>
                      </td>
                      <td>
                        <span
                          className={
                            log.type === "Stock In"
                              ? "rch-badge-stock-in"
                              : "rch-badge-stock-out"
                          }
                        >
                          {log.type}
                        </span>
                      </td>
                      <td>{log.productName}</td>
                      <td>
                        <strong>{log.quantity}</strong>
                      </td>
                      <td>{log.date}</td>
                      <td>{log.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* 4. PROFILE MODAL */}
      {modal === "profile" && (
        <div
          className="rch-blur-overlay"
          onClick={() => setModal(null)}
        >
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
                  background: "#cbf3c3",
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
        <div
          className="rch-blur-overlay"
          onClick={() => setModal(null)}
        >
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

Inventory.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
};

export default Inventory;
