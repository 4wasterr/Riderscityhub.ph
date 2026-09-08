import { useState } from "react";
/* eslint-disable react/prop-types */
import {
	ChevronDown,
	CircleUserRound,
	ClipboardList,
	Grid2X2,
	LogOut,
	Package,
	Search,
	Settings,
	ShoppingCart,
	SlidersHorizontal,
	Store,
	UserRound,
	Users,
	X,
} from "lucide-react";
import "./dashboard.css";

const navigationItems = [
	{ label: "Dashboard", icon: Grid2X2 },
	{ label: "Inventory", icon: ClipboardList },
	{ label: "Products", icon: ShoppingCart },
	{ label: "User Management", icon: Users },
	{ label: "Supplier Module", icon: Store },
	{ label: "Settings", icon: Settings },
];

const transactions = [
	{ id: "#TRX-001", date: "Aug 25, 10:35 AM", cashier: "Jane", items: 5, amount: "₱1,500", method: "Cash", status: "Completed" },
	{ id: "#TRX-002", date: "Aug 23, 10:35 AM", cashier: "Jane", items: 2, amount: "₱2,500", method: "GCash", status: "Voided" },
	{ id: "#TRX-003", date: "Aug 21, 10:35 AM", cashier: "Jane", items: 1, amount: "₱3,500", method: "Cash", status: "Refunded" },
];

function Dashboard({ onLogout }) {
	const [activeItem, setActiveItem] = useState("Dashboard");
	const [chartRange, setChartRange] = useState("Weekly");
	const [search, setSearch] = useState("");
	const [profileOpen, setProfileOpen] = useState(false);
	const [profilePanel, setProfilePanel] = useState("");
	const [notice, setNotice] = useState("");

	const filteredTransactions = transactions.filter((transaction) =>
		Object.values(transaction).some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
	);

	function showNotice(message) {
		setNotice(message);
		window.setTimeout(() => setNotice(""), 2200);
	}

	function handleNavigation(label) {
		setActiveItem(label);
		if (label !== "Dashboard") showNotice(`${label} is ready to open.`);
	}

	return (
		<main className="dashboard-page" onClick={() => profileOpen && setProfileOpen(false)}>
			<aside className="dashboard-sidebar" aria-label="Main navigation">
				<div className="brand-mark"><Package size={17} strokeWidth={2.5} /></div>
				<span className="brand-name">Riderscityhub.ph</span>

				<nav className="dashboard-nav">
					{navigationItems.map(({ label, icon: Icon }) => (
						<button
							className={`dashboard-nav-item ${activeItem === label ? "active" : ""}`}
							key={label}
							type="button"
							onClick={() => handleNavigation(label)}
						>
							<Icon size={18} />
							<span>{label}</span>
						</button>
					))}
				</nav>

				<button className="logout-button" type="button" onClick={onLogout}>
					<LogOut size={17} />
					<span>Logout</span>
				</button>
			</aside>

			<section className="dashboard-content">
				<header className="dashboard-header">
					<div>
						<h1>Welcome Back Admin</h1>
						<p>Monitor sales, stock, and transactions.</p>
					</div>
					<div className="header-actions">
						<label className="dashboard-search">
							<Search size={17} />
							<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" aria-label="Search dashboard" />
							{search ? <button type="button" aria-label="Clear search" onClick={() => setSearch("")}><X size={14} /></button> : null}
						</label>
						<div className="profile-menu-wrap" onClick={(event) => event.stopPropagation()}>
							<button className="profile-trigger" type="button" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen}>
								<span>A</span><ChevronDown size={14} />
							</button>
							{profileOpen ? (
								<div className="profile-menu">
									<div className="profile-menu-heading"><CircleUserRound size={18} /><span><strong>Admin</strong><small>admin@riderscityhub.ph</small></span></div>
									<button type="button" onClick={() => { setProfilePanel("View Profile"); setProfileOpen(false); }}><UserRound size={16} />View Profile</button>
									<button type="button" onClick={() => { setProfilePanel("Edit Profile"); setProfileOpen(false); }}><SlidersHorizontal size={16} />Edit Profile</button>
								</div>
							) : null}
						</div>
					</div>
				</header>

				<section className="metric-grid" aria-label="Business summary">
					<button type="button" className="metric-card orange" onClick={() => showNotice("Today's profit details opened.")}><strong>₱25,000.00</strong><span>Today&apos;s Profit</span></button>
					<button type="button" className="metric-card green" onClick={() => showNotice("Inventory overview opened.")}><strong>1,200</strong><span>Total Items in Stock</span></button>
					<button type="button" className="metric-card teal" onClick={() => handleNavigation("Inventory")}><strong>124</strong><span>Low Stock Alerts</span></button>
					<button type="button" className="metric-card purple" onClick={() => showNotice("Transaction history opened.")}><strong>231</strong><span>Transactions</span></button>
				</section>

				<section className="charts-grid">
					<article className="panel chart-panel">
						<div className="panel-heading"><div><h2>Sales Overview</h2><p>Review sales overtime</p></div><ChartRange value={chartRange} onChange={setChartRange} /></div>
						<div className="bar-chart" aria-label={`${chartRange} sales bar chart`}>
							{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => <div className="bar-column" key={day}><div className="bar" style={{ height: `${[46, 68, 52, 84, 60, 70, 88][index]}%` }} /><span>{day}</span></div>)}
						</div>
					</article>
					<article className="panel chart-panel line-panel">
						<div className="panel-heading"><div><h2>Sales Overview</h2><p>Review sales overtime</p></div><ChartRange value={chartRange} onChange={setChartRange} /></div>
						<div className="line-chart" aria-label={`${chartRange} sales line chart`}><span className="line red" /><span className="line mint" /><span className="line yellow" /><span className="line purple-line" /><div className="line-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div>
					</article>
				</section>

				<section className="panel transactions-panel">
					<div className="panel-heading"><div><h2>Recent Transactions</h2></div><button type="button" className="view-all-button" onClick={() => showNotice("Showing all transactions.")}>View all</button></div>
					<div className="transaction-table-wrap"><table><thead><tr><th>Transaction No.</th><th>Date &amp; Time</th><th>Cashier</th><th>Items</th><th>Total Amount</th><th>Payment Method</th><th>Status</th></tr></thead><tbody>{filteredTransactions.length ? filteredTransactions.map((transaction) => <tr key={transaction.id}><td>{transaction.id}</td><td>{transaction.date}</td><td>{transaction.cashier}</td><td>{transaction.items}</td><td>{transaction.amount}</td><td>{transaction.method}</td><td><button type="button" className={`status ${transaction.status.toLowerCase()}`} onClick={() => showNotice(`${transaction.id} is ${transaction.status.toLowerCase()}.`)}>{transaction.status}</button></td></tr>) : <tr><td className="empty-state" colSpan="7">No transactions match your search.</td></tr>}</tbody></table></div>
				</section>
			</section>

			{profilePanel ? <div className="profile-modal-backdrop" role="presentation" onClick={() => setProfilePanel("")}><section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setProfilePanel("")} aria-label="Close"><X size={18} /></button><CircleUserRound size={38} /><h2 id="profile-modal-title">{profilePanel}</h2><p>{profilePanel === "View Profile" ? "Review the administrator account details here." : "Profile editing controls will be available here."}</p><button type="button" className="modal-action" onClick={() => setProfilePanel("")}>Done</button></section></div> : null}
			{notice ? <div className="dashboard-notice" role="status">{notice}</div> : null}
		</main>
	);
}

function ChartRange({ value, onChange }) {
	return <div className="chart-range" role="group" aria-label="Chart range">{["Weekly", "Quarterly", "Annually"].map((range) => <button key={range} type="button" className={value === range ? "selected" : ""} onClick={() => onChange(range)}>{range}</button>)}</div>;
}

export default Dashboard;
