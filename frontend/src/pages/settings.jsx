import { useState } from "react";
import PropTypes from "prop-types";
import {
  Boxes,
  CheckCircle2,
  ChevronDown,
  Edit2,
  Home,
  LogOut,
  Menu,
  Settings as SettingsIcon,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import "./settings.css";

const navItems = [
  { id: "Dashboard", label: "Dashboard", icon: Home },
  { id: "Inventory", label: "Inventory", icon: ShoppingBag },
  { id: "Products", label: "Products", icon: ShoppingCart },
  { id: "User Management", label: "User Management", icon: User },
  { id: "Supplier Module", label: "Supplier Module", icon: Boxes },
  { id: "Settings", label: "Settings", icon: SettingsIcon },
];

function Settings({ onLogout, onNavigate }) {
  const [activeNav, setActiveNav] = useState("Settings");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("Admin");

  // Store Information State
  const [storeInfo, setStoreInfo] = useState({
    storeName: "Riders City Hub",
    storeAddress1: "123 Rizal Avenue, Sta. Cruz",
    storeAddress2: "Manila, Metro Manila, Philippines",
    emailAddress: "contact@riderscityhub.ph",
    businessHours: "8:00 AM - 7:00 PM (Mon - Sat)",
  });

  // Track which store information fields are enabled for editing
  const [editableFields, setEditableFields] = useState({
    storeName: false,
    storeAddress1: false,
    storeAddress2: false,
    emailAddress: false,
    businessHours: false,
  });

  function toggleFieldEditable(fieldName) {
    setEditableFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  }

  // Security & System Behavior State
  const [securitySettings, setSecuritySettings] = useState({
    autoLogout: "15m",
    sessionTimeout: "8h",
  });

  // Feedback State
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modals
  const [modal, setModal] = useState(null);

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

  function handleSave(e) {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  }

  return (
    <div className="rch-set-root">
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
      <div className="rch-set-main">
        <div className="rch-set-canvas">
          {/* Top Header Card (media_1789047587546.png) */}
          <header className="rch-set-header-card">
            <div className="rch-set-header-top">
              <div className="rch-set-title-area">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    className="rch-hamburger"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Toggle navigation"
                  >
                    <Menu size={22} />
                  </button>
                  <h1>Settings</h1>
                </div>
                <p className="rch-set-subtitle">
                  Manage your store details and system configuration
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
                      <SettingsIcon size={14} />
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
          </header>

          {/* Main Content Card (media_1789047587546.png) */}
          <form className="rch-set-card" onSubmit={handleSave}>
            {saveSuccess && (
              <div className="rch-set-success-alert">
                <CheckCircle2 size={18} />
                <span>Settings have been updated and saved successfully!</span>
              </div>
            )}

            <div className="rch-set-grid">
              {/* Left Column: Store Information */}
              <div className="rch-set-col">
                <h2 className="rch-set-section-title">Store Information</h2>

                <div className="rch-set-field">
                  <label>Store Name</label>
                  <div className="rch-set-input-wrap">
                    <input
                      type="text"
                      className={`rch-set-input ${!editableFields.storeName ? "is-disabled" : "is-editing"}`}
                      value={storeInfo.storeName}
                      disabled={!editableFields.storeName}
                      onChange={(e) =>
                        setStoreInfo({ ...storeInfo, storeName: e.target.value })
                      }
                      placeholder="e.g. Riders City Hub"
                      required
                    />
                    <button
                      type="button"
                      className={`rch-set-edit-btn ${editableFields.storeName ? "active" : ""}`}
                      onClick={() => toggleFieldEditable("storeName")}
                      title={editableFields.storeName ? "Lock editing" : "Click to edit"}
                      aria-label="Edit Store Name"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="rch-set-field">
                  <label>Store Address</label>
                  <div className="rch-set-input-wrap">
                    <input
                      type="text"
                      className={`rch-set-input ${!editableFields.storeAddress1 ? "is-disabled" : "is-editing"}`}
                      value={storeInfo.storeAddress1}
                      disabled={!editableFields.storeAddress1}
                      onChange={(e) =>
                        setStoreInfo({
                          ...storeInfo,
                          storeAddress1: e.target.value,
                        })
                      }
                      placeholder="Street address"
                      required
                    />
                    <button
                      type="button"
                      className={`rch-set-edit-btn ${editableFields.storeAddress1 ? "active" : ""}`}
                      onClick={() => toggleFieldEditable("storeAddress1")}
                      title={editableFields.storeAddress1 ? "Lock editing" : "Click to edit"}
                      aria-label="Edit Store Address 1"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="rch-set-field">
                  <label>Store Address</label>
                  <div className="rch-set-input-wrap">
                    <input
                      type="text"
                      className={`rch-set-input ${!editableFields.storeAddress2 ? "is-disabled" : "is-editing"}`}
                      value={storeInfo.storeAddress2}
                      disabled={!editableFields.storeAddress2}
                      onChange={(e) =>
                        setStoreInfo({
                          ...storeInfo,
                          storeAddress2: e.target.value,
                        })
                      }
                      placeholder="City, State / Region, Postal Code"
                    />
                    <button
                      type="button"
                      className={`rch-set-edit-btn ${editableFields.storeAddress2 ? "active" : ""}`}
                      onClick={() => toggleFieldEditable("storeAddress2")}
                      title={editableFields.storeAddress2 ? "Lock editing" : "Click to edit"}
                      aria-label="Edit Store Address 2"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="rch-set-field">
                  <label>E-Mail Address</label>
                  <div className="rch-set-input-wrap">
                    <input
                      type="email"
                      className={`rch-set-input ${!editableFields.emailAddress ? "is-disabled" : "is-editing"}`}
                      value={storeInfo.emailAddress}
                      disabled={!editableFields.emailAddress}
                      onChange={(e) =>
                        setStoreInfo({
                          ...storeInfo,
                          emailAddress: e.target.value,
                        })
                      }
                      placeholder="store@riderscityhub.ph"
                      required
                    />
                    <button
                      type="button"
                      className={`rch-set-edit-btn ${editableFields.emailAddress ? "active" : ""}`}
                      onClick={() => toggleFieldEditable("emailAddress")}
                      title={editableFields.emailAddress ? "Lock editing" : "Click to edit"}
                      aria-label="Edit Email Address"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="rch-set-field">
                  <label>Business Hours</label>
                  <div className="rch-set-input-wrap">
                    <input
                      type="text"
                      className={`rch-set-input ${!editableFields.businessHours ? "is-disabled" : "is-editing"}`}
                      value={storeInfo.businessHours}
                      disabled={!editableFields.businessHours}
                      onChange={(e) =>
                        setStoreInfo({
                          ...storeInfo,
                          businessHours: e.target.value,
                        })
                      }
                      placeholder="e.g. 8:00 AM - 7:00 PM (Mon - Sat)"
                      required
                    />
                    <button
                      type="button"
                      className={`rch-set-edit-btn ${editableFields.businessHours ? "active" : ""}`}
                      onClick={() => toggleFieldEditable("businessHours")}
                      title={editableFields.businessHours ? "Lock editing" : "Click to edit"}
                      aria-label="Edit Business Hours"
                    >
                      <Edit2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Security & System Behavior */}
              <div className="rch-set-col">
                <h2 className="rch-set-section-title">
                  Security & System Behavior
                </h2>

                <div className="rch-set-row-field">
                  <span className="rch-set-row-label">
                    Automatic logout/inactivity logout
                  </span>
                  <div className="rch-set-compact-select-wrap">
                    <select
                      className="rch-set-compact-select"
                      value={securitySettings.autoLogout}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          autoLogout: e.target.value,
                        })
                      }
                    >
                      <option value="15m">15 mins</option>
                      <option value="30m">30 mins</option>
                      <option value="1h">1 hour</option>
                      <option value="never">Never</option>
                    </select>
                    <ChevronDown size={13} className="rch-set-select-arrow" />
                  </div>
                </div>

                <div className="rch-set-row-field">
                  <span className="rch-set-row-label">Session Timeout</span>
                  <div className="rch-set-compact-select-wrap">
                    <select
                      className="rch-set-compact-select"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: e.target.value,
                        })
                      }
                    >
                      <option value="4h">4 hours</option>
                      <option value="8h">8 hours</option>
                      <option value="12h">12 hours</option>
                      <option value="24h">24 hours</option>
                    </select>
                    <ChevronDown size={13} className="rch-set-select-arrow" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Save Changes */}
            <div className="rch-set-footer">
              <button type="submit" className="rch-btn-save-changes">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

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

Settings.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
};

export default Settings;

