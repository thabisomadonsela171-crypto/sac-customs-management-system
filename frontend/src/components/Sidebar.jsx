function Sidebar({ page, onNavigate, user }) {
  const role = user?.role;

  return (
    <aside className="sidebar">

      <div className="sidebar-title">
        MAIN MENU
      </div>

      {/* DASHBOARD - ALL ROLES */}
      <button
        className={`menu-item ${page === "dashboard" ? "active" : ""}`}
        onClick={() => onNavigate("dashboard")}
      >
        Dashboard
      </button>

      {/* CUSTOMERS - ADMIN / CLERK ONLY */}
      {(role === "ADMIN" || role === "CLERK") && (
        <button
          className={`menu-item ${page === "customers" ? "active" : ""}`}
          onClick={() => onNavigate("customers")}
        >
          Customers
        </button>
      )}

      {/* SHIPMENTS - ADMIN / CLERK / CUSTOMS OFFICER */}
      {(role === "ADMIN" ||
        role === "CLERK" ||
        role === "CUSTOMS_OFFICER") && (
        <button
          className={`menu-item ${page === "shipments" ? "active" : ""}`}
          onClick={() => onNavigate("shipments")}
        >
          Shipments
        </button>
      )}

      {/* DOCUMENTS - ADMIN / CLERK / CUSTOMS OFFICER */}
      {(role === "ADMIN" ||
        role === "CLERK" ||
        role === "CUSTOMS_OFFICER") && (
        <button
          className={`menu-item ${page === "documents" ? "active" : ""}`}
          onClick={() => onNavigate("documents")}
        >
          Documents
        </button>
      )}

      {/* DECLARATIONS - ADMIN / CLERK / CUSTOMS OFFICER */}
      {(role === "ADMIN" ||
        role === "CLERK" ||
        role === "CUSTOMS_OFFICER") && (
        <button
          className={`menu-item ${page === "declarations" ? "active" : ""}`}
          onClick={() => onNavigate("declarations")}
        >
          Declarations
        </button>
      )}

      {/* PAYMENTS - ADMIN / FINANCE */}
      {(role === "ADMIN" || role === "FINANCE") && (
        <button
          className={`menu-item ${page === "payments" ? "active" : ""}`}
          onClick={() => onNavigate("payments")}
        >
          Payments
        </button>
      )}

      {/* TRACKING - ADMIN / CLERK / CUSTOMS OFFICER */}
      {(role === "ADMIN" ||
        role === "CLERK" ||
        role === "CUSTOMS_OFFICER") && (
        <button
          className={`menu-item ${page === "tracking" ? "active" : ""}`}
          onClick={() => onNavigate("tracking")}
        >
          Tracking
        </button>
      )}

      {/* NOTIFICATIONS - ALL ROLES */}
      <button
        className={`menu-item ${page === "notifications" ? "active" : ""}`}
        onClick={() => onNavigate("notifications")}
      >
        Notifications
      </button>

      {/* ADMINISTRATION - ADMIN ONLY */}
      {role === "ADMIN" && (
        <>
          <div className="sidebar-title">
            ADMINISTRATION
          </div>

          {/* USER MANAGEMENT */}
          <button
            className={`menu-item ${page === "users" ? "active" : ""}`}
            onClick={() => onNavigate("users")}
          >
            User Management
          </button>

          {/* AUDIT LOGS */}
          <button
            className={`menu-item ${page === "auditLogs" ? "active" : ""}`}
            onClick={() => onNavigate("auditLogs")}
          >
            Audit Logs
          </button>

          {/* SETTINGS */}
          <button
            className={`menu-item ${page === "settings" ? "active" : ""}`}
            onClick={() => onNavigate("settings")}
          >
            Settings
          </button>
        </>
      )}

    </aside>
  );
}

export default Sidebar;