import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Home,
  LogOut,
  Menu,
  Receipt,
  Search,
  Send,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import "./cashierSideDashboard.css";

const cashierNavItems = [
  { id: "Dashboard", label: "Dashboard", icon: Home },
  { id: "POS / New Sale", label: "POS / New Sale", icon: ShoppingBag },
  { id: "Reports", label: "Reports", icon: Receipt },
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

function CashierSideDashboard({ onLogout, onNavigate }) {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [barPeriod, setBarPeriod] = useState("Weekly");
  const [linePeriod, setLinePeriod] = useState("Weekly");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeBarHover, setActiveBarHover] = useState(null);
  const [activeLinePoint, setActiveLinePoint] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [reportNote, setReportNote] = useState("");

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

  function triggerToast(msg) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  }

  function handleNavClick(item) {
    setActiveNav(item.id);
    setIsSidebarOpen(false);
    if (item.id === "POS / New Sale") {
      triggerToast("Opening POS / New Sale Terminal...");
    } else if (item.id === "Reports") {
      triggerToast("Opening Cashier Daily Sales Report...");
    }
    if (onNavigate) {
      onNavigate(item.id);
    }
  }

  function handleSendReportSubmit(e) {
    e.preventDefault();
    setModal(null);
    setReportNote("");
    triggerToast("Daily Sales Report sent to Admin successfully!");
  }

  const filteredTransactions = initialTransactions.filter((trx) => {
    const q = searchQuery.toLowerCase();
    return (
      trx.id.toLowerCase().includes(q) ||
      trx.cashier.toLowerCase().includes(q) ||
      trx.paymentMethod.toLowerCase().includes(q) ||
      trx.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="rch-cs-root">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="rch-cs-toast">
          <span className="rch-cs-toast-icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`rch-cs-sidebar ${isSidebarOpen ? "is-open" : ""}`} aria-label="Sidebar">
        <div className="rch-cs-sidebar-inner">
          <div className="rch-cs-brand">
            <div className="rch-cs-brand-badge" aria-hidden="true">
              <ShoppingBag size={18} strokeWidth={2.4} />
            </div>
            <span className="rch-cs-brand-title">Riderscityhub.ph</span>
            <button
              className="rch-cs-sidebar-close"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cashier Nav Menu: Dashboard, POS / New Sale, Reports */}
          <nav className="rch-cs-nav" aria-label="Cashier Navigation">
            {cashierNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  className={`rch-cs-nav-button ${isActive ? "active" : ""}`}
                  onClick={() => handleNavClick(item)}
                >
                  <span className="rch-cs-nav-icon">
                    <Icon size={19} strokeWidth={2.2} />
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="rch-cs-sidebar-footer">
            <button className="rch-cs-logout-button" onClick={onLogout}>
              <span className="rch-cs-nav-icon">
                <LogOut size={19} strokeWidth={2.2} />
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="rch-cs-main-container">
        <div className="rch-cs-canvas">
          {/* Header Card (media_1789051095370.png) */}
          <header className="rch-cs-header-card">
            <div className="rch-cs-header-left">
              <button
                className="rch-cs-hamburger"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Toggle navigation"
              >
                <Menu size={22} />
              </button>
              <div>
                <h1 className="rch-cs-welcome-title">Welcome Back Cashier</h1>
                <p className="rch-cs-welcome-subtitle">
                  Monitor sales, stock, and transactions.
                </p>
              </div>
            </div>

            <div className="rch-cs-header-right">
              {/* Search Bar */}
              <div className="rch-cs-search-box">
                <Search size={16} className="rch-cs-search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search"
                />
              </div>

              {/* Cashier Profile Avatar: "C" green circle */}
              <div className="rch-cs-profile-anchor" ref={profileRef}>
                <button
                  className="rch-cs-avatar-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="Cashier Profile"
                  title="Cashier Profile"
                >
                  <span>C</span>
                </button>

                {isProfileOpen && (
                  <div className="rch-cs-profile-dropdown" role="menu">
                    <div className="rch-cs-profile-dropdown-header">
                      <strong>Cashier</strong>
                      <small>cashier@riderscityhub.ph</small>
                    </div>
                    <button
                      className="rch-cs-dropdown-item"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setModal("view-profile");
                      }}
                    >
                      <User size={15} />
                      <span>View Profile</span>
                    </button>
                    <button
                      className="rch-cs-dropdown-item rch-cs-dropdown-logout"
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

          {/* Top 4 Stat Cards */}
          <section className="rch-cs-stats-grid" aria-label="Cashier summary statistics">
            <article
              className="rch-cs-stat-card rch-cs-stat-orange"
              onClick={() => triggerToast("Today's Profit: ₱25,000.00")}
            >
              <div className="rch-cs-stat-value">₱25,000.00</div>
              <div className="rch-cs-stat-label">Today&apos;s Profit</div>
            </article>

            <article
              className="rch-cs-stat-card rch-cs-stat-green"
              onClick={() => triggerToast("Total Items in Stock: 1,200")}
            >
              <div className="rch-cs-stat-value">1,200</div>
              <div className="rch-cs-stat-label">Total Items in Stock</div>
            </article>

            <article
              className="rch-cs-stat-card rch-cs-stat-teal"
              onClick={() => triggerToast("Low Stock Alerts: 124 items require attention")}
            >
              <div className="rch-cs-stat-value">124</div>
              <div className="rch-cs-stat-label">Low Stock Alerts</div>
            </article>

            <article
              className="rch-cs-stat-card rch-cs-stat-purple"
              onClick={() => triggerToast("Transactions completed today: 231")}
            >
              <div className="rch-cs-stat-value">231</div>
              <div className="rch-cs-stat-label">Transactions</div>
            </article>
          </section>

          {/* Charts Row */}
          <section className="rch-cs-charts-grid" aria-label="Sales charts">
            {/* Bar Chart */}
            <article className="rch-cs-chart-card">
              <div className="rch-cs-chart-header">
                <div>
                  <h2 className="rch-cs-chart-title">Sales Overview</h2>
                  <p className="rch-cs-chart-subtitle">Review sales overtime</p>
                </div>
                <div className="rch-cs-pill-toggle" role="tablist">
                  {["Weekly", "Quarterly", "Annually"].map((period) => (
                    <button
                      key={period}
                      role="tab"
                      aria-selected={barPeriod === period}
                      className={`rch-cs-pill-btn ${barPeriod === period ? "active" : ""}`}
                      onClick={() => setBarPeriod(period)}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rch-cs-bar-chart-body">
                <div className="rch-cs-y-axis">
                  <span>₱50k</span>
                  <span>₱30k</span>
                  <span>₱20k</span>
                  <span>₱10k</span>
                  <span>₱0k</span>
                </div>

                <div className="rch-cs-bars-column-area">
                  <div className="rch-cs-bars-canvas">
                    <div className="rch-cs-chart-gridlines">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="rch-cs-bars-wrapper">
                      {barChartData[barPeriod].map((bar, idx) => (
                        <div
                          key={bar.label + idx}
                          className="rch-cs-bar-col"
                          onMouseEnter={() => setActiveBarHover(bar)}
                          onMouseLeave={() => setActiveBarHover(null)}
                        >
                          <div
                            className="rch-cs-bar-fill"
                            style={{ height: `${bar.height}%` }}
                          />
                        </div>
                      ))}
                    </div>

                    {activeBarHover && (
                      <div className="rch-cs-chart-tooltip">
                        <strong>{activeBarHover.label}</strong>: {activeBarHover.formatted}
                      </div>
                    )}
                  </div>

                  <div className="rch-cs-bar-x-axis">
                    {barChartData[barPeriod].map((bar, idx) => (
                      <span key={bar.label + idx}>{bar.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* Line Chart */}
            <article className="rch-cs-chart-card">
              <div className="rch-cs-chart-header">
                <div>
                  <h2 className="rch-cs-chart-title">Sales Overview</h2>
                  <p className="rch-cs-chart-subtitle">Review sales overtime</p>
                </div>
                <div className="rch-cs-pill-toggle" role="tablist">
                  {["Weekly", "Quarterly", "Annually"].map((period) => (
                    <button
                      key={period}
                      role="tab"
                      aria-selected={linePeriod === period}
                      className={`rch-cs-pill-btn ${linePeriod === period ? "active" : ""}`}
                      onClick={() => setLinePeriod(period)}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rch-cs-line-chart-body">
                <div className="rch-cs-y-axis">
                  <span>₱50k</span>
                  <span>₱30k</span>
                  <span>₱20k</span>
                  <span>₱10k</span>
                  <span>₱0k</span>
                </div>

                <div className="rch-cs-line-column-area">
                  <div className="rch-cs-svg-container">
                    <svg
                      className="rch-cs-line-svg"
                      viewBox="0 0 500 170"
                      preserveAspectRatio="none"
                    >
                      <line x1="0" y1="10" x2="500" y2="10" stroke="#f0f2f5" strokeWidth="1" />
                      <line x1="0" y1="48" x2="500" y2="48" stroke="#f0f2f5" strokeWidth="1" />
                      <line x1="0" y1="86" x2="500" y2="86" stroke="#f0f2f5" strokeWidth="1" />
                      <line x1="0" y1="124" x2="500" y2="124" stroke="#f0f2f5" strokeWidth="1" />
                      <line x1="0" y1="162" x2="500" y2="162" stroke="#f0f2f5" strokeWidth="1" />

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
                            {series.points.map((p, pIdx) => (
                              <circle
                                key={`dot-${pIdx}`}
                                cx={p[0]}
                                cy={p[1]}
                                r="2.8"
                                fill={series.color}
                              />
                            ))}
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

                    {activeLinePoint && (
                      <div
                        className="rch-cs-chart-tooltip"
                        style={{ borderColor: activeLinePoint.color }}
                      >
                        <span
                          className="rch-cs-tooltip-dot"
                          style={{ background: activeLinePoint.color }}
                        />
                        <strong>{activeLinePoint.name}</strong>: {activeLinePoint.val}
                      </div>
                    )}
                  </div>

                  <div className="rch-cs-line-x-axis">
                    {lineChartData[linePeriod].days.map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                </div>

                <div className="rch-cs-line-legend">
                  {lineChartData[linePeriod].series.map((s) => (
                    <div key={s.name} className="rch-cs-legend-item">
                      <span
                        className="rch-cs-legend-dot"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="rch-cs-legend-text">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          {/* Recent Transactions Table Card */}
          <section className="rch-cs-table-card" aria-label="Recent transactions">
            <div className="rch-cs-table-header">
              <h2 className="rch-cs-table-title">Recent Transactions</h2>
            </div>

            <div className="rch-cs-table-responsive">
              <table className="rch-cs-table">
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
                  {filteredTransactions.map((trx) => (
                    <tr
                      key={trx.id}
                      className="rch-cs-row-interactive"
                      onClick={() => setSelectedTransaction(trx)}
                      title="Click to view transaction details"
                    >
                      <td style={{ fontWeight: 700, color: "#111827" }}>{trx.id}</td>
                      <td>{trx.date}</td>
                      <td>{trx.cashier}</td>
                      <td>{trx.items}</td>
                      <td style={{ fontWeight: 700 }}>{trx.amount}</td>
                      <td>{trx.paymentMethod}</td>
                      <td>
                        <span
                          className={`rch-cs-status-badge rch-cs-status-${trx.status.toLowerCase()}`}
                        >
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Send Report Button on Bottom Right */}
            <div className="rch-cs-table-footer">
              <button
                type="button"
                className="rch-cs-send-report-btn"
                onClick={() => setModal("send-report")}
              >
                <Send size={14} />
                <span>Send Report</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="rch-cs-modal-backdrop" onClick={() => setSelectedTransaction(null)}>
          <div className="rch-cs-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rch-cs-modal-header">
              <h2>Transaction Details</h2>
              <button
                className="rch-cs-modal-close"
                onClick={() => setSelectedTransaction(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <p><strong>Transaction ID:</strong> {selectedTransaction.id}</p>
              <p><strong>Date & Time:</strong> {selectedTransaction.date}</p>
              <p><strong>Cashier:</strong> {selectedTransaction.cashier}</p>
              <p><strong>Total Items:</strong> {selectedTransaction.items}</p>
              <p><strong>Total Amount:</strong> {selectedTransaction.amount}</p>
              <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</p>
              <p>
                <strong>Status: </strong>
                <span className={`rch-cs-status-badge rch-cs-status-${selectedTransaction.status.toLowerCase()}`}>
                  {selectedTransaction.status}
                </span>
              </p>
            </div>
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button
                className="rch-cs-send-report-btn"
                onClick={() => setSelectedTransaction(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Report Modal */}
      {modal === "send-report" && (
        <div className="rch-cs-modal-backdrop" onClick={() => setModal(null)}>
          <div className="rch-cs-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rch-cs-modal-header">
              <h2>Send Daily Report to Admin</h2>
              <button
                className="rch-cs-modal-close"
                onClick={() => setModal(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSendReportSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "#374151" }}>
                <p><strong>Shift Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Cashier:</strong> Cashier Jane</p>
                <p><strong>Total Transactions:</strong> 231</p>
                <p><strong>Total Cash Collected:</strong> ₱25,000.00</p>
                <label style={{ fontWeight: 600, marginTop: "6px" }}>Shift Notes or Discrepancies (Optional):</label>
                <textarea
                  style={{
                    width: "100%",
                    minHeight: "80px",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontFamily: "inherit",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                  placeholder="e.g. Register balanced, all cash drawers tallied."
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                />
              </div>
              <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  style={{
                    background: "#f3f4f6",
                    border: "none",
                    borderRadius: "9999px",
                    padding: "10px 20px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rch-cs-send-report-btn"
                >
                  <Send size={14} />
                  <span>Submit Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Cashier Profile Modal */}
      {modal === "view-profile" && (
        <div className="rch-cs-modal-backdrop" onClick={() => setModal(null)}>
          <div className="rch-cs-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rch-cs-modal-header">
              <h2>Cashier Profile</h2>
              <button
                className="rch-cs-modal-close"
                onClick={() => setModal(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <div className="rch-cs-avatar-btn" style={{ width: "48px", height: "48px", fontSize: "18px" }}>
                  C
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", color: "#111827" }}>Cashier Jane</h3>
                  <p style={{ margin: "2px 0 0", color: "#6b7280" }}>cashier@riderscityhub.ph</p>
                </div>
              </div>
              <p><strong>Role:</strong> Cashier</p>
              <p><strong>Branch:</strong> Riders City Hub - Manila Main</p>
              <p><strong>Assigned Shift:</strong> 8:00 AM - 4:00 PM</p>
              <p><strong>Status:</strong> Active</p>
            </div>
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button
                className="rch-cs-send-report-btn"
                onClick={() => setModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

CashierSideDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
};

export default CashierSideDashboard;
