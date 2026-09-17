import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Boxes,
  Check,
  Edit2,
  Home,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import "./dashboard.css";

const navItems = [
  { id: "Dashboard", label: "Dashboard", icon: Home },
  { id: "Inventory", label: "Inventory", icon: ShoppingBag },
  { id: "Products", label: "Products", icon: ShoppingCart },
  { id: "User Management", label: "User Management", icon: User },
  { id: "Supplier Module", label: "Supplier Module", icon: Boxes },
  { id: "Settings", label: "Settings", icon: Settings },
];

const barChartData = {
  Weekly: [
    { label: "Mon", value: 18, formatted: "₱18k", height: 36 },
    { label: "Tue", value: 34, formatted: "₱34k", height: 68 },
    { label: "Wed", value: 28, formatted: "₱28k", height: 56 },
    { label: "Thu", value: 46, formatted: "₱46k", height: 92 },
    { label: "Fri", value: 24, formatted: "₱24k", height: 48 },
    { label: "Sat", value: 30, formatted: "₱30k", height: 60 },
    { label: "Sun", value: 49, formatted: "₱49k", height: 98 },
  ],
  Quarterly: [
    { label: "Jan-Feb", value: 32, formatted: "₱32k", height: 64 },
    { label: "Mar-Apr", value: 42, formatted: "₱42k", height: 84 },
    { label: "May-Jun", value: 38, formatted: "₱38k", height: 76 },
    { label: "Jul-Aug", value: 48, formatted: "₱48k", height: 96 },
    { label: "Sep-Oct", value: 35, formatted: "₱35k", height: 70 },
    { label: "Nov-Dec", value: 50, formatted: "₱50k", height: 100 },
  ],
  Annually: [
    { label: "2021", value: 28, formatted: "₱280k", height: 56 },
    { label: "2022", value: 36, formatted: "₱360k", height: 72 },
    { label: "2023", value: 42, formatted: "₱420k", height: 84 },
    { label: "2024", value: 46, formatted: "₱460k", height: 92 },
    { label: "2025", value: 50, formatted: "₱500k", height: 100 },
  ],
};

const lineChartData = {
  Weekly: {
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    series: [
      {
        name: "Helmet Pad",
        color: "#ff6584",
        points: [
          [25, 52],
          [100, 46],
          [175, 42],
          [250, 38],
          [325, 34],
          [400, 28],
          [475, 24],
        ],
        values: ["₱38k", "₱42k", "₱45k", "₱48k", "₱51k", "₱56k", "₱60k"],
      },
      {
        name: "Brakes",
        color: "#48d597",
        points: [
          [25, 88],
          [100, 84],
          [175, 78],
          [250, 74],
          [325, 70],
          [400, 65],
          [475, 60],
        ],
        values: ["₱25k", "₱27k", "₱30k", "₱32k", "₱35k", "₱38k", "₱41k"],
      },
      {
        name: "Lube Oil",
        color: "#eab308",
        points: [
          [25, 122],
          [100, 118],
          [175, 114],
          [250, 108],
          [325, 104],
          [400, 98],
          [475, 94],
        ],
        values: ["₱16k", "₱18k", "₱20k", "₱23k", "₱25k", "₱28k", "₱30k"],
      },
      {
        name: "LED Headlight",
        color: "#b37af7",
        points: [
          [25, 154],
          [100, 150],
          [175, 146],
          [250, 142],
          [325, 138],
          [400, 134],
          [475, 128],
        ],
        values: ["₱10k", "₱11k", "₱13k", "₱14k", "₱16k", "₱18k", "₱20k"],
      },
    ],
  },
  Quarterly: {
    days: ["Q1", "Q2", "Q3", "Q4"],
    series: [
      {
        name: "Helmet Pad",
        color: "#ff6584",
        points: [
          [40, 56],
          [180, 46],
          [320, 36],
          [460, 26],
        ],
        values: ["₱130k", "₱152k", "₱175k", "₱198k"],
      },
      {
        name: "Brakes",
        color: "#48d597",
        points: [
          [40, 92],
          [180, 82],
          [320, 74],
          [460, 64],
        ],
        values: ["₱82k", "₱98k", "₱115k", "₱132k"],
      },
      {
        name: "Lube Oil",
        color: "#eab308",
        points: [
          [40, 124],
          [180, 115],
          [320, 106],
          [460, 96],
        ],
        values: ["₱52k", "₱64k", "₱78k", "₱92k"],
      },
      {
        name: "LED Headlight",
        color: "#b37af7",
        points: [
          [40, 154],
          [180, 145],
          [320, 136],
          [460, 126],
        ],
        values: ["₱32k", "₱42k", "₱52k", "₱64k"],
      },
    ],
  },
  Annually: {
    days: ["2022", "2023", "2024", "2025"],
    series: [
      {
        name: "Helmet Pad",
        color: "#ff6584",
        points: [
          [40, 60],
          [180, 48],
          [320, 36],
          [460, 24],
        ],
        values: ["₱480k", "₱580k", "₱690k", "₱810k"],
      },
      {
        name: "Brakes",
        color: "#48d597",
        points: [
          [40, 96],
          [180, 84],
          [320, 72],
          [460, 60],
        ],
        values: ["₱310k", "₱390k", "₱470k", "₱560k"],
      },
      {
        name: "Lube Oil",
        color: "#eab308",
        points: [
          [40, 128],
          [180, 116],
          [320, 104],
          [460, 92],
        ],
        values: ["₱200k", "₱260k", "₱320k", "₱390k"],
      },
      {
        name: "LED Headlight",
        color: "#b37af7",
        points: [
          [40, 156],
          [180, 144],
          [320, 132],
          [460, 120],
        ],
        values: ["₱120k", "₱160k", "₱210k", "₱270k"],
      },
    ],
  },
};

const initialTransactions = [
  {
    id: "#TRX-001",
    date: "Aug 25, 10:35 AM",
    cashier: "Jane",
    items: 5,
    amount: "₱1,500",
    paymentMethod: "Cash",
    status: "Completed",
  },
  {
    id: "#TRX-002",
    date: "Aug 23, 10:35 AM",
    cashier: "Jane",
    items: 2,
    amount: "₱2,500",
    paymentMethod: "GCash",
    status: "Voided",
  },
  {
    id: "#TRX-003",
    date: "Aug 21, 10:35 AM",
    cashier: "Jane",
    items: 1,
    amount: "₱3,500",
    paymentMethod: "Cash",
    status: "Refunded",
  },
];

function Dashboard({ onLogout, onNavigate }) {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [barPeriod, setBarPeriod] = useState("Weekly");
  const [linePeriod, setLinePeriod] = useState("Weekly");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [profileName, setProfileName] = useState("Admin");
  const [activeBarHover, setActiveBarHover] = useState(null);
  const [activeLinePoint, setActiveLinePoint] = useState(null);

  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTransactions = initialTransactions.filter((trx) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      trx.id.toLowerCase().includes(q) ||
      trx.cashier.toLowerCase().includes(q) ||
      trx.paymentMethod.toLowerCase().includes(q) ||
      trx.status.toLowerCase().includes(q) ||
      trx.amount.toLowerCase().includes(q) ||
      trx.date.toLowerCase().includes(q)
    );
  });

  function handleSaveProfile(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updated = String(formData.get("name") || "").trim();
    if (updated) setProfileName(updated);
    setModal(null);
  }

  function handleRowClick(trx) {
    setSelectedTransaction(trx);
    setModal("transaction-detail");
  }

  return (
    <div className="rch-dashboard-root">
      {/* Sidebar navigation */}
      <aside className={`rch-sidebar ${isSidebarOpen ? "is-open" : ""}`}>
        <div className="rch-sidebar-inner">
          {/* Brand Logo Header */}
          <div className="rch-brand">
            <div className="rch-brand-badge" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <span className="rch-brand-title">Riderscityhub.ph</span>
            <button
              className="rch-sidebar-close"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
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
                  onClick={() => {
                    setActiveNav(item.id);
                    setIsSidebarOpen(false);
                    if (item.id === "Inventory" && onNavigate) {
                      onNavigate("Inventory");
                    }
                    if (item.id === "Products" && onNavigate) {
                      onNavigate("Products");
                    }
                    if (item.id === "User Management" && onNavigate) {
                      onNavigate("User Management");
                    }
                    if (item.id === "Supplier Module" && onNavigate) {
                      onNavigate("Supplier Module");
                    }
                    if (item.id === "Settings" && onNavigate) {
                      onNavigate("Settings");
                    }
                  }}
                >
                  <span className="rch-nav-icon">
                    <Icon size={19} strokeWidth={2.2} />
                  </span>
                  <span className="rch-nav-text">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Bottom: Logout */}
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

      {/* Backdrop for mobile drawer */}
      {isSidebarOpen && (
        <div
          className="rch-mobile-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <div className="rch-main-container">
        <div className="rch-canvas">
          {/* Top Header Card */}
          <header className="rch-header-card">
            <div className="rch-header-left">
              <button
                className="rch-hamburger"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Toggle navigation"
              >
                <Menu size={22} />
              </button>
              <div>
                <h1 className="rch-welcome-title">
                  {activeNav === "Dashboard"
                    ? "Welcome Back Admin"
                    : activeNav}
                </h1>
                <p className="rch-welcome-subtitle">
                  {activeNav === "Dashboard"
                    ? "Monitor sales, stock, and transactions."
                    : `Manage your ${activeNav.toLowerCase()} records and configurations.`}
                </p>
              </div>
            </div>

            <div className="rch-header-right">
              {/* Search Bar */}
              <div className="rch-search-box">
                <Search size={16} className="rch-search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search"
                />
              </div>

              {/* Profile Avatar Menu */}
              <div className="rch-profile-anchor" ref={profileRef}>
                <button
                  className="rch-avatar-btn"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  aria-label="Admin profile"
                  title="Profile options"
                >
                  <span>{profileName ? profileName.charAt(0).toUpperCase() : "A"}</span>
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
                        setModal("view-profile");
                      }}
                    >
                      <User size={15} />
                      <span>View Profile</span>
                    </button>
                    <button
                      className="rch-dropdown-item"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setModal("edit-profile");
                      }}
                    >
                      <Edit2 size={15} />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      className="rch-dropdown-item rch-dropdown-logout"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                    >
                      <LogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Workspace Switcher */}
          {activeNav === "Dashboard" ? (
            <>
              {/* 4 Colored Stat Cards */}
              <section className="rch-stats-grid" aria-label="Quick statistics">
                {/* Stat 1: Profit */}
                <article className="rch-stat-card rch-stat-orange">
                  <div className="rch-stat-value">₱25,000.00</div>
                  <div className="rch-stat-label">Today&apos;s Profit</div>
                </article>

                {/* Stat 2: Total Items */}
                <article className="rch-stat-card rch-stat-green">
                  <div className="rch-stat-value">1,200</div>
                  <div className="rch-stat-label">Total Items in Stock</div>
                </article>

                {/* Stat 3: Low Stock Alerts */}
                <article className="rch-stat-card rch-stat-teal">
                  <div className="rch-stat-value">124</div>
                  <div className="rch-stat-label">Low Stock Alerts</div>
                </article>

                {/* Stat 4: Transactions */}
                <article className="rch-stat-card rch-stat-purple">
                  <div className="rch-stat-value">231</div>
                  <div className="rch-stat-label">Transactions</div>
                </article>
              </section>

              {/* Charts Row (Bar Chart & Multi-Line Chart) */}
              <section className="rch-charts-grid" aria-label="Sales charts">
                {/* Left Chart: Bar Chart */}
                <article className="rch-chart-card">
                  <div className="rch-chart-header">
                    <div>
                      <h2 className="rch-chart-title">Sales Overview</h2>
                      <p className="rch-chart-subtitle">Review sales overtime</p>
                    </div>
                    {/* Period Tabs */}
                    <div className="rch-pill-toggle" role="tablist">
                      {["Weekly", "Quarterly", "Annually"].map((period) => (
                        <button
                          key={period}
                          role="tab"
                          aria-selected={barPeriod === period}
                          className={`rch-pill-btn ${barPeriod === period ? "active" : ""}`}
                          onClick={() => setBarPeriod(period)}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bar Chart Area */}
                  <div className="rch-bar-chart-body">
                    {/* Y Axis */}
                    <div className="rch-y-axis">
                      <span>₱50k</span>
                      <span>₱30k</span>
                      <span>₱20k</span>
                      <span>₱10k</span>
                      <span>₱0k</span>
                    </div>

                    <div className="rch-bars-column-area">
                      {/* Bars & Gridlines Canvas */}
                      <div className="rch-bars-canvas">
                        <div className="rch-chart-gridlines">
                          <span />
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>

                        <div className="rch-bars-wrapper">
                          {barChartData[barPeriod].map((bar, idx) => (
                            <div
                              key={bar.label + idx}
                              className="rch-bar-col"
                              onMouseEnter={() => setActiveBarHover(bar)}
                              onMouseLeave={() => setActiveBarHover(null)}
                            >
                              <div
                                className="rch-bar-fill"
                                style={{ height: `${bar.height}%` }}
                              />
                            </div>
                          ))}
                        </div>

                        {activeBarHover && (
                          <div className="rch-chart-tooltip">
                            <strong>{activeBarHover.label}</strong>: {activeBarHover.formatted}
                          </div>
                        )}
                      </div>

                      {/* X Axis labels separated underneath */}
                      <div className="rch-bar-x-axis">
                        {barChartData[barPeriod].map((bar, idx) => (
                          <span key={bar.label + idx}>{bar.label}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>

                {/* Right Chart: Multi-Line Trend Chart */}
                <article className="rch-chart-card">
                  <div className="rch-chart-header">
                    <div>
                      <h2 className="rch-chart-title">Sales Overview</h2>
                      <p className="rch-chart-subtitle">Review sales overtime</p>
                    </div>
                    {/* Period Tabs */}
                    <div className="rch-pill-toggle" role="tablist">
                      {["Weekly", "Quarterly", "Annually"].map((period) => (
                        <button
                          key={period}
                          role="tab"
                          aria-selected={linePeriod === period}
                          className={`rch-pill-btn ${linePeriod === period ? "active" : ""}`}
                          onClick={() => setLinePeriod(period)}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multi-Line Chart Body */}
                  <div className="rch-line-chart-body">
                    {/* Y Axis Price Indicator */}
                    <div className="rch-y-axis">
                      <span>₱50k</span>
                      <span>₱30k</span>
                      <span>₱20k</span>
                      <span>₱10k</span>
                      <span>₱0k</span>
                    </div>

                    <div className="rch-line-column-area">
                      <div className="rch-svg-container">
                        {/* Gridlines in SVG */}
                        <svg
                          className="rch-line-svg"
                          viewBox="0 0 500 170"
                          preserveAspectRatio="none"
                        >
                          {/* Horizontal guides */}
                          <line x1="0" y1="10" x2="500" y2="10" stroke="#f0f2f5" strokeWidth="1" />
                          <line x1="0" y1="48" x2="500" y2="48" stroke="#f0f2f5" strokeWidth="1" />
                          <line x1="0" y1="86" x2="500" y2="86" stroke="#f0f2f5" strokeWidth="1" />
                          <line x1="0" y1="124" x2="500" y2="124" stroke="#f0f2f5" strokeWidth="1" />
                          <line x1="0" y1="162" x2="500" y2="162" stroke="#f0f2f5" strokeWidth="1" />

                          {/* Render each series */}
                        {lineChartData[linePeriod].series.map((series) => {
                          const pointsString = series.points
                            .map((p) => `${p[0]},${p[1]}`)
                            .join(" ");
                          return (
                            <g key={series.name}>
                              <polyline
                                fill="none"
                                stroke={series.color}
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={pointsString}
                              />
                              {/* Milestone dots */}
                              {series.points.map((p, pIdx) => (
                                <circle
                                  key={`dot-${pIdx}`}
                                  cx={p[0]}
                                  cy={p[1]}
                                  r="2.8"
                                  fill={series.color}
                                />
                              ))}
                              {/* Hit areas for tooltips */}
                              {series.points.map((p, pIdx) => (
                                <circle
                                  key={`hit-${pIdx}`}
                                  cx={p[0]}
                                  cy={p[1]}
                                  r="11"
                                  fill="transparent"
                                  style={{ cursor: "pointer" }}
                                  onMouseEnter={() =>
                                    setActiveLinePoint({
                                      name: series.name,
                                      val: series.values[pIdx],
                                      color: series.color,
                                    })
                                  }
                                  onMouseLeave={() => setActiveLinePoint(null)}
                                />
                              ))}
                            </g>
                          );
                        })}
                      </svg>

                      {/* Tooltip for Line Chart */}
                      {activeLinePoint && (
                        <div
                          className="rch-chart-tooltip"
                          style={{ borderColor: activeLinePoint.color }}
                        >
                          <span
                            className="rch-tooltip-dot"
                            style={{ background: activeLinePoint.color }}
                          />
                          <strong>{activeLinePoint.name}</strong>: {activeLinePoint.val}
                        </div>
                      )}
                    </div>

                      {/* X-Axis labels */}
                      <div className="rch-line-x-axis">
                        {lineChartData[linePeriod].days.map((day) => (
                          <span key={day}>{day}</span>
                        ))}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="rch-line-legend">
                      {lineChartData[linePeriod].series.map((s) => (
                        <div key={s.name} className="rch-legend-item">
                          <span
                            className="rch-legend-dot"
                            style={{ backgroundColor: s.color }}
                          />
                          <span className="rch-legend-text">{s.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </section>

              {/* Bottom Card: Recent Transactions Table */}
              <section className="rch-table-card" aria-label="Recent transactions">
                <div className="rch-table-header">
                  <h2 className="rch-table-title">Recent Transactions</h2>
                  {searchQuery && (
                    <span className="rch-search-badge">
                      Filtered: &quot;{searchQuery}&quot; ({filteredTransactions.length} results)
                    </span>
                  )}
                </div>

                <div className="rch-table-responsive">
                  <table className="rch-table">
                    <thead>
                      <tr>
                        <th>Transaction No.</th>
                        <th>Date &amp; Time</th>
                        <th>Cashier</th>
                        <th>Items</th>
                        <th>Total Amount</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((trx) => (
                          <tr
                            key={trx.id}
                            onClick={() => handleRowClick(trx)}
                            className="rch-table-row-clickable"
                            title="Click to view details"
                          >
                            <td className="rch-td-id">{trx.id}</td>
                            <td>{trx.date}</td>
                            <td>{trx.cashier}</td>
                            <td>{trx.items}</td>
                            <td className="rch-td-amount">{trx.amount}</td>
                            <td>{trx.paymentMethod}</td>
                            <td>
                              <span
                                className={`rch-status-pill ${trx.status.toLowerCase()}`}
                              >
                                {trx.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="rch-empty-cell">
                            No transactions found matching &quot;{searchQuery}&quot;.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : (
            /* Subpage view when user clicks another sidebar navigation item */
            <section className="rch-placeholder-view">
              <div className="rch-placeholder-card">
                <div className="rch-placeholder-icon">
                  <Package size={34} />
                </div>
                <h2>{activeNav} Module</h2>
                <p>
                  You are currently viewing the {activeNav.toLowerCase()} workspace.
                  All records, inventory management, and settings for this section are ready to connect.
                </p>
                <div className="rch-placeholder-actions">
                  <button
                    className="rch-btn-primary"
                    onClick={() => setActiveNav("Dashboard")}
                  >
                    Back to Dashboard
                  </button>
                  <button
                    className="rch-btn-secondary"
                    onClick={() => setModal("new-record")}
                  >
                    + Add New Item
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Interactive Modals */}
      {modal === "view-profile" && (
        <div className="rch-modal-backdrop" onClick={() => setModal(null)}>
          <div className="rch-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="rch-modal-header">
              <h2>Administrator Profile</h2>
              <button className="rch-modal-close" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="rch-modal-body">
              <div className="rch-modal-avatar">
                <span>{profileName.charAt(0).toUpperCase()}</span>
              </div>
              <h3>{profileName}</h3>
              <p className="rch-modal-sub">Riders City Hub System Administrator</p>
              <div className="rch-modal-info-list">
                <div>
                  <span>Email:</span>
                  <strong>admin@riderscityhub.ph</strong>
                </div>
                <div>
                  <span>Store Branch:</span>
                  <strong>Main Hub (Manila)</strong>
                </div>
                <div>
                  <span>Role:</span>
                  <strong>Super Administrator</strong>
                </div>
                <div>
                  <span>Status:</span>
                  <strong style={{ color: "#289e40" }}>Active</strong>
                </div>
              </div>
            </div>
            <div className="rch-modal-footer">
              <button className="rch-btn-primary" onClick={() => setModal("edit-profile")}>
                Edit Profile
              </button>
              <button className="rch-btn-secondary" onClick={() => setModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "edit-profile" && (
        <div className="rch-modal-backdrop" onClick={() => setModal(null)}>
          <div className="rch-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="rch-modal-header">
              <h2>Edit Administrator Profile</h2>
              <button className="rch-modal-close" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveProfile}>
              <div className="rch-modal-body">
                <label className="rch-form-label">Full Name</label>
                <input
                  name="name"
                  className="rch-form-input"
                  defaultValue={profileName}
                  required
                />
                <label className="rch-form-label">Email Address</label>
                <input
                  type="email"
                  className="rch-form-input"
                  defaultValue="admin@riderscityhub.ph"
                  required
                />
              </div>
              <div className="rch-modal-footer">
                <button type="submit" className="rch-btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="rch-btn-secondary"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "transaction-detail" && selectedTransaction && (
        <div className="rch-modal-backdrop" onClick={() => setModal(null)}>
          <div className="rch-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="rch-modal-header">
              <h2>Transaction Details</h2>
              <button className="rch-modal-close" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="rch-modal-body">
              <div className="rch-trx-modal-top">
                <span className="rch-trx-tag">{selectedTransaction.id}</span>
                <span
                  className={`rch-status-pill ${selectedTransaction.status.toLowerCase()}`}
                >
                  {selectedTransaction.status}
                </span>
              </div>
              <div className="rch-modal-info-list">
                <div>
                  <span>Date &amp; Time:</span>
                  <strong>{selectedTransaction.date}</strong>
                </div>
                <div>
                  <span>Cashier in Charge:</span>
                  <strong>{selectedTransaction.cashier}</strong>
                </div>
                <div>
                  <span>Item Count:</span>
                  <strong>{selectedTransaction.items} items</strong>
                </div>
                <div>
                  <span>Payment Method:</span>
                  <strong>{selectedTransaction.paymentMethod}</strong>
                </div>
                <div>
                  <span>Total Amount:</span>
                  <strong className="rch-trx-highlight">{selectedTransaction.amount}</strong>
                </div>
              </div>
            </div>
            <div className="rch-modal-footer">
              <button className="rch-btn-primary" onClick={() => setModal(null)}>
                <Check size={16} style={{ marginRight: 6 }} /> Done
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "new-record" && (
        <div className="rch-modal-backdrop" onClick={() => setModal(null)}>
          <div className="rch-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="rch-modal-header">
              <h2>Add New Record</h2>
              <button className="rch-modal-close" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="rch-modal-body">
              <p>Ready to add new {activeNav.toLowerCase()} data to your store database.</p>
              <label className="rch-form-label">Item / Record Name</label>
              <input className="rch-form-input" placeholder="e.g. Full Face Helmet" />
            </div>
            <div className="rch-modal-footer">
              <button className="rch-btn-primary" onClick={() => setModal(null)}>
                Save Item
              </button>
              <button className="rch-btn-secondary" onClick={() => setModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Dashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
};

export default Dashboard;

