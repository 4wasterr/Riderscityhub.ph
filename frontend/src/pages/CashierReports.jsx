import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Calendar, LogOut, Search, User, X } from "lucide-react";
import "./CashierReports.css";

const defaultTransactions = [
  {
    id: "TRX-123",
    date: "08-25-2026",
    cashier: "CASHIER-001",
    items: "Break Pad + Oil",
    total: "P545.00",
    payment: "Gcash",
    status: "Completed",
  },
  {
    id: "TRX-001",
    date: "08-22-2026",
    cashier: "CASHIER-002",
    items: "Disk Break + Break Oil",
    total: "P720.00",
    payment: "Cash",
    status: "Refunded",
  },
];

function CashierReports({ transactions, onOpenSidebar, onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("08/15/2026");
  const [toDate, setToDate] = useState("08/20/2026");
  const [currentPage, setCurrentPage] = useState(1);

  // Upper Right Avatar Dropdown & Profile Modal State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileAnchorRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileAnchorRef.current && !profileAnchorRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Normalize incoming transactions if passed from dashboard
  const rawList = transactions && transactions.length > 0
    ? transactions.map((t) => ({
        id: t.id.replace("#", ""),
        date: t.date.includes(",") ? t.date.split(",")[0] : t.date,
        cashier: t.cashier.includes("Jane") ? "CASHIER-001" : t.cashier,
        items: t.items ? (typeof t.items === "number" ? `${t.items} Items` : t.items) : "Parts + Lube",
        total: t.amount || t.total || "P500.00",
        payment: t.paymentMethod || t.payment || "Cash",
        status: t.status || "Completed",
      }))
    : defaultTransactions;

  // Filter transactions
  const filteredTransactions = rawList.filter((trx) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      trx.id.toLowerCase().includes(q) ||
      trx.cashier.toLowerCase().includes(q) ||
      trx.items.toLowerCase().includes(q) ||
      trx.payment.toLowerCase().includes(q) ||
      trx.status.toLowerCase().includes(q)
    );
  });

  // Calculate KPIs
  const completedTrx = filteredTransactions.filter((t) => t.status === "Completed");
  const totalSalesVal = completedTrx.reduce((sum, t) => {
    const num = parseFloat(t.total.replace(/[^0-9.]/g, "")) || 0;
    return sum + num;
  }, 0);

  const transactionsCount = filteredTransactions.length;
  const itemsSoldCount = completedTrx.length > 0 ? completedTrx.length : 2;
  const refundedCount = filteredTransactions.filter(
    (t) => t.status.toLowerCase() === "refunded" || t.status.toLowerCase() === "voided"
  ).length;

  // Render empty rows to match mockup table height
  const emptyRowsCount = Math.max(0, 5 - filteredTransactions.length);

  return (
    <div className="rch-rep-container">
      {/* Top Header Card (Matches media_1789738257638.png) */}
      <header className="rch-rep-header-card">
        <div className="rch-rep-header-left">
          <div>
            <h1 className="rch-rep-main-title">Cashier&apos;s Report</h1>
            <p className="rch-rep-subtitle">
              Monitor Sales, Transactions, Item Sold, and Refunded / Voided.
            </p>
          </div>
        </div>

        <div className="rch-rep-header-right">
          <div className="rch-rep-search-wrapper">
            <Search size={15} className="rch-rep-search-icon" />
            <input
              type="text"
              className="rch-rep-search-input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="rch-rep-profile-anchor" ref={profileAnchorRef}>
            <button
              type="button"
              className="rch-rep-avatar-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="Cashier Profile"
              title="Cashier Profile"
            >
              A
            </button>

            {isProfileOpen && (
              <div className="rch-rep-profile-dropdown" role="menu">
                <div className="rch-rep-profile-dropdown-header">
                  <strong>Cashier</strong>
                  <small>cashier@riderscityhub.ph</small>
                </div>
                <button
                  type="button"
                  className="rch-rep-dropdown-item"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                >
                  <User size={15} />
                  <span>View Profile</span>
                </button>
                <button
                  type="button"
                  className="rch-rep-dropdown-item rch-rep-dropdown-logout"
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onLogout) onLogout();
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

      {/* Main Content Card (Date Picker, 4 Analytics Cards & Report Table) */}
      <div className="rch-rep-main-card">

      {/* Date Range Selector */}
      <div className="rch-rep-date-row">
        <div className="rch-rep-date-picker">
          <Calendar size={15} color="#374151" />
          <span>From: [{fromDate}]</span>
        </div>
        <div className="rch-rep-date-picker">
          <Calendar size={15} color="#374151" />
          <span>To: [{toDate}]</span>
        </div>
      </div>

      {/* 4 Colored KPI Stat Cards */}
      <div className="rch-rep-kpi-grid">
        <div className="rch-rep-kpi-card rch-rep-kpi-green">
          <span className="rch-rep-kpi-value">
            ₱{totalSalesVal > 0 ? totalSalesVal.toFixed(2) : "545.00"}
          </span>
          <span className="rch-rep-kpi-label">Total Sales</span>
        </div>

        <div className="rch-rep-kpi-card rch-rep-kpi-coral">
          <span className="rch-rep-kpi-value">{transactionsCount || 2}</span>
          <span className="rch-rep-kpi-label">Transactions</span>
        </div>

        <div className="rch-rep-kpi-card rch-rep-kpi-blue">
          <span className="rch-rep-kpi-value">{itemsSoldCount}</span>
          <span className="rch-rep-kpi-label">Item Sold</span>
        </div>

        <div className="rch-rep-kpi-card rch-rep-kpi-orange">
          <span className="rch-rep-kpi-value">{refundedCount || 1}</span>
          <span className="rch-rep-kpi-label">Refunded/Sold</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rch-rep-table-wrapper">
        <table className="rch-rep-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Cashier</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((trx) => {
              const statusClass =
                trx.status.toLowerCase() === "completed"
                  ? "rch-rep-status-completed"
                  : trx.status.toLowerCase() === "refunded"
                  ? "rch-rep-status-refunded"
                  : "rch-rep-status-voided";

              return (
                <tr key={trx.id}>
                  <td>{trx.id}</td>
                  <td>{trx.date}</td>
                  <td>{trx.cashier}</td>
                  <td>{trx.items}</td>
                  <td>{trx.total}</td>
                  <td>{trx.payment}</td>
                  <td>
                    <span className={`rch-rep-status-badge ${statusClass}`}>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Empty placeholder rows matching mockup lines */}
            {Array.from({ length: emptyRowsCount }).map((_, idx) => (
              <tr key={`empty-${idx}`} className="empty-row">
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="rch-rep-footer">
        <div className="rch-rep-pagination">
          <button
            type="button"
            className="rch-rep-page-arrow"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            &lt;
          </button>
          <div className="rch-rep-page-num">{currentPage}</div>
          <button
            type="button"
            className="rch-rep-page-arrow"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            &gt;
          </button>
        </div>
      </div>
      </div>

      {/* Cashier Jane Profile Modal */}
      {isProfileModalOpen && (
        <div className="rch-pos-modal-backdrop" onClick={() => setIsProfileModalOpen(false)}>
          <div className="rch-pos-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rch-pos-modal-header">
              <h2>Cashier Profile</h2>
              <button
                type="button"
                className="rch-pos-modal-close"
                onClick={() => setIsProfileModalOpen(false)}
                aria-label="Close profile modal"
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <div className="rch-rep-avatar-btn" style={{ width: "48px", height: "48px", fontSize: "18px" }}>
                  A
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
                type="button"
                className="rch-pos-pay-btn"
                style={{ width: "auto", padding: "8px 22px", margin: 0 }}
                onClick={() => setIsProfileModalOpen(false)}
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

CashierReports.propTypes = {
  transactions: PropTypes.array,
  onOpenSidebar: PropTypes.func,
  onLogout: PropTypes.func,
};

export default CashierReports;
