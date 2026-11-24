import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:4000/api";

export default function Dashboard({
  user,
  onNavigate,
  onRefresh,
  customers: initialCustomers = 0,
  shipments: initialShipments = 0,
  documents: initialDocuments = 0,
  declarations: initialDeclarations = 0,
  payments: initialPayments = 0,
  users: initialUsers = 0,
}) {
  const [customers, setCustomers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [declarations, setDeclarations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [tracking, setTracking] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All time");

  const getStoredUser = () => {
    try {
      const saved = localStorage.getItem("user");

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Unable to read stored user:", error);
    }

    return {};
  };

  const storedUser = getStoredUser();

  const currentUser = {
    ...storedUser,
    ...(user || {}),
    email:
      user?.email ||
      storedUser?.email ||
      localStorage.getItem("userEmail") ||
      "customs@sac.co.za",
    full_name:
      user?.full_name ||
      storedUser?.full_name ||
      user?.name ||
      storedUser?.name ||
      "Customs Officer",
    role:
      user?.role ||
      storedUser?.role ||
      localStorage.getItem("role") ||
      "CUSTOMS_OFFICER",
  };

  const token = localStorage.getItem("token");

  const role = String(
    currentUser.role || "CUSTOMS_OFFICER"
  ).toUpperCase();

  const headers = {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };

  const icons = {
    dashboard: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </svg>
    ),

    customers: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 20c.5-3.4 2.4-5.3 5.5-5.3s5 1.9 5.5 5.3" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M15.2 14.8c2.8-.2 4.5 1.4 5.2 4.4" />
      </svg>
    ),

    shipments: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M3 6.5 12 3l9 3.5v11L12 21l-9-3.5v-11Z" />
        <path d="M3 6.5 12 10l9-3.5M12 10v11" />
        <path d="m8 5 9 3.5" />
      </svg>
    ),

    documents: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M6 3h8l5 5v13H6V3Z" />
        <path d="M14 3v6h5M9 13h6M9 17h6" />
      </svg>
    ),

    declarations: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="2.5" />
        <path d="M8 7h8M8 11h8M8 15h4" />
        <path d="m15 16 1.5 1.5L20 14" />
      </svg>
    ),

    payments: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3 9h18M7 14h3" />
        <circle cx="16.5" cy="14" r="2" />
      </svg>
    ),

    tracking: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
        <path d="M5 19h14" />
      </svg>
    ),

    notifications: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
        <path d="M10 21h4" />
      </svg>
    ),

    audit: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 3 5 6v5c0 4.7 2.7 8 7 10 4.3-2 7-5.3 7-10V6l-7-3Z" />
        <path d="M9 12h6M9 9h6M9 15h4" />
      </svg>
    ),

    settings: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4v-2.5h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V4h2.5v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.5h-.2a1.7 1.7 0 0 0-1.6 1Z" />
      </svg>
    ),

    logout: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" />
        <path d="M14 8l4 4-4 4M18 12H8" />
      </svg>
    ),

    plus: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),

    refresh: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M20 11a8 8 0 0 0-14.8-3L3 11" />
        <path d="M3 5v6h6" />
        <path d="M4 13a8 8 0 0 0 14.8 3L21 13" />
        <path d="M21 19v-6h-6" />
      </svg>
    ),

    users: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M3.5 20c.5-3.4 2.4-5.2 5.5-5.2s5 1.8 5.5 5.2" />
        <path d="M14.5 15c2.5-.2 4.2 1.3 5 4" />
      </svg>
    ),

    activity: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M3 12h4l2-6 4 12 2-6h6" />
      </svg>
    ),

    search: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 5 5" />
      </svg>
    ),

    arrow: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    ),

    database: (
      <svg viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
      </svg>
    ),

    shield: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 3 5 6v5c0 4.7 2.7 8 7 10 4.3-2 7-5.3 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  };

  const sidebarItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: icons.dashboard,
    },
    {
      key: "customers",
      label: "Customers",
      icon: icons.customers,
    },
    {
      key: "shipments",
      label: "Shipments",
      icon: icons.shipments,
    },
    {
      key: "documents",
      label: "Documents",
      icon: icons.documents,
    },
    {
      key: "declarations",
      label: "Declarations",
      icon: icons.declarations,
    },
    {
      key: "payments",
      label: "Payments",
      icon: icons.payments,
    },
    {
      key: "tracking",
      label: "Tracking",
      icon: icons.tracking,
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: icons.notifications,
    },
    {
      key: "audit",
      label: "Audit Logs",
      icon: icons.audit,
    },
    {
      key: "settings",
      label: "Settings",
      icon: icons.settings,
    },
  ];

  const allowedPages = useMemo(() => {
    if (
      role === "IT_ADMIN" ||
      role === "ADMIN" ||
      role === "ADMINISTRATOR" ||
      role === "OPS_MANAGER"
    ) {
      return [
        "dashboard",
        "customers",
        "shipments",
        "documents",
        "declarations",
        "payments",
        "tracking",
        "notifications",
        "audit",
        "settings",
      ];
    }

    if (role === "FINANCE_OFFICER") {
      return [
        "dashboard",
        "customers",
        "shipments",
        "documents",
        "declarations",
        "payments",
        "tracking",
        "notifications",
        "audit",
      ];
    }

    if (role === "CUSTOMS_OFFICER") {
      return [
        "dashboard",
        "customers",
        "shipments",
        "documents",
        "declarations",
        "tracking",
        "notifications",
        "audit",
      ];
    }

    return [
      "dashboard",
      "customers",
      "shipments",
      "documents",
      "declarations",
      "tracking",
      "notifications",
      "audit",
    ];
  }, [role]);

  const visibleSidebarItems = sidebarItems.filter((item) =>
    allowedPages.includes(item.key)
  );

  const getArray = (payload) => {
    if (Array.isArray(payload)) return payload;

    if (Array.isArray(payload?.data)) return payload.data;

    if (Array.isArray(payload?.items)) return payload.items;

    if (Array.isArray(payload?.results)) return payload.results;

    if (Array.isArray(payload?.customers)) return payload.customers;

    if (Array.isArray(payload?.shipments)) return payload.shipments;

    if (Array.isArray(payload?.documents)) return payload.documents;

    if (Array.isArray(payload?.declarations))
      return payload.declarations;

    if (Array.isArray(payload?.payments)) return payload.payments;

    if (Array.isArray(payload?.users)) return payload.users;

    if (Array.isArray(payload?.tracking)) return payload.tracking;

    if (Array.isArray(payload?.auditLogs))
      return payload.auditLogs;

    return [];
  };

  const fetchResource = async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers,
      });

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          data: [],
        };
      }

      const payload = await response.json();

      return {
        ok: true,
        status: response.status,
        data: getArray(payload),
      };
    } catch (error) {
      console.error(`Error loading ${endpoint}:`, error);

      return {
        ok: false,
        status: 0,
        data: [],
      };
    }
  };

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const requests = [];

      if (allowedPages.includes("customers")) {
        requests.push([
          "customers",
          fetchResource("/customers"),
        ]);
      }

      if (allowedPages.includes("shipments")) {
        requests.push([
          "shipments",
          fetchResource("/shipments"),
        ]);
      }

      if (allowedPages.includes("documents")) {
        requests.push([
          "documents",
          fetchResource("/documents"),
        ]);
      }

      if (allowedPages.includes("declarations")) {
        requests.push([
          "declarations",
          fetchResource("/declarations"),
        ]);
      }

      if (allowedPages.includes("payments")) {
        requests.push([
          "payments",
          fetchResource("/payments"),
        ]);
      }

      if (allowedPages.includes("tracking")) {
        requests.push([
          "tracking",
          fetchResource("/shipment-tracking"),
        ]);
      }

      if (allowedPages.includes("audit")) {
        requests.push([
          "auditLogs",
          fetchResource("/audit-logs"),
        ]);
      }

      if (
        role === "IT_ADMIN" ||
        role === "ADMIN" ||
        role === "ADMINISTRATOR" ||
        role === "OPS_MANAGER"
      ) {
        requests.push([
          "users",
          fetchResource("/users"),
        ]);
      }

      const results = await Promise.all(
        requests.map(async ([key, promise]) => {
          const result = await promise;
          return [key, result];
        })
      );

      let successfulRequest = false;

      results.forEach(([key, result]) => {
        if (result.ok) {
          successfulRequest = true;
        }

        if (key === "customers") {
          setCustomers(result.data);
        }

        if (key === "shipments") {
          setShipments(result.data);
        }

        if (key === "documents") {
          setDocuments(result.data);
        }

        if (key === "declarations") {
          setDeclarations(result.data);
        }

        if (key === "payments") {
          setPayments(result.data);
        }

        if (key === "tracking") {
          setTracking(result.data);
        }

        if (key === "auditLogs") {
          setAuditLogs(result.data);
        }

        if (key === "users") {
          setUsers(result.data);
        }
      });

      setBackendOnline(successfulRequest);
    } catch (error) {
      console.error("Dashboard loading error:", error);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [allowedPages]);

  const formatRole = (value) => {
    return String(value || "")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const parsed = new Date(
      String(value).replace(" ", "T")
    );

    if (Number.isNaN(parsed.getTime())) {
      return String(value).split(" ")[0];
    }

    return parsed.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getDateValue = (item) => {
    if (!item) return 0;

    const date =
      item.created_at ||
      item.createdAt ||
      item.updated_at ||
      item.updatedAt ||
      item.date ||
      item.timestamp;

    const parsed = new Date(
      String(date || "").replace(" ", "T")
    );

    return Number.isNaN(parsed.getTime())
      ? 0
      : parsed.getTime();
  };

  const getLatest = (array) => {
    if (!Array.isArray(array) || array.length === 0) {
      return null;
    }

    return [...array].sort(
      (a, b) =>
        getDateValue(b) - getDateValue(a)
    )[0];
  };

  const getCount = (array, fallback) => {
    if (
      Array.isArray(array) &&
      array.length > 0
    ) {
      return array.length;
    }

    return fallback || 0;
  };

  const customerCount = getCount(
    customers,
    initialCustomers
  );

  const shipmentCount = getCount(
    shipments,
    initialShipments
  );

  const documentCount = getCount(
    documents,
    initialDocuments
  );

  const declarationCount = getCount(
    declarations,
    initialDeclarations
  );

  const paymentCount = getCount(
    payments,
    initialPayments
  );

  const trackingCount =
    tracking.length > 0
      ? tracking.length
      : shipmentCount;

  const userCount =
    users.length > 0
      ? users.length
      : initialUsers;

  const statusData = useMemo(() => {
    const counts = {};

    shipments.forEach((shipment) => {
      const status = String(
        shipment.status ||
          shipment.shipment_status ||
          "UNKNOWN"
      ).toUpperCase();

      counts[status] =
        (counts[status] || 0) + 1;
    });

    const total = shipments.length;

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([status, count]) => ({
        status,
        count,
        percentage:
          total > 0
            ? Math.round(
                (count / total) * 100
              )
            : 0,
      }));
  }, [shipments]);

  const recentActivities = useMemo(() => {
    const activities = [];

    shipments.slice(0, 10).forEach((item) => {
      activities.push({
        type: "Shipment",
        title:
          item.shipment_number ||
          item.reference_number ||
          `Shipment #${item.id}`,
        status:
          item.status || "REGISTERED",
        date:
          item.updated_at ||
          item.created_at ||
          item.updatedAt ||
          item.createdAt,
        icon: icons.shipments,
      });
    });

    documents.slice(0, 10).forEach((item) => {
      activities.push({
        type: "Document",
        title:
          item.document_number ||
          item.file_name ||
          `Document #${item.id}`,
        status:
          item.status || "UPLOADED",
        date:
          item.updated_at ||
          item.created_at ||
          item.updatedAt ||
          item.createdAt,
        icon: icons.documents,
      });
    });

    declarations.slice(0, 10).forEach((item) => {
      activities.push({
        type: "Declaration",
        title:
          item.declaration_number ||
          `Declaration #${item.id}`,
        status:
          item.status || "DRAFT",
        date:
          item.updated_at ||
          item.created_at ||
          item.updatedAt ||
          item.createdAt,
        icon: icons.declarations,
      });
    });

    auditLogs.slice(0, 10).forEach((item) => {
      activities.push({
        type: "Audit",
        title:
          item.action ||
          item.activity ||
          item.description ||
          "System activity",
        status:
          item.status || "RECORDED",
        date:
          item.created_at ||
          item.timestamp ||
          item.date,
        icon: icons.audit,
      });
    });

    return activities
      .sort(
        (a, b) =>
          getDateValue(b) -
          getDateValue(a)
      )
      .slice(0, 5);
  }, [
    shipments,
    documents,
    declarations,
    auditLogs,
  ]);

  const filteredMasterRecords = useMemo(() => {
    const records = [
      {
        key: "customers",
        label: "Customers",
        value: customerCount,
        date: getLatest(customers),
        page: "customers",
        icon: icons.customers,
      },
      {
        key: "shipments",
        label: "Shipments",
        value: shipmentCount,
        date: getLatest(shipments),
        page: "shipments",
        icon: icons.shipments,
      },
      {
        key: "documents",
        label: "Documents",
        value: documentCount,
        date: getLatest(documents),
        page: "documents",
        icon: icons.documents,
      },
      {
        key: "declarations",
        label: "Declarations",
        value: declarationCount,
        date: getLatest(declarations),
        page: "declarations",
        icon: icons.declarations,
      },
      {
        key: "payments",
        label: "Payments",
        value: paymentCount,
        date: getLatest(payments),
        page: "payments",
        icon: icons.payments,
      },
      {
        key: "tracking",
        label: "Tracking",
        value: trackingCount,
        date: getLatest(tracking),
        page: "tracking",
        icon: icons.tracking,
      },
    ];

    return records.filter((record) => {
      if (
        !allowedPages.includes(record.page)
      ) {
        return false;
      }

      if (!search.trim()) {
        return true;
      }

      return record.label
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [
    search,
    customerCount,
    shipmentCount,
    documentCount,
    declarationCount,
    paymentCount,
    trackingCount,
    customers,
    shipments,
    documents,
    declarations,
    payments,
    tracking,
    allowedPages,
  ]);

  const quickAccess = sidebarItems.filter(
    (item) =>
      item.key !== "dashboard" &&
      allowedPages.includes(item.key) &&
      item.key !== "settings"
  );

  const handleNavigate = (page) => {
    if (!allowedPages.includes(page)) {
      return;
    }

    if (typeof onNavigate === "function") {
      onNavigate(page);
    }
  };

  const handleRefresh = async () => {
    await loadDashboard();

    if (typeof onRefresh === "function") {
      onRefresh();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");

    window.location.reload();
  };

  const cycleFilter = () => {
    const options = [
      "All time",
      "Today",
      "7 days",
      "30 days",
    ];

    const currentIndex =
      options.indexOf(filter);

    setFilter(
      options[
        (currentIndex + 1) %
          options.length
      ]
    );
  };

  const displayName =
    currentUser.full_name ||
    currentUser.name ||
    currentUser.username ||
    "Customs Officer";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) =>
      name.charAt(0).toUpperCase()
    )
    .join("");

  return (
    <div className="sac-dashboard">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .sac-dashboard {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(0, 229, 255, 0.10),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 20%,
              rgba(125, 70, 255, 0.12),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #080b19 0%,
              #0c1021 48%,
              #080a15 100%
            );
          color: #f5f7ff;
          font-family:
            Inter,
            "Segoe UI",
            Arial,
            sans-serif;
          display: flex;
          overflow-x: hidden;
        }

        /* ==============================
           SIDEBAR
        ============================== */

        .sac-sidebar {
          width: 82px;
          height: 100vh;
          min-height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 10px;
          background: rgba(8, 11, 25, 0.97);
          border-right: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          overflow: hidden;
        }

        .sac-logo {
          width: 48px;
          height: 48px;
          min-width: 48px;
          min-height: 48px;
          flex-shrink: 0;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 25px;
          background:
            linear-gradient(
              135deg,
              #00e5ff,
              #4266ff
            );
          box-shadow:
            0 8px 28px
            rgba(0,229,255,0.25);
          color: white;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .sac-nav {
          display: flex;
          flex-direction: column;
          gap: 7px;
          width: 100%;
          align-items: center;
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 2px 0 12px;
          scrollbar-width: none;
        }

        .sac-nav::-webkit-scrollbar {
          display: none;
        }

        .sac-nav-button {
          width: 54px;
          height: 54px;
          min-width: 54px;
          min-height: 54px;
          flex-shrink: 0;
          border: 1px solid transparent;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: #8790aa;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .sac-nav-button svg {
          width: 22px;
          height: 22px;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .sac-nav-button:hover {
          color: #ffffff;
          background:
            rgba(0,229,255,0.08);
          border-color:
            rgba(0,229,255,0.15);
          transform:
            translateY(-1px);
        }

        .sac-nav-button.active {
          color: #00e5ff;
          background:
            linear-gradient(
              135deg,
              rgba(0,229,255,0.18),
              rgba(66,102,255,0.16)
            );
          border-color:
            rgba(0,229,255,0.28);
          box-shadow:
            inset 0 0 20px
            rgba(0,229,255,0.05),
            0 8px 22px
            rgba(0,229,255,0.08);
        }

        .sac-nav-button.active::before {
          content: "";
          position: absolute;
          left: -10px;
          width: 3px;
          height: 24px;
          border-radius: 5px;
          background: #00e5ff;
          box-shadow:
            0 0 12px #00e5ff;
        }

        /* ==============================
           BOTTOM BUTTON AREA
        ============================== */

        .sac-sidebar-bottom {
          width: 100%;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding-top: 12px;
          border-top:
            1px solid rgba(255,255,255,0.08);
          background:
            rgba(8,11,25,0.98);
        }

        .sac-sidebar-bottom .sac-nav-button {
          display: flex;
        }

        .sac-sidebar-bottom .logout-button {
          color: #ff6b81;
        }

        .sac-sidebar-bottom .logout-button:hover {
          color: #ffffff;
          background:
            rgba(255,77,103,0.14);
          border-color:
            rgba(255,77,103,0.30);
          box-shadow:
            0 0 18px
            rgba(255,77,103,0.12);
        }

        .sac-sidebar-bottom .logout-button svg {
          stroke-width: 2;
        }

        .sac-main {
          width: calc(100% - 82px);
          margin-left: 82px;
          min-height: 100vh;
        }

        .sac-header {
          min-height: 86px;
          padding: 18px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom:
            1px solid rgba(255,255,255,0.07);
          background:
            rgba(7, 10, 22, 0.66);
          backdrop-filter: blur(18px);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .sac-title h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 750;
          letter-spacing: -0.4px;
        }

        .sac-title p {
          margin: 5px 0 0;
          color: #8d96ae;
          font-size: 12px;
        }

        .sac-header-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .sac-status {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: #aab3ca;
        }

        .sac-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #20e39a;
          box-shadow:
            0 0 10px
            rgba(32,227,154,0.8);
        }

        .sac-status-dot.offline {
          background: #ff5d73;
          box-shadow:
            0 0 10px
            rgba(255,93,115,0.7);
        }

        .sac-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 15px;
          border-left:
            1px solid rgba(255,255,255,0.08);
        }

        .sac-avatar {
          width: 39px;
          height: 39px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              #166dff,
              #00c8ff
            );
          font-weight: 800;
          font-size: 12px;
          box-shadow:
            0 7px 20px
            rgba(0,180,255,0.18);
        }

        .sac-user-info strong {
          display: block;
          font-size: 12px;
          color: #f3f5ff;
        }

        .sac-user-info span {
          display: block;
          margin-top: 3px;
          font-size: 10px;
          color: #7f89a3;
        }

        .sac-content {
          padding: 28px 30px 45px;
        }

        .sac-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 15px;
        }

        .sac-section-heading h2 {
          margin: 0;
          font-size: 17px;
          font-weight: 700;
        }

        .sac-section-heading p {
          margin: 5px 0 0;
          font-size: 11px;
          color: #737d98;
        }

        .sac-toolbar-actions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .sac-search {
          height: 39px;
          width: 210px;
          border:
            1px solid rgba(255,255,255,0.08);
          border-radius: 11px;
          background:
            rgba(255,255,255,0.035);
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 11px;
        }

        .sac-search svg {
          width: 17px;
          height: 17px;
          stroke: #71809d;
          stroke-width: 1.8;
          stroke-linecap: round;
        }

        .sac-search input {
          width: 100%;
          border: 0;
          outline: none;
          color: white;
          background: transparent;
          font-size: 11px;
        }

        .sac-search input::placeholder {
          color: #66718c;
        }

        .sac-action-button {
          height: 39px;
          border-radius: 11px;
          padding: 0 13px;
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          color: #d9e1f7;
          border:
            1px solid rgba(255,255,255,0.09);
          background:
            rgba(255,255,255,0.04);
          font-size: 11px;
          transition: 0.2s ease;
        }

        .sac-action-button:hover {
          border-color:
            rgba(0,229,255,0.25);
          background:
            rgba(0,229,255,0.07);
        }

        .sac-action-button svg {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .sac-action-button.primary {
          color: #06101b;
          background:
            linear-gradient(
              135deg,
              #00e5ff,
              #4c82ff
            );
          border: none;
          font-weight: 700;
        }

        .sac-analytics {
          display: grid;
          grid-template-columns:
            1.45fr 0.8fr 0.95fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .sac-card {
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,0.055),
              rgba(255,255,255,0.025)
            );
          border:
            1px solid rgba(255,255,255,0.075);
          border-radius: 18px;
          box-shadow:
            0 16px 45px
            rgba(0,0,0,0.16);
          backdrop-filter: blur(14px);
        }

        .sac-chart-card {
          padding: 20px;
          min-height: 245px;
        }

        .sac-card-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .sac-card-heading h3 {
          margin: 0;
          font-size: 12px;
          font-weight: 700;
        }

        .sac-card-heading span {
          font-size: 10px;
          color: #68748f;
        }

        .sac-line-chart {
          width: 100%;
          height: 175px;
        }

        .sac-line-chart polyline {
          fill: none;
          stroke: #00dfff;
          stroke-width: 2.3;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter:
            drop-shadow(
              0 0 5px
              rgba(0,229,255,0.5)
            );
        }

        .sac-line-chart circle {
          fill: #00e5ff;
          stroke: #08101f;
          stroke-width: 2;
        }

        .sac-grid-line {
          stroke:
            rgba(255,255,255,0.07);
          stroke-width: 1;
        }

        .sac-chart-label {
          fill: #65718b;
          font-size: 8px;
        }

        .sac-donut-wrap {
          min-height: 245px;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .sac-donut-area {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          gap: 22px;
        }

        .sac-donut {
          width: 125px;
          height: 125px;
          border-radius: 50%;
          background:
            conic-gradient(
              #00e5ff 0deg,
              #00e5ff var(--first),
              #486fff var(--first),
              #486fff
                calc(
                  var(--first) +
                  var(--second)
                ),
              rgba(255,255,255,0.07)
                calc(
                  var(--first) +
                  var(--second)
                ),
              rgba(255,255,255,0.07)
                360deg
            );
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 28px
            rgba(0,229,255,0.08);
        }

        .sac-donut::after {
          content: "";
          width: 83px;
          height: 83px;
          border-radius: 50%;
          background: #101426;
          position: absolute;
        }

        .sac-donut-center {
          z-index: 2;
          text-align: center;
        }

        .sac-donut-center strong {
          display: block;
          font-size: 20px;
        }

        .sac-donut-center span {
          color: #68748d;
          font-size: 8px;
        }

        .sac-legend {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sac-legend-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 9px;
          color: #909ab2;
        }

        .sac-legend-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .sac-legend-dot.cyan {
          background: #00e5ff;
          box-shadow:
            0 0 7px
            rgba(0,229,255,0.7);
        }

        .sac-legend-dot.blue {
          background: #486fff;
          box-shadow:
            0 0 7px
            rgba(72,111,255,0.7);
        }

        .sac-activity {
          min-height: 245px;
          padding: 20px;
        }

        .sac-activity-list {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .sac-activity-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 10px;
          background:
            rgba(255,255,255,0.025);
        }

        .sac-activity-icon {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00e5ff;
          background:
            rgba(0,229,255,0.07);
        }

        .sac-activity-icon svg {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .sac-activity-main {
          flex: 1;
          min-width: 0;
        }

        .sac-activity-main strong {
          display: block;
          font-size: 9px;
          color: #dce3f6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sac-activity-main span {
          display: block;
          margin-top: 3px;
          color: #69748e;
          font-size: 8px;
        }

        .sac-activity-status {
          font-size: 8px;
          color: #20e39a;
          text-transform: uppercase;
        }

        .sac-empty {
          color: #66718a;
          font-size: 10px;
          padding: 25px 0;
          text-align: center;
        }

        .sac-record-card {
          margin-top: 16px;
          overflow: hidden;
        }

        .sac-record-header {
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom:
            1px solid rgba(255,255,255,0.06);
        }

        .sac-record-header h3 {
          margin: 0;
          font-size: 12px;
        }

        .sac-record-header span {
          color: #66728d;
          font-size: 9px;
        }

        .sac-table {
          width: 100%;
          border-collapse: collapse;
        }

        .sac-table th {
          padding: 12px 20px;
          text-align: left;
          color: #626d87;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          font-weight: 700;
          background:
            rgba(255,255,255,0.018);
        }

        .sac-table td {
          padding: 13px 20px;
          border-top:
            1px solid rgba(255,255,255,0.045);
          color: #b7c0d5;
          font-size: 10px;
        }

        .sac-record-name {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #e5e9f5;
          font-weight: 600;
        }

        .sac-record-icon {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00e5ff;
          background:
            rgba(0,229,255,0.06);
        }

        .sac-record-icon svg {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .sac-count {
          color: #ffffff !important;
          font-weight: 750;
          font-size: 13px !important;
        }

        .sac-view-button {
          background: transparent;
          border: 0;
          color: #00dfff;
          font-size: 9px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .sac-view-button svg {
          width: 13px;
          height: 13px;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .sac-lower-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }

        .sac-team-card,
        .sac-quick-card {
          padding: 20px;
        }

        .sac-team-header,
        .sac-quick-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .sac-team-header h3,
        .sac-quick-header h3 {
          margin: 0;
          font-size: 12px;
        }

        .sac-team-header button,
        .sac-quick-header button {
          border: 0;
          background: transparent;
          color: #00dfff;
          cursor: pointer;
          font-size: 9px;
        }

        .sac-team-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .sac-team-member {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px;
          border-radius: 11px;
          background:
            rgba(255,255,255,0.025);
        }

        .sac-team-avatar {
          width: 34px;
          height: 34px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              #243cff,
              #00c8ff
            );
          font-size: 10px;
          font-weight: 800;
        }

        .sac-team-info {
          flex: 1;
          min-width: 0;
        }

        .sac-team-info strong {
          display: block;
          font-size: 10px;
          color: #e3e8f7;
        }

        .sac-team-info span {
          display: block;
          font-size: 8px;
          margin-top: 3px;
          color: #6d7892;
        }

        .sac-team-status {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #20e39a;
          box-shadow:
            0 0 8px
            rgba(32,227,154,0.7);
        }

        .sac-quick-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 9px;
        }

        .sac-quick-item {
          min-height: 75px;
          border-radius: 13px;
          border:
            1px solid rgba(255,255,255,0.055);
          background:
            rgba(255,255,255,0.025);
          color: #8791aa;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: 0.2s ease;
        }

        .sac-quick-item:hover {
          transform: translateY(-2px);
          color: #00e5ff;
          border-color:
            rgba(0,229,255,0.2);
          background:
            rgba(0,229,255,0.05);
        }

        .sac-quick-item svg {
          width: 21px;
          height: 21px;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .sac-quick-item span {
          font-size: 8px;
        }

        .sac-admin-card {
          margin-top: 16px;
          padding: 20px;
        }

        .sac-admin-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 10px;
        }

        .sac-admin-item {
          border-radius: 12px;
          padding: 13px;
          background:
            rgba(255,255,255,0.025);
          border:
            1px solid rgba(255,255,255,0.045);
          cursor: pointer;
          color: #8993ad;
          transition: 0.2s ease;
        }

        .sac-admin-item:hover {
          color: #00e5ff;
          border-color:
            rgba(0,229,255,0.18);
        }

        .sac-admin-item svg {
          width: 19px;
          height: 19px;
          stroke: currentColor;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
          margin-bottom: 8px;
        }

        .sac-admin-item strong {
          display: block;
          color: #cbd3e7;
          font-size: 9px;
        }

        .sac-admin-item span {
          display: block;
          margin-top: 4px;
          font-size: 8px;
          color: #606b84;
        }

        .sac-footer {
          padding: 20px 0 5px;
          text-align: center;
          color: #4f5971;
          font-size: 8px;
        }

        @media (max-width: 1150px) {
          .sac-analytics {
            grid-template-columns: 1fr 1fr;
          }

          .sac-activity {
            grid-column: span 2;
          }
        }

        @media (max-width: 850px) {
          .sac-sidebar {
            width: 65px;
          }

          .sac-main {
            width: calc(100% - 65px);
            margin-left: 65px;
          }

          .sac-content {
            padding: 20px;
          }

          .sac-header {
            padding: 15px 20px;
          }

          .sac-lower-grid {
            grid-template-columns: 1fr;
          }

          .sac-admin-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .sac-quick-grid {
            grid-template-columns:
              repeat(4, 1fr);
          }
        }

        @media (max-width: 650px) {
          .sac-analytics {
            grid-template-columns: 1fr;
          }

          .sac-activity {
            grid-column: span 1;
          }

          .sac-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .sac-toolbar-actions {
            flex-wrap: wrap;
          }

          .sac-search {
            width: 100%;
          }

          .sac-header-right
          .sac-status {
            display: none;
          }

          .sac-user-info {
            display: none;
          }

          .sac-table {
            min-width: 650px;
          }

          .sac-record-card {
            overflow-x: auto;
          }

          .sac-quick-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="sac-sidebar">
        <div className="sac-logo">
          SCA
        </div>

        <nav className="sac-nav">
          {visibleSidebarItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`sac-nav-button ${
                item.key === "dashboard"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigate(item.key)
              }
              title={item.label}
              aria-label={item.label}
            >
              {item.icon}
            </button>
          ))}
        </nav>

        {/* FIXED BOTTOM BUTTONS */}
        <div className="sac-sidebar-bottom">
          <button
            type="button"
            className="sac-nav-button"
            onClick={handleRefresh}
            title="Refresh Dashboard"
            aria-label="Refresh Dashboard"
          >
            {icons.refresh}
          </button>

          <button
            type="button"
            className="sac-nav-button logout-button"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            {icons.logout}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="sac-main">
        {/* HEADER */}
        <header className="sac-header">
          <div className="sac-title">
            <h1>
              SAC Customs Management System
            </h1>

            <p>
              Customs & Logistics Management
              Platform
            </p>
          </div>

          <div className="sac-header-right">
            <div className="sac-status">
              <span
                className={`sac-status-dot ${
                  !backendOnline
                    ? "offline"
                    : ""
                }`}
              />

              {backendOnline
                ? "System Online"
                : "System Offline"}
            </div>

            <div className="sac-user">
              <div className="sac-avatar">
                {initials || "CO"}
              </div>

              <div className="sac-user-info">
                <strong>
                  {currentUser.email}
                </strong>

                <span>
                  {formatRole(role)} • Logged In ✓
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="sac-content">
          {/* TOOLBAR */}
          <div className="sac-toolbar">
            <div className="sac-section-heading">
              <h2>Data Analytics</h2>

              <p>
                Real-time overview of customs
                and logistics operations
              </p>
            </div>

            <div className="sac-toolbar-actions">
              <div className="sac-search">
                {icons.search}

                <input
                  type="text"
                  placeholder="Search dashboard..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              <button
                type="button"
                className="sac-action-button"
                onClick={cycleFilter}
              >
                {filter}
              </button>

              <button
                type="button"
                className="sac-action-button"
                onClick={handleRefresh}
              >
                {icons.refresh}
                Refresh
              </button>

              {allowedPages.includes(
                "customers"
              ) && (
                <button
                  type="button"
                  className="sac-action-button primary"
                  onClick={() =>
                    handleNavigate(
                      "customers"
                    )
                  }
                >
                  {icons.plus}
                  Add New
                </button>
              )}
            </div>
          </div>

          {/* ANALYTICS */}
          <section className="sac-analytics">
            {/* LINE CHART */}
            <div className="sac-card sac-chart-card">
              <div className="sac-card-heading">
                <h3>
                  Operational Activity
                </h3>

                <span>{filter}</span>
              </div>

              <svg
                className="sac-line-chart"
                viewBox="0 0 600 180"
                preserveAspectRatio="none"
              >
                <line
                  className="sac-grid-line"
                  x1="20"
                  y1="30"
                  x2="580"
                  y2="30"
                />

                <line
                  className="sac-grid-line"
                  x1="20"
                  y1="70"
                  x2="580"
                  y2="70"
                />

                <line
                  className="sac-grid-line"
                  x1="20"
                  y1="110"
                  x2="580"
                  y2="110"
                />

                <line
                  className="sac-grid-line"
                  x1="20"
                  y1="150"
                  x2="580"
                  y2="150"
                />

                <polyline points="25,140 130,120 235,128 340,82 445,95 570,50" />

                <circle
                  cx="25"
                  cy="140"
                  r="4"
                />

                <circle
                  cx="130"
                  cy="120"
                  r="4"
                />

                <circle
                  cx="235"
                  cy="128"
                  r="4"
                />

                <circle
                  cx="340"
                  cy="82"
                  r="4"
                />

                <circle
                  cx="445"
                  cy="95"
                  r="4"
                />

                <circle
                  cx="570"
                  cy="50"
                  r="4"
                />

                <text
                  className="sac-chart-label"
                  x="20"
                  y="174"
                >
                  Jan
                </text>

                <text
                  className="sac-chart-label"
                  x="125"
                  y="174"
                >
                  Feb
                </text>

                <text
                  className="sac-chart-label"
                  x="230"
                  y="174"
                >
                  Mar
                </text>

                <text
                  className="sac-chart-label"
                  x="335"
                  y="174"
                >
                  Apr
                </text>

                <text
                  className="sac-chart-label"
                  x="440"
                  y="174"
                >
                  May
                </text>

                <text
                  className="sac-chart-label"
                  x="555"
                  y="174"
                >
                  Jun
                </text>
              </svg>
            </div>

            {/* STATUS */}
            <div className="sac-card sac-donut-wrap">
              <div className="sac-card-heading">
                <h3>
                  Shipment Status
                </h3>

                <span>Live</span>
              </div>

              <div className="sac-donut-area">
                <div
                  className="sac-donut"
                  style={{
                    "--first": `${
                      statusData[0]
                        ?.percentage *
                        3.6 || 0
                    }deg`,
                    "--second": `${
                      statusData[1]
                        ?.percentage *
                        3.6 || 0
                    }deg`,
                  }}
                >
                  <div className="sac-donut-center">
                    <strong>
                      {shipmentCount}
                    </strong>

                    <span>
                      Shipments
                    </span>
                  </div>
                </div>

                <div className="sac-legend">
                  {statusData.length >
                  0 ? (
                    statusData.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          className="sac-legend-item"
                          key={
                            item.status
                          }
                        >
                          <span
                            className={`sac-legend-dot ${
                              index ===
                              0
                                ? "cyan"
                                : "blue"
                            }`}
                          />

                          <span>
                            {
                              item.status
                            }{" "}
                            {
                              item.percentage
                            }
                            %
                          </span>
                        </div>
                      )
                    )
                  ) : (
                    <div className="sac-legend-item">
                      No shipment data
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="sac-card sac-activity">
              <div className="sac-card-heading">
                <h3>
                  Recent Activity
                </h3>

                <span>Latest</span>
              </div>

              <div className="sac-activity-list">
                {recentActivities.length >
                0 ? (
                  recentActivities.map(
                    (
                      activity,
                      index
                    ) => (
                      <div
                        className="sac-activity-row"
                        key={`${activity.type}-${index}`}
                      >
                        <div className="sac-activity-icon">
                          {
                            activity.icon
                          }
                        </div>

                        <div className="sac-activity-main">
                          <strong>
                            {
                              activity.title
                            }
                          </strong>

                          <span>
                            {
                              activity.type
                            }{" "}
                            •{" "}
                            {formatDate(
                              activity.date
                            )}
                          </span>
                        </div>

                        <div className="sac-activity-status">
                          {
                            activity.status
                          }
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="sac-empty">
                    No recent activity
                    recorded
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* MASTER RECORD */}
          <section className="sac-card sac-record-card">
            <div className="sac-record-header">
              <div>
                <h3>
                  Master Record
                </h3>

                <span>
                  Current system records
                  and operational data
                </span>
              </div>
              <span>{filter}</span>
            </div>
            <table className="sac-table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Records</th>
                  <th>
                    Latest Activity
                  </th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMasterRecords.map(
                  (record) => (
                    <tr
                      key={record.key}
                    >
                      <td>
                        <div className="sac-record-name">
                          <div className="sac-record-icon">
                            {
                              record.icon
                            }
                          </div>
                          {
                            record.label
                          }
                        </div>
                      </td>
                      <td className="sac-count">
                        {loading
                          ? "..."
                          : record.value}
                      </td>
                      <td>
                        {record.date
                          ? formatDate(
                              record.date
                                .created_at ||
                                record.date
                                  .updated_at ||
                                record.date
                                  .createdAt ||
                                record.date
                                  .updatedAt ||
                                record.date
                                  .date
                            )
                          : "—"}
                      </td>
                      <td>
                        <span
                          style={{
                            color:
                              backendOnline
                                ? "#20e39a"
                                : "#ff5d73",
                          }}
                        >
                          {backendOnline
                            ? "Connected"
                            : "Offline"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="sac-view-button"
                          onClick={() =>
                            handleNavigate(
                              record.page
                            )
                          }
                        >
                          View
                          {
                            icons.arrow
                          }
                        </button>
                      </td>
                    </tr>
                  )
                )}
                {filteredMasterRecords.length ===
                  0 && (
                  <tr>
                    <td colSpan="5">
                      <div className="sac-empty">
                        No dashboard records
                        found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
          {/* LOWER SECTION */}
          <section className="sac-lower-grid">
            {/* TEAM MEMBERS */}
            <div className="sac-card sac-team-card">
              <div className="sac-team-header">
                <h3>
                  Team Members
                </h3>
                {allowedPages.includes(
                  "users"
                ) && (
                  <button
                    type="button"
                    onClick={() =>
                      handleNavigate(
                        "users"
                      )
                    }
                  >
                    View All Users
                  </button>
                )}
              </div>
              <div className="sac-team-list">
                {users.length > 0 ? (
                  users
                    .slice(0, 4)
                    .map(
                      (teamUser) => {
                        const name =
                          teamUser.full_name ||
                          teamUser.name ||
                          teamUser.username ||
                          "System User";

                        const teamInitials =
                          name
                            .split(
                              " "
                            )
                            .filter(
                              Boolean
                            )
                            .slice(
                              0,
                              2
                            )
                            .map(
                              (
                                part
                              ) =>
                                part
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()
                            )
                            .join("");

                        return (
                          <div
                            className="sac-team-member"
                            key={
                              teamUser.id ||
                              teamUser.username
                            }
                          >
                            <div className="sac-team-avatar">
                              {teamInitials ||
                                "U"}
                            </div>
                            <div className="sac-team-info">
                              <strong>
                                {name}
                              </strong>
                              <span>
                                {formatRole(
                                  teamUser.role ||
                                    "USER"
                                )}
                              </span>
                            </div>
                            <span className="sac-team-status" />
                          </div>
                        );
                      }
                    )
                ) : (
                  <div className="sac-team-member">
                    <div className="sac-team-avatar">
                      {initials ||
                        "CO"}
                    </div>
                    <div className="sac-team-info">
                      <strong>
                        {displayName}{" "}
                        <span>
                          (You)
                        </span>
                      </strong>
                      <span>
                        {formatRole(
                          role
                        )}
                      </span>
                    </div>
                    <span className="sac-team-status" />
                  </div>
                )}
              </div>
            </div>
            {/* QUICK ACCESS */}
            <div className="sac-card sac-quick-card">
              <div className="sac-quick-header">
                <h3>
                  Quick Access
                </h3>
                <span
                  style={{
                    color: "#65718a",
                    fontSize: "9px",
                  }}
                >
                  Operations
                </span>
              </div>
              <div className="sac-quick-grid">
                {quickAccess.map(
                  (item) => (
                    <button
                      key={item.key}
                      type="button"
                      className="sac-quick-item"
                      onClick={() =>
                        handleNavigate(
                          item.key
                        )
                      }
                      title={
                        item.label
                      }
                    >
                      {item.icon}
                      <span>
                        {
                          item.label
                        }
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </section>
          {/* ADMINISTRATION */}
          {(role === "IT_ADMIN" ||
            role === "ADMIN" ||
            role === "ADMINISTRATOR" ||
            role === "OPS_MANAGER" ||
            allowedPages.includes(
              "audit"
            )) && (
            <section className="sac-card sac-admin-card">
              <div className="sac-quick-header">
                <h3>
                  Administration
                </h3>
                <span
                  style={{
                    color: "#65718a",
                    fontSize: "9px",
                  }}
                >
                  {formatRole(role)}
                </span>
              </div>
              <div className="sac-admin-grid">
                {(role ===
                  "IT_ADMIN" ||
                  role === "ADMIN" ||
                  role ===
                    "ADMINISTRATOR" ||
                  role ===
                    "OPS_MANAGER") && (
                  <div
                    className="sac-admin-item"
                    onClick={() =>
                      handleNavigate(
                        "users"
                      )
                    }
                  >
                    {icons.users}
                    <strong>
                      Users
                    </strong>
                    <span>
                      {userCount} registered
                      users
                    </span>
                  </div>
                )}
                {allowedPages.includes(
                  "audit"
                ) && (
                  <div
                    className="sac-admin-item"
                    onClick={() =>
                      handleNavigate(
                        "audit"
                      )
                    }
                  >
                    {icons.audit}
                    <strong>
                      Audit Logs
                    </strong>
                    <span>
                      {
                        auditLogs.length
                      }{" "}
                      recorded activities
                    </span>
                  </div>
                )}
                {allowedPages.includes(
                  "notifications"
                ) && (
                  <div
                    className="sac-admin-item"
                    onClick={() =>
                      handleNavigate(
                        "notifications"
                      )
                    }
                  >
                    {
                      icons.notifications
                    }
                    <strong>
                      Notifications
                    </strong>
                    <span>
                      System alerts
                    </span>
                  </div>
                )}
                {(role ===
                  "IT_ADMIN" ||
                  role === "ADMIN" ||
                  role ===
                    "ADMINISTRATOR" ||
                  role ===
                    "OPS_MANAGER") &&
                  allowedPages.includes(
                    "settings"
                  ) && (
                    <div
                      className="sac-admin-item"
                      onClick={() =>
                        handleNavigate(
                          "settings"
                        )
                      }
                    >
                      {icons.settings}
                      <strong>
                        Settings
                      </strong>
                      <span>
                        System
                        configuration
                      </span>
                    </div>
                  )}
                {allowedPages.includes(
                  "tracking"
                ) && (
                  <div
                    className="sac-admin-item"
                    onClick={() =>
                      handleNavigate(
                        "tracking"
                      )
                    }
                  >
                    {icons.tracking}
                    <strong>
                      Tracking
                    </strong>
                    <span>
                      {trackingCount}{" "}
                      shipment records
                    </span>
                  </div>
                )}
                {allowedPages.includes(
                  "documents"
                ) && (
                  <div
                    className="sac-admin-item"
                    onClick={() =>
                      handleNavigate(
                        "documents"
                      )
                    }
               >
                    {icons.documents}
                    <strong>
                      Documents
                    </strong>
                    <span>
                      {documentCount}{" "}
                      document records
                    </span>
                  </div>
                )}
                {allowedPages.includes(
                  "declarations"
                ) && (
                  <div
                    className="sac-admin-item"
                    onClick={() =>
                      handleNavigate(
                        "declarations"
                      )
                    }
                 >
                    {
                      icons.declarations
                    }
                    <strong>
                      Declarations
                    </strong>
                    <span>
                      {
                        declarationCount
                      }{" "}
                      declarations
                    </span>
                  </div>
                )}

                {allowedPages.includes(
                  "shipments"
                ) && (
                  <div
                    className="sac-admin-item"
                    onClick={() =>
                      handleNavigate(
                        "shipments"
                      )
                    }
                  >
                    {icons.shipments}
                    <strong>
                      Shipments
                    </strong>
                    <span>
                      {shipmentCount}{" "}
                      registered
                      shipments
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}
          <div className="sac-footer">
            SAC Customs Management System
            • Secure Enterprise Platform •{" "}
            {new Date().getFullYear()}
          </div>
        </div>
      </main>
    </div>
  );
}