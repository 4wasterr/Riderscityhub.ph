import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  CheckCircle2,
  LogOut,
  Printer,
  Search,
  User,
  Wrench,
  X,
} from "lucide-react";
import "./CashierPOS.css";

const vehiclePresets = [
  { name: "Honda PCX 160 / 150", brand: "Honda", plate: "ABC123" },
  { name: "Honda Click 125 / 160", brand: "Honda", plate: "CLK456" },
  { name: "Yamaha NMAX 155", brand: "Yamaha", plate: "NMX789" },
  { name: "Yamaha Aerox 155", brand: "Yamaha", plate: "ARX321" },
  { name: "Kawasaki Ninja 400", brand: "Kawasaki", plate: "NNJ654" },
  { name: "Suzuki Raider 150", brand: "Suzuki", plate: "RDR987" },
];

const servicePresets = [
  { name: "Change Oil & Filter Labor", fee: 150, brand: "Universal" },
  { name: "Brake Pad Installation Labor", fee: 200, brand: "Universal" },
  { name: "Full CVT Cleaning & Tuning", fee: 350, brand: "Universal" },
  { name: "Headlight & Wiring Repair", fee: 120, brand: "Universal" },
  { name: "Tire Mounting & Wheel Balancing", fee: 180, brand: "Universal" },
  { name: "Periodic Maintenance Service (PMS)", fee: 650, brand: "Universal" },
  { name: "Chain Cleaning & Precision Lube", fee: 150, brand: "Universal" },
  { name: "FI Throttle Body Flush", fee: 280, brand: "Universal" },
  { name: "Front Fork Shock Re-oil & Seal", fee: 400, brand: "Universal" },
];

const initialCatalog = [
  // Yamaha specific parts
  { id: "PROD-001", sku: "YMH-001", name: "Headlight", type: "Yamaha", category: "Headlight", itemType: "product", compatibleBrands: ["Yamaha"], price: 250, stock: 24 },
  { id: "PROD-002", sku: "YMH-002", name: "Headlight Pro LED", type: "Yamaha", category: "Headlight", itemType: "product", compatibleBrands: ["Yamaha"], price: 350, stock: 18 },
  { id: "PROD-003", sku: "YMH-003", name: "Engine Oil Yamalube 1L", type: "Yamaha", category: "Engine Oil", itemType: "product", compatibleBrands: ["Yamaha"], price: 250, stock: 40 },
  { id: "PROD-004", sku: "YMH-004", name: "Brake Pad Front (NMAX/Aerox)", type: "Yamaha", category: "Brakes", itemType: "product", compatibleBrands: ["Yamaha"], price: 280, stock: 30 },
  { id: "PROD-005", sku: "YMH-005", name: "CVT Drive Belt", type: "Yamaha", category: "Parts", itemType: "product", compatibleBrands: ["Yamaha"], price: 650, stock: 15 },
  { id: "PROD-006", sku: "YMH-006", name: "Rear Shock Absorber", type: "Yamaha", category: "Parts", itemType: "product", compatibleBrands: ["Yamaha"], price: 1200, stock: 10 },
  { id: "PROD-007", sku: "YMH-007", name: "Headlight Mask / Fairing", type: "Yamaha", category: "Headlight", itemType: "product", compatibleBrands: ["Yamaha"], price: 420, stock: 12 },
  { id: "PROD-008", sku: "YMH-008", name: "Air Filter Element", type: "Yamaha", category: "Parts", itemType: "product", compatibleBrands: ["Yamaha"], price: 220, stock: 25 },
  { id: "PROD-009", sku: "YMH-009", name: "Clutch Bell & Lining", type: "Yamaha", category: "Parts", itemType: "product", compatibleBrands: ["Yamaha"], price: 850, stock: 16 },

  // Honda specific parts
  { id: "PROD-010", sku: "HND-001", name: "Headlight Assembly", type: "Honda", category: "Headlight", itemType: "product", compatibleBrands: ["Honda"], price: 290, stock: 20 },
  { id: "PROD-011", sku: "HND-002", name: "Break Pad Front (PCX/Click)", type: "Honda", category: "Brakes", itemType: "product", compatibleBrands: ["Honda"], price: 275, stock: 25 },
  { id: "PROD-012", sku: "HND-003", name: "Honda Genuine Oil 4T 1L", type: "Honda", category: "Engine Oil", itemType: "product", compatibleBrands: ["Honda"], price: 240, stock: 35 },
  { id: "PROD-013", sku: "HND-004", name: "Disk Break Rotor", type: "Honda", category: "Brakes", itemType: "product", compatibleBrands: ["Honda"], price: 470, stock: 14 },
  { id: "PROD-014", sku: "HND-005", name: "Drive Belt (PCX 160)", type: "Honda", category: "Parts", itemType: "product", compatibleBrands: ["Honda"], price: 680, stock: 18 },
  { id: "PROD-015", sku: "HND-006", name: "Spark Plug Cap & Wire", type: "Honda", category: "Parts", itemType: "product", compatibleBrands: ["Honda"], price: 190, stock: 30 },

  // Universal parts (Fits both Yamaha, Honda, Kawasaki, Suzuki)
  { id: "PROD-020", sku: "UNI-001", name: "Castrol Power1 Oil 1L", type: "Universal", category: "Engine Oil", itemType: "product", compatibleBrands: ["Yamaha", "Honda", "Kawasaki", "Suzuki", "Universal"], price: 280, stock: 50 },
  { id: "PROD-021", sku: "UNI-002", name: "NGK Iridium Spark Plug", type: "Universal", category: "Parts", itemType: "product", compatibleBrands: ["Yamaha", "Honda", "Kawasaki", "Suzuki", "Universal"], price: 220, stock: 45 },
  { id: "PROD-022", sku: "UNI-003", name: "Motul Chain Lube 300ml", type: "Universal", category: "Parts", itemType: "product", compatibleBrands: ["Yamaha", "Honda", "Kawasaki", "Suzuki", "Universal"], price: 320, stock: 30 },
  { id: "PROD-023", sku: "UNI-004", name: "Tubeless Tire 14 Inch", type: "Universal", category: "Parts", itemType: "product", compatibleBrands: ["Yamaha", "Honda", "Universal"], price: 1450, stock: 16 },

  // Kawasaki / Suzuki specific parts
  { id: "PROD-030", sku: "KWK-001", name: "Kawasaki Genuine Brake Pad", type: "Kawasaki", category: "Brakes", itemType: "product", compatibleBrands: ["Kawasaki"], price: 350, stock: 15 },
  { id: "PROD-031", sku: "SZK-001", name: "Suzuki Raider Headlight Bulb", type: "Suzuki", category: "Headlight", itemType: "product", compatibleBrands: ["Suzuki"], price: 180, stock: 22 },

  // SERVICES offered by Riders City Hub
  { id: "SVC-001", sku: "SVC-001", name: "Change Oil & Filter Labor", type: "Universal", category: "Services", itemType: "service", compatibleBrands: ["Yamaha", "Honda", "Kawasaki", "Suzuki", "Universal"], price: 150, stock: 999 },
  { id: "SVC-002", sku: "SVC-002", name: "Brake Pad Installation Labor", type: "Universal", category: "Services", itemType: "service", compatibleBrands: ["Yamaha", "Honda", "Kawasaki", "Suzuki", "Universal"], price: 200, stock: 999 },
  { id: "SVC-003", sku: "SVC-003", name: "Full CVT Cleaning & Tuning", type: "Universal", category: "Services", itemType: "service", compatibleBrands: ["Yamaha", "Honda", "Universal"], price: 350, stock: 999 },
  { id: "SVC-004", sku: "SVC-004", name: "Headlight & Electrical Wiring", type: "Universal", category: "Services", itemType: "service", compatibleBrands: ["Yamaha", "Honda", "Kawasaki", "Suzuki", "Universal"], price: 120, stock: 999 },
  { id: "SVC-005", sku: "SVC-005", name: "Tire Mounting & Wheel Balancing", type: "Universal", category: "Services", itemType: "service", compatibleBrands: ["Yamaha", "Honda", "Kawasaki", "Suzuki", "Universal"], price: 180, stock: 999 },
  { id: "SVC-006", sku: "SVC-006", name: "Periodic Maintenance (PMS)", type: "Universal", category: "Services", itemType: "service", compatibleBrands: ["Yamaha", "Honda", "Kawasaki", "Suzuki", "Universal"], price: 650, stock: 999 },
  { id: "SVC-007", sku: "SVC-007", name: "Chain Cleaning & Precision Lube", type: "Universal", category: "Services", itemType: "service", compatibleBrands: ["Yamaha", "Honda", "Kawasaki", "Suzuki", "Universal"], price: 150, stock: 999 },
  { id: "SVC-008", sku: "SVC-008", name: "FI Throttle Body Flush", type: "Universal", category: "Services", itemType: "service", compatibleBrands: ["Yamaha", "Honda", "Universal"], price: 280, stock: 999 },
  { id: "SVC-009", sku: "SVC-009", name: "Front Fork Shock Re-oil & Seal", type: "Universal", category: "Services", itemType: "service", compatibleBrands: ["Yamaha", "Honda", "Kawasaki", "Suzuki", "Universal"], price: 400, stock: 999 },
];

function CashierPOS({ onCompleteSale, onOpenSidebar, onLogout }) {
  const [catalog] = useState(initialCatalog);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("Yamaha"); // Default to Yamaha to display Yamaha items as in mockup
  const [showServicesOnly, setShowServicesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Upper Right Avatar Dropdown & Profile Modal State (identical to Cashier Dashboard)
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

  // Order Details (matching mockup: Juan Dela Cruz, PCX / ABC123)
  const [customerName, setCustomerName] = useState("Juan Dela Cruz");
  const [vehiclePlate, setVehiclePlate] = useState("PCX / ABC123");
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);

  // Initial cart: Subtotal 525, Discount 25, Total 500
  const [cart, setCart] = useState([
    { id: "PROD-001", sku: "YMH-001", name: "Headlight", type: "Yamaha", price: 250, qty: 1, itemType: "product" },
    { id: "PROD-011", sku: "HND-002", name: "Break Pad", type: "Honda", price: 275, qty: 1, itemType: "product" },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [tenderAmount, setTenderAmount] = useState("");
  const [paymentRefNumber, setPaymentRefNumber] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedTrx, setCompletedTrx] = useState(null);

  // Real Philippine BIR Discount & VAT State
  const [discountType, setDiscountType] = useState("promo"); // "promo", "senior_pwd", "percent", "custom", "none"
  const [discountValue, setDiscountValue] = useState(25); // Default ₱25 promo from mockup
  const [seniorId, setSeniorId] = useState("");
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [taxMode, setTaxMode] = useState("inclusive"); // "inclusive" (Standard BIR 12% in PH) or "exclusive"

  // Manual Service / Labor Input State & Handlers
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [manualServiceName, setManualServiceName] = useState("");
  const [manualServiceFee, setManualServiceFee] = useState("");
  const [manualServiceBrand, setManualServiceBrand] = useState("Universal");

  function handleOpenServiceModal() {
    setManualServiceName("");
    setManualServiceFee("");
    setManualServiceBrand(selectedBrand !== "All" ? selectedBrand : "Universal");
    setIsServiceModalOpen(true);
  }

  function handleSelectServicePreset(preset) {
    setManualServiceName(preset.name);
    setManualServiceFee(String(preset.fee));
    setManualServiceBrand(preset.brand);
  }

  function handleAddManualService(e) {
    e.preventDefault();
    const fee = parseFloat(manualServiceFee);
    if (!manualServiceName.trim() || isNaN(fee) || fee < 0) return;

    const newService = {
      id: `SVC-${Date.now()}`,
      sku: "SVC-CUSTOM",
      name: manualServiceName.trim(),
      type: manualServiceBrand,
      price: fee,
      qty: 1,
      itemType: "service",
    };

    addToCart(newService);
    setIsServiceModalOpen(false);
  }

  // Auto-Chooser Function: When a vehicle brand is picked, automatically choose and filter matching compatible parts
  function handleBrandChange(brand) {
    setSelectedBrand(brand);
    setCurrentPage(1);
  }

  // Quick preset vehicle picker which automatically sets vehicle and detects brand
  function handleSelectVehiclePreset(preset) {
    setVehiclePlate(`${preset.name.split(" ")[1] || preset.name} / ${preset.plate}`);
    handleBrandChange(preset.brand);
    setIsEditingCustomer(false);
  }

  // Filter products by search, category, services toggle, and auto-matched vehicle brand
  const filteredProducts = catalog.filter((item) => {
    // 1. Services toggle
    if (showServicesOnly && item.itemType !== "service") {
      return false;
    }
    if (!showServicesOnly && selectedCategory !== "Services" && item.itemType === "service" && selectedCategory !== "All") {
      return false;
    }

    // 2. Category filter
    if (selectedCategory !== "All" && item.category !== selectedCategory) {
      return false;
    }

    // 3. Vehicle Brand Auto-Chooser filter
    if (selectedBrand !== "All") {
      const isCompatible =
        item.compatibleBrands.includes(selectedBrand) ||
        item.compatibleBrands.includes("Universal") ||
        item.type === selectedBrand;
      if (!isCompatible) return false;
    }

    // 4. Search query
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matches =
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      if (!matches) return false;
    }

    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          sku: item.sku,
          name: item.name,
          type: item.type,
          price: item.price,
          qty: 1,
          itemType: item.itemType,
        },
      ];
    });
  }

  function updateQty(id, delta) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }

  function handleClearOrder() {
    setCart([]);
  }

  // Financial calculations with Philippine 12% Value Added Tax (VAT) Law & BIR Standards
  const rawSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  let discountAmount = 0;
  let discountLabel = "None";
  let vatableSales = 0;
  let vatAmount = 0;
  let vatExemptSales = 0;
  const zeroRatedSales = 0;
  let grandTotal = 0;

  if (rawSubtotal === 0) {
    discountAmount = 0;
    vatableSales = 0;
    vatAmount = 0;
    vatExemptSales = 0;
    grandTotal = 0;
  } else if (discountType === "senior_pwd") {
    // Senior Citizen / PWD under Philippine RA 9994 & RA 10754:
    // Retail prices are VAT-inclusive; first 12% VAT is removed to determine the VAT-exempt base:
    const vatExemptBase = rawSubtotal / 1.12;
    // Statutory 20% discount applies to the VAT-exempt base:
    discountAmount = vatExemptBase * 0.20;
    vatExemptSales = vatExemptBase;
    vatableSales = 0;
    vatAmount = 0;
    discountLabel = "Senior/PWD 20% (VAT-Exempt)";
    grandTotal = Math.max(0, vatExemptBase - discountAmount);
  } else {
    // Standard Commercial Sales
    if (discountType === "promo") {
      discountAmount = Math.min(rawSubtotal, parseFloat(discountValue) || 25);
      discountLabel = `Promo (₱${(parseFloat(discountValue) || 25).toFixed(2)})`;
    } else if (discountType === "percent") {
      const pct = parseFloat(discountValue) || 10;
      discountAmount = rawSubtotal * (pct / 100);
      discountLabel = `${pct}% Discount`;
    } else if (discountType === "custom") {
      discountAmount = Math.min(rawSubtotal, parseFloat(discountValue) || 0);
      discountLabel = `Custom (₱${(parseFloat(discountValue) || 0).toFixed(2)})`;
    } else {
      discountAmount = 0;
      discountLabel = "None";
    }

    const netSales = Math.max(0, rawSubtotal - discountAmount);

    if (taxMode === "inclusive") {
      // Philippine Retail Standard (TRAIN Law / NIRC Sec 106 & 108):
      // Prices are VAT-inclusive: VATable Sales = Net ÷ 1.12, 12% VAT = Net - VATable Sales
      vatableSales = netSales / 1.12;
      vatAmount = netSales - vatableSales;
      vatExemptSales = 0;
      grandTotal = netSales;
    } else {
      // VAT-Exclusive: 12% is added on top of net sales
      vatableSales = netSales;
      vatAmount = netSales * 0.12;
      vatExemptSales = 0;
      grandTotal = netSales + vatAmount;
    }
  }

  function handlePayClick() {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items or services before checking out.");
      return;
    }
    setTenderAmount(grandTotal.toFixed(2));
    setPaymentRefNumber("");
    setIsCheckoutOpen(true);
  }

  function handleConfirmPayment(e) {
    e.preventDefault();
    const numTender = paymentMethod === "CASH" ? (parseFloat(tenderAmount) || 0) : grandTotal;
    if (paymentMethod === "CASH" && numTender < grandTotal) {
      alert(`Amount tendered (₱${numTender.toFixed(2)}) is less than total due (₱${grandTotal.toFixed(2)}). Please enter a sufficient amount.`);
      return;
    }
    const change = Math.max(0, numTender - grandTotal);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    const newTrx = {
      id: `#TRX-${Date.now().toString().slice(-4)}`,
      date: `${formattedDate}, ${formattedTime}`,
      rawDate: now.toISOString(),
      cashier: "Jane",
      cashierCode: "CASHIER-001",
      customer: customerName,
      vehicle: vehiclePlate,
      items: cart.map((c) => `${c.name} x${c.qty}`).join(" + "),
      itemCount: cart.reduce((s, i) => s + i.qty, 0),
      cartDetails: cart.map((c) => ({
        name: c.name,
        qty: c.qty,
        price: c.price,
        total: c.price * c.qty,
        type: c.itemType,
      })),
      amount: `₱${grandTotal.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      numericAmount: grandTotal,
      rawSubtotal,
      discount: discountAmount,
      discountLabel,
      discountType,
      seniorId: discountType === "senior_pwd" ? seniorId : null,
      vatableSales,
      vatAmount,
      vatExemptSales,
      zeroRatedSales,
      taxMode,
      paymentMethod:
        paymentMethod === "CASH"
          ? "Cash"
          : paymentMethod === "G-CASH"
          ? "GCash"
          : "Credit Card",
      refNumber: paymentRefNumber.trim() || null,
      status: "Completed",
      tender: numTender,
      change,
    };

    setCompletedTrx(newTrx);
    setIsCheckoutOpen(false);
    setCart([]);

    if (onCompleteSale) {
      onCompleteSale(newTrx);
    }
  }

  return (
    <div className="rch-pos-container">
      {/* Top Header Card (Matches media_1789738242317.png) */}
      <header className="rch-pos-header-card">
        <div className="rch-pos-header-left">
          <div>
            <h1 className="rch-pos-main-title">POS AND NEW SALE</h1>
            <p className="rch-pos-subtitle">Manage your POS and transactions.</p>
          </div>
        </div>

        {/* Upper Right Avatar & Profile Dropdown (Exact match to image media_1789738242317.png) */}
        <div className="rch-pos-profile-anchor" ref={profileAnchorRef}>
          <button
            type="button"
            className="rch-pos-avatar-btn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Cashier Profile"
            title="Cashier Profile"
          >
            C
          </button>

          {isProfileOpen && (
            <div className="rch-pos-profile-dropdown" role="menu">
              <div className="rch-pos-profile-dropdown-header">
                <strong>Cashier</strong>
                <small>cashier@riderscityhub.ph</small>
              </div>
              <button
                type="button"
                className="rch-pos-dropdown-item"
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
                className="rch-pos-dropdown-item rch-pos-dropdown-logout"
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
      </header>

      {/* Main Content Card (below header card) */}
      <div className="rch-pos-main-card">

      {/* Filter Row: Search, Category, Vehicle Brand Auto-Chooser & Services Button */}
      <div className="rch-pos-filters-row">
        <div className="rch-pos-search-wrapper">
          <Search size={15} className="rch-pos-search-icon" />
          <input
            type="text"
            className="rch-pos-search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Category Dropdown */}
        <select
          className="rch-pos-select"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          aria-label="Filter by Category"
        >
          <option value="All">Category</option>
          <option value="Headlight">Headlight</option>
          <option value="Brakes">Brakes</option>
          <option value="Engine Oil">Engine Oil</option>
          <option value="Parts">Parts</option>
          <option value="Services">Services</option>
        </select>

        {/* Smart Vehicle Brand Auto-Chooser Dropdown */}
        <select
          className="rch-pos-select"
          value={selectedBrand}
          onChange={(e) => handleBrandChange(e.target.value)}
          aria-label="Auto-choose parts by vehicle brand"
          title="Filter and auto-select matching motorcycle brand parts"
        >
          <option value="All">Type / Brand (All)</option>
          <option value="Yamaha">Yamaha</option>
          <option value="Honda">Honda</option>
          <option value="Kawasaki">Kawasaki</option>
          <option value="Suzuki">Suzuki</option>
        </select>

        {/* + Add Service Button - Opens Manual Service / Labor Input Modal */}
        <button
          type="button"
          className="rch-pos-services-btn active"
          onClick={handleOpenServiceModal}
          title="Add custom service or labor with manual pricing"
        >
          <Wrench size={14} />
          <span>+ Add Service</span>
        </button>
      </div>

      {/* Auto-Compatibility Indicator Banner */}
      {selectedBrand !== "All" && (
        <div className="rch-pos-compat-banner">
          <span>
            🎯 <strong>Auto-Matched Parts:</strong> Showing only items compatible with{" "}
            <strong>{selectedBrand}</strong> ({filteredProducts.length} items found)
          </span>
          <button
            type="button"
            onClick={() => setSelectedBrand("All")}
            style={{
              background: "none",
              border: "none",
              color: "#047857",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            ✕ Show All Brands
          </button>
        </div>
      )}

      {/* 2-Column POS Body */}
      <div className="rch-pos-body">
        {/* Left Column: 3x3 Catalog Grid */}
        <div className="rch-pos-catalog-column">
          <div className="rch-pos-grid">
            {displayedProducts.map((item) => (
              <div key={item.id} className="rch-pos-item-card">
                <div>
                  <div className="rch-pos-item-sku">{item.sku}</div>
                  <div className="rch-pos-item-name">{item.name}</div>
                  <div className="rch-pos-item-type">{item.type}</div>

                  {/* Compatibility Badge or Service Badge */}
                  {item.itemType === "service" ? (
                    <div className="rch-pos-service-tag">
                      <Wrench size={10} /> Labor Service
                    </div>
                  ) : selectedBrand !== "All" && (
                    <div className="rch-pos-compat-badge">
                      ✓ Fits {selectedBrand}
                    </div>
                  )}
                </div>

                <div className="rch-pos-item-footer">
                  <span className="rch-pos-item-price">₱ {item.price.toFixed(2)}</span>
                  <button
                    type="button"
                    className="rch-pos-add-btn"
                    onClick={() => addToCart(item)}
                  >
                    + ADD
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Catalog Footer Controls: - Clear Order & Pagination */}
          <div className="rch-pos-catalog-footer">
            <button
              type="button"
              className="rch-pos-clear-btn"
              onClick={handleClearOrder}
            >
              - Clear Order
            </button>

            <div className="rch-pos-pagination">
              <button
                type="button"
                className="rch-pos-page-arrow"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                &lt;
              </button>
              <div className="rch-pos-page-num">{currentPage}</div>
              <button
                type="button"
                className="rch-pos-page-arrow"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: ACTIVE CART / ORDER */}
        <aside className="rch-pos-cart-panel" aria-label="Active Cart and Order">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="rch-pos-cart-title" style={{ margin: 0 }}>ACTIVE CART / ORDER</h2>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "#ff5500",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
              }}
              onClick={handleOpenServiceModal}
              title="Add manual labor or custom service"
            >
              <Wrench size={11} /> + Service
            </button>
          </div>

          {isEditingCustomer ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
              <input
                type="text"
                style={{ padding: "6px 8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
              />
              <input
                type="text"
                style={{ padding: "6px 8px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="Vehicle / Plate"
              />

              {/* Quick Preset Selector to Auto-Match Parts */}
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
                Auto-match vehicle model:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {vehiclePresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    style={{
                      background: "#f3f4f6",
                      border: "none",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                      color: "#374151",
                    }}
                    onClick={() => handleSelectVehiclePreset(preset)}
                  >
                    {preset.name.split(" ")[1] || preset.name}
                  </button>
                ))}
              </div>

              <button
                type="button"
                style={{
                  alignSelf: "flex-end",
                  fontSize: "11px",
                  color: "#ff5500",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  marginTop: "4px",
                }}
                onClick={() => setIsEditingCustomer(false)}
              >
                Done Editing
              </button>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px", cursor: "pointer" }}
              onClick={() => setIsEditingCustomer(true)}
              title="Click to edit customer, change vehicle, or auto-match parts"
            >
              <div className="rch-pos-cart-customer">
                <strong>Customer : </strong>
                <em>{customerName}</em>
              </div>
              <div className="rch-pos-cart-vehicle">
                VEHICLE / PLATE: {vehiclePlate}
              </div>
            </div>
          )}

          {/* Cart Item Containers */}
          <div className="rch-pos-cart-items-list">
            {cart.length === 0 ? (
              <div className="rch-pos-empty-cart">No items in cart</div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="rch-pos-cart-row">
                  <div className="rch-pos-cart-item-info">
                    <span className="rch-pos-cart-item-title">
                      {item.itemType === "service" ? `[SVC] ${item.name}` : item.name}
                    </span>
                    <span className="rch-pos-cart-item-price">
                      ₱ {(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                  <div className="rch-pos-cart-steppers">
                    <button
                      type="button"
                      className="rch-pos-stepper-btn minus"
                      onClick={() => updateQty(item.id, -1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="rch-pos-cart-qty">{item.qty}</span>
                    <button
                      type="button"
                      className="rch-pos-stepper-btn plus"
                      onClick={() => updateQty(item.id, 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Payment Method */}
          <h3 className="rch-pos-payment-heading">Add Payment Method</h3>
          <div className="rch-pos-payment-methods">
            {["CASH", "G-CASH", "CREDIT CARD"].map((method) => (
              <button
                key={method}
                type="button"
                className={`rch-pos-payment-btn ${paymentMethod === method ? "active" : ""}`}
                onClick={() => setPaymentMethod(method)}
              >
                {method}
              </button>
            ))}
          </div>

          {/* Breakdown with Philippine BIR 12% VAT Law Compliance */}
          <div className="rch-pos-breakdown">
            <div className="rch-pos-breakdown-row">
              <span>Sub total (Gross)</span>
              <span>₱ {rawSubtotal.toFixed(2)}</span>
            </div>

            <div className="rch-pos-breakdown-row">
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>Discounts</span>
                <button
                  type="button"
                  className="rch-pos-discount-badge"
                  onClick={() => setIsDiscountModalOpen(true)}
                  title="Click to change discount or apply Senior/PWD exemption"
                >
                  {discountType === "promo"
                    ? "₱25 Promo"
                    : discountType === "senior_pwd"
                    ? "SC/PWD 20%"
                    : discountType === "percent"
                    ? `${discountValue}%`
                    : discountType === "custom"
                    ? `₱${discountValue}`
                    : "None"} ✎
                </button>
              </div>
              <span style={{ color: discountAmount > 0 ? "#15803d" : "inherit", fontWeight: discountAmount > 0 ? 700 : "normal" }}>
                {discountAmount > 0 ? `- ₱ ${discountAmount.toFixed(2)}` : "₱ 0.00"}
              </span>
            </div>

            {/* Philippine Tax Law Breakdown */}
            <div className="rch-pos-vat-section">
              <div className="rch-pos-breakdown-row" style={{ color: "#4b5563", fontSize: "11px" }}>
                <span>VATable Sales (Net of VAT)</span>
                <span>₱ {vatableSales.toFixed(2)}</span>
              </div>
              <div className="rch-pos-breakdown-row" style={{ color: "#4b5563", fontSize: "11px" }}>
                <span>VAT 12% (BIR Republic Act 8424)</span>
                <span>₱ {vatAmount.toFixed(2)}</span>
              </div>
              {vatExemptSales > 0 && (
                <div className="rch-pos-breakdown-row" style={{ color: "#15803d", fontSize: "11px", fontWeight: 600 }}>
                  <span>VAT-Exempt Sales (RA 9994/10754)</span>
                  <span>₱ {vatExemptSales.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="rch-pos-breakdown-divider" />
            <div className="rch-pos-breakdown-row rch-pos-breakdown-total">
              <span>Total</span>
              <span>₱ {grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="button"
            className="rch-pos-pay-btn"
            disabled={cart.length === 0}
            onClick={handlePayClick}
            title={cart.length === 0 ? "Cart is empty. Please add items or services." : "Click to proceed to checkout"}
          >
            PAY ₱ {grandTotal.toFixed(2)}
          </button>
        </aside>
      </div>
      </div>

      {/* Manual Service / Labor Input Modal */}
      {isServiceModalOpen && (
        <div className="rch-pos-modal-backdrop" onClick={() => setIsServiceModalOpen(false)}>
          <div className="rch-pos-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rch-pos-modal-header">
              <div>
                <h2>Add Service / Labor</h2>
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "12px" }}>
                  Enter custom service details or select a quick preset.
                </p>
              </div>
              <button
                type="button"
                className="rch-pos-modal-close"
                onClick={() => setIsServiceModalOpen(false)}
                aria-label="Close service modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddManualService}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="rch-pos-form-group">
                  <label className="rch-pos-form-label">Service / Labor Description:</label>
                  <input
                    type="text"
                    className="rch-pos-form-input"
                    placeholder="e.g. Custom Wiring Repair, Engine Overhaul Labor..."
                    value={manualServiceName}
                    onChange={(e) => setManualServiceName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="rch-pos-form-group">
                  <label className="rch-pos-form-label">Labor Fee (₱):</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    className="rch-pos-form-input"
                    placeholder="e.g. 250.00"
                    value={manualServiceFee}
                    onChange={(e) => setManualServiceFee(e.target.value)}
                    required
                  />
                </div>

                <div className="rch-pos-form-group">
                  <label className="rch-pos-form-label">Vehicle Brand Compatibility (Optional):</label>
                  <select
                    className="rch-pos-form-input"
                    value={manualServiceBrand}
                    onChange={(e) => setManualServiceBrand(e.target.value)}
                  >
                    <option value="Universal">Universal / General</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Honda">Honda</option>
                    <option value="Kawasaki">Kawasaki</option>
                    <option value="Suzuki">Suzuki</option>
                  </select>
                </div>

                {/* Quick Presets for 1-Click Fill & Customize */}
                <div>
                  <label className="rch-pos-form-label" style={{ display: "block", marginBottom: "4px" }}>
                    Quick Presets (Click to autofill & customize):
                  </label>
                  <div className="rch-pos-preset-chips">
                    {servicePresets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        className="rch-pos-preset-chip"
                        onClick={() => handleSelectServicePreset(preset)}
                      >
                        {preset.name} (₱{preset.fee})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "22px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  style={{
                    background: "#f3f4f6",
                    border: "none",
                    borderRadius: "9999px",
                    padding: "10px 18px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => setIsServiceModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rch-pos-pay-btn"
                  style={{ width: "auto", padding: "10px 24px", margin: 0 }}
                >
                  + Add to Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cashier Jane Profile Modal (Identical to Cashier Dashboard) */}
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
                <div className="rch-pos-avatar-btn" style={{ width: "48px", height: "48px", fontSize: "18px" }}>
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

      {/* Discount & Tax Management Modal */}
      {isDiscountModalOpen && (
        <div className="rch-pos-modal-backdrop" onClick={() => setIsDiscountModalOpen(false)}>
          <div className="rch-pos-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rch-pos-modal-header">
              <div>
                <h2>Manage Discount &amp; Tax</h2>
                <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "12px" }}>
                  Philippine BIR statutory discounts and tax configurations.
                </p>
              </div>
              <button
                type="button"
                className="rch-pos-modal-close"
                onClick={() => setIsDiscountModalOpen(false)}
                aria-label="Close discount modal"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Discount Options */}
              <div>
                <label className="rch-pos-form-label" style={{ marginBottom: "6px", display: "block" }}>
                  Select Discount Type:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button
                    type="button"
                    className={`rch-pos-discount-opt ${discountType === "promo" ? "active" : ""}`}
                    onClick={() => {
                      setDiscountType("promo");
                      setDiscountValue(25);
                    }}
                  >
                    <strong>₱25 Promo</strong>
                    <small>Default shop promotion</small>
                  </button>

                  <button
                    type="button"
                    className={`rch-pos-discount-opt ${discountType === "senior_pwd" ? "active" : ""}`}
                    onClick={() => setDiscountType("senior_pwd")}
                  >
                    <strong>Senior / PWD (20%)</strong>
                    <small>12% VAT Exempt + 20% Off</small>
                  </button>

                  <button
                    type="button"
                    className={`rch-pos-discount-opt ${discountType === "percent" ? "active" : ""}`}
                    onClick={() => {
                      setDiscountType("percent");
                      if (!discountValue || discountValue === 25) setDiscountValue(10);
                    }}
                  >
                    <strong>Percentage (%)</strong>
                    <small>Custom percent discount</small>
                  </button>

                  <button
                    type="button"
                    className={`rch-pos-discount-opt ${discountType === "none" ? "active" : ""}`}
                    onClick={() => setDiscountType("none")}
                  >
                    <strong>No Discount</strong>
                    <small>₱0.00 regular price</small>
                  </button>
                </div>
              </div>

              {/* Conditional Inputs */}
              {discountType === "senior_pwd" && (
                <div className="rch-pos-form-group" style={{ background: "#f0fdf4", padding: "12px", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
                  <label className="rch-pos-form-label" style={{ color: "#166534" }}>
                    Senior Citizen / PWD ID Number (Required for BIR Audit):
                  </label>
                  <input
                    type="text"
                    className="rch-pos-form-input"
                    placeholder="e.g. SC-2026-98124 / PWD-MNL-458"
                    value={seniorId}
                    onChange={(e) => setSeniorId(e.target.value)}
                    style={{ background: "#ffffff" }}
                  />
                  <small style={{ color: "#15803d", marginTop: "4px", fontSize: "11px" }}>
                    ✓ Pursuant to RA 9994 &amp; RA 10754: 12% VAT is legally waived, then 20% discount is applied to the net base.
                  </small>
                </div>
              )}

              {discountType === "percent" && (
                <div className="rch-pos-form-group">
                  <label className="rch-pos-form-label">Discount Percentage (%):</label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[5, 10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        className={`rch-pos-preset-chip ${discountValue === pct ? "active" : ""}`}
                        onClick={() => setDiscountValue(pct)}
                      >
                        {pct}%
                      </button>
                    ))}
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="rch-pos-form-input"
                      style={{ width: "80px", padding: "6px 8px" }}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {discountType === "promo" && (
                <div className="rch-pos-form-group">
                  <label className="rch-pos-form-label">Promo Amount (₱):</label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[25, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className={`rch-pos-preset-chip ${discountValue === amt ? "active" : ""}`}
                        onClick={() => setDiscountValue(amt)}
                      >
                        ₱{amt}
                      </button>
                    ))}
                    <input
                      type="number"
                      min="0"
                      className="rch-pos-form-input"
                      style={{ width: "90px", padding: "6px 8px" }}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Tax Mode Selection */}
              <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
                <label className="rch-pos-form-label" style={{ marginBottom: "6px", display: "block" }}>
                  Philippine BIR Tax Mode:
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="taxMode"
                      checked={taxMode === "inclusive"}
                      onChange={() => setTaxMode("inclusive")}
                    />
                    <span><strong>VAT-Inclusive (12% included)</strong> — Standard PH Law</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="taxMode"
                      checked={taxMode === "exclusive"}
                      onChange={() => setTaxMode("exclusive")}
                    />
                    <span><strong>VAT-Exclusive (+12% added)</strong></span>
                  </label>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="rch-pos-pay-btn"
                style={{ width: "auto", padding: "8px 24px", margin: 0 }}
                onClick={() => setIsDiscountModalOpen(false)}
              >
                Apply &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tender / Payment Confirmation Modal */}
      {isCheckoutOpen && (
        <div className="rch-pos-modal-backdrop" onClick={() => setIsCheckoutOpen(false)}>
          <div className="rch-pos-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rch-pos-modal-header">
              <div>
                <h2>Confirm Payment</h2>
                <p style={{ margin: "3px 0 0", color: "#6b7280", fontSize: "12px" }}>
                  Review order total and enter payment tender.
                </p>
              </div>
              <button
                type="button"
                className="rch-pos-modal-close"
                onClick={() => setIsCheckoutOpen(false)}
                aria-label="Close checkout modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Customer:</span>
                  <strong>{customerName}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Vehicle / Plate:</span>
                  <strong>{vehiclePlate}</strong>
                </div>

                {/* Financial Summary */}
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    fontSize: "12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Sub total (Gross):</span>
                    <span>₱ {rawSubtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: discountAmount > 0 ? "#15803d" : "inherit" }}>
                    <span>Discounts ({discountLabel}):</span>
                    <span>{discountAmount > 0 ? `- ₱ ${discountAmount.toFixed(2)}` : "₱ 0.00"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#6b7280" }}>
                    <span>VATable Sales:</span>
                    <span>₱ {vatableSales.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#6b7280" }}>
                    <span>12% VAT (PH Law):</span>
                    <span>₱ {vatAmount.toFixed(2)}</span>
                  </div>
                  {vatExemptSales > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#15803d" }}>
                      <span>VAT-Exempt Sales:</span>
                      <span>₱ {vatExemptSales.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ borderTop: "1px solid #e5e7eb", margin: "4px 0" }} />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    <span>Total Due:</span>
                    <span style={{ color: "#ff5500" }}>₱ {grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="rch-pos-form-label" style={{ marginBottom: "4px", display: "block" }}>
                    Payment Method:
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["CASH", "G-CASH", "CREDIT CARD"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`rch-pos-payment-btn ${paymentMethod === m ? "active" : ""}`}
                        style={{ flex: 1, padding: "8px 10px", fontSize: "12px" }}
                        onClick={() => setPaymentMethod(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cash Tender & Quick Presets */}
                {paymentMethod === "CASH" ? (
                  <div style={{ marginTop: "4px" }}>
                    <label style={{ display: "block", fontWeight: 700, fontSize: "12px", marginBottom: "4px", color: "#374151" }}>
                      Cash Tendered (₱):
                    </label>
                    <input
                      type="number"
                      step="any"
                      min={grandTotal}
                      value={tenderAmount}
                      onChange={(e) => setTenderAmount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: "1.5px solid #d1d5db",
                        fontSize: "16px",
                        fontWeight: 700,
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                      required
                    />

                    {/* Quick Cash Buttons */}
                    <div className="rch-pos-denom-chips">
                      <button
                        type="button"
                        className="rch-pos-denom-chip"
                        onClick={() => setTenderAmount(grandTotal.toFixed(2))}
                      >
                        Exact (₱{grandTotal.toFixed(2)})
                      </button>
                      <button
                        type="button"
                        className="rch-pos-denom-chip"
                        onClick={() => {
                          const curr = parseFloat(tenderAmount) || grandTotal;
                          setTenderAmount((curr + 50).toFixed(2));
                        }}
                      >
                        +₱50
                      </button>
                      <button
                        type="button"
                        className="rch-pos-denom-chip"
                        onClick={() => {
                          const curr = parseFloat(tenderAmount) || grandTotal;
                          setTenderAmount((curr + 100).toFixed(2));
                        }}
                      >
                        +₱100
                      </button>
                      {[500, 1000, 2000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          className="rch-pos-denom-chip"
                          onClick={() => setTenderAmount(String(amt))}
                        >
                          ₱{amt}
                        </button>
                      ))}
                    </div>

                    {/* Live Change Calculation */}
                    <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, fontSize: "13px" }}>Change:</span>
                      {parseFloat(tenderAmount) >= grandTotal ? (
                        <span style={{ fontSize: "16px", fontWeight: 800, color: "#15803d" }}>
                          ₱ {(parseFloat(tenderAmount) - grandTotal).toFixed(2)}
                        </span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: 600 }}>
                          Insufficient Amount
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  /* GCash or Credit Card Reference Number */
                  <div className="rch-pos-form-group" style={{ marginTop: "4px" }}>
                    <label className="rch-pos-form-label">
                      {paymentMethod === "G-CASH" ? "GCash Reference No.:" : "Card Approval / Trace No.:"}
                    </label>
                    <input
                      type="text"
                      className="rch-pos-form-input"
                      placeholder={paymentMethod === "G-CASH" ? "e.g. 100293847291" : "e.g. AUTH-98214"}
                      value={paymentRefNumber}
                      onChange={(e) => setPaymentRefNumber(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  style={{
                    background: "#f3f4f6",
                    border: "none",
                    borderRadius: "9999px",
                    padding: "10px 18px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => setIsCheckoutOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rch-pos-pay-btn"
                  style={{ width: "auto", padding: "10px 24px", margin: 0 }}
                  disabled={paymentMethod === "CASH" && (parseFloat(tenderAmount) || 0) < grandTotal}
                >
                  Complete Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Completed Transaction & Official BIR Thermal Receipt Modal */}
      {completedTrx && (
        <div className="rch-pos-modal-backdrop" onClick={() => setCompletedTrx(null)}>
          <div className="rch-pos-modal-card rch-pos-receipt-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
              <CheckCircle2 size={40} color="#10b981" />
            </div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800, textAlign: "center" }}>
              Payment Successful!
            </h2>
            <p style={{ margin: "4px 0 14px", color: "#6b7280", fontSize: "12px", textAlign: "center" }}>
              Order {completedTrx.id} recorded with Philippine BIR compliance.
            </p>

            {/* Official BIR Thermal Receipt Paper Container */}
            <div className="rch-pos-receipt-paper">
              {/* Receipt Header */}
              <div className="rch-pos-receipt-header">
                <h3 className="rch-pos-receipt-store">RIDERS CITY HUB PH</h3>
                <p>Motorcycle Parts &amp; Services Specialists</p>
                <p>123 Rizal Avenue, Sta. Cruz, Manila, Philippines</p>
                <p><strong>VAT REG. TIN:</strong> 458-921-703-000-NV</p>
                <p><strong>BIR PERMIT NO:</strong> FP082026-0091823</p>
                <p><strong>SERIAL / MACHINE ID:</strong> POS-MNL-01</p>
              </div>

              <div className="rch-pos-receipt-divider-dashed" />

              {/* Transaction Metadata */}
              <div className="rch-pos-receipt-meta">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>RECEIPT NO:</span>
                  <strong>{completedTrx.id}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>DATE &amp; TIME:</span>
                  <span>{completedTrx.date}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>CASHIER:</span>
                  <span>{completedTrx.cashier} ({completedTrx.cashierCode})</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>CUSTOMER:</span>
                  <span>{completedTrx.customer}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>VEHICLE / PLATE:</span>
                  <span>{completedTrx.vehicle}</span>
                </div>
              </div>

              <div className="rch-pos-receipt-divider-dashed" />

              {/* Itemized Cart List */}
              <div className="rch-pos-receipt-items">
                {completedTrx.cartDetails && completedTrx.cartDetails.length > 0 ? (
                  completedTrx.cartDetails.map((item, idx) => (
                    <div key={idx} className="rch-pos-receipt-item-row">
                      <div className="rch-pos-receipt-item-name">
                        {item.qty}x {item.name}
                        {item.type === "service" && " (Labor)"}
                      </div>
                      <div className="rch-pos-receipt-item-amount">
                        ₱ {item.total.toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rch-pos-receipt-item-row">
                    <div className="rch-pos-receipt-item-name">{completedTrx.items}</div>
                    <div className="rch-pos-receipt-item-amount">{completedTrx.amount}</div>
                  </div>
                )}
              </div>

              <div className="rch-pos-receipt-divider-dashed" />

              {/* Financial Summary */}
              <div className="rch-pos-receipt-financials">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Gross Subtotal:</span>
                  <span>₱ {(completedTrx.rawSubtotal || 0).toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Discounts ({completedTrx.discountLabel || "None"}):</span>
                  <span>- ₱ {(completedTrx.discount || 0).toFixed(2)}</span>
                </div>
                {completedTrx.seniorId && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#15803d" }}>
                    <span>SC/PWD ID:</span>
                    <span>{completedTrx.seniorId}</span>
                  </div>
                )}
              </div>

              <div className="rch-pos-receipt-divider-dashed" />

              {/* Official BIR Tax Summary */}
              <div className="rch-pos-receipt-vat-box">
                <div style={{ fontWeight: 700, fontSize: "10px", textTransform: "uppercase", marginBottom: "3px" }}>
                  VAT Breakdown (PH BIR Compliant):
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>VATable Sales (12%):</span>
                  <span>₱ {(completedTrx.vatableSales || 0).toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>VAT Amount (12%):</span>
                  <span>₱ {(completedTrx.vatAmount || 0).toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>VAT-Exempt Sales:</span>
                  <span>₱ {(completedTrx.vatExemptSales || 0).toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Zero-Rated Sales:</span>
                  <span>₱ 0.00</span>
                </div>
              </div>

              <div className="rch-pos-receipt-divider-double" />

              {/* Total & Payment Tender */}
              <div className="rch-pos-receipt-totals">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 800 }}>
                  <span>TOTAL AMOUNT DUE:</span>
                  <span>{completedTrx.amount}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Payment Method:</span>
                  <span>{completedTrx.paymentMethod}</span>
                </div>
                {completedTrx.refNumber && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                    <span>Ref No.:</span>
                    <span>{completedTrx.refNumber}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Amount Tendered:</span>
                  <span>₱ {(completedTrx.tender || 0).toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: "#15803d" }}>
                  <span>Change:</span>
                  <span>₱ {(completedTrx.change || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="rch-pos-receipt-divider-dashed" />

              {/* BIR Mandatory Footer */}
              <div className="rch-pos-receipt-footer">
                <p><strong>THIS SERVES AS AN OFFICIAL RECEIPT</strong></p>
                <p>Items sold are subject to store warranty policy.</p>
                <p>Thank you for choosing Riders City Hub!</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", gap: "10px" }}>
              <button
                type="button"
                style={{
                  background: "#18182c",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "9px 18px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onClick={() => window.print()}
              >
                <Printer size={14} /> Print Receipt
              </button>
              <button
                type="button"
                className="rch-pos-pay-btn"
                style={{ width: "auto", padding: "9px 22px", margin: 0 }}
                onClick={() => setCompletedTrx(null)}
              >
                Done / Next Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

CashierPOS.propTypes = {
  onCompleteSale: PropTypes.func,
  onOpenSidebar: PropTypes.func,
  onLogout: PropTypes.func,
};

export default CashierPOS;
