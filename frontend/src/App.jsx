import { useEffect, useState } from "react";

import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";

import Customers from "./pages/Customers.jsx";
import Shipments from "./pages/Shipments.jsx";
import Documents from "./pages/Documents.jsx";
import Declarations from "./pages/Declarations.jsx";
import Payments from "./pages/Payments.jsx";
import Tracking from "./pages/Tracking.jsx";
import Notifications from "./pages/Notifications.jsx";
import Users from "./pages/Users.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";
import Settings from "./pages/Settings.jsx";

import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        console.log("Logged in user:", parsedUser);

        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid saved user:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
      }
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    console.log("Login user:", loggedInUser);

    setUser(loggedInUser);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");

    setUser(null);
    setPage("dashboard");
  };

  /*
   * CENTRAL NAVIGATION FUNCTION
   *
   * This connects the buttons from Dashboard
   * to the correct React page.
   */
  const navigateTo = (nextPage) => {
    console.log("Navigating to:", nextPage);

    switch (nextPage) {
      /* =========================
         DASHBOARD
      ========================= */
      case "dashboard":
        setPage("dashboard");
        return;

      /* =========================
         CUSTOMERS
      ========================= */
      case "customers":
        setPage("customers");
        return;

      /* =========================
         SHIPMENTS
      ========================= */
      case "shipments":
        setPage("shipments");
        return;

      /* =========================
         DOCUMENTS
      ========================= */
      case "documents":
        setPage("documents");
        return;

      /* =========================
         DECLARATIONS
      ========================= */
      case "declaration":
      case "declarations":
        setPage("declarations");
        return;

      /* =========================
         PAYMENTS
      ========================= */
      case "payments":
        setPage("payments");
        return;

      /* =========================
         TRACKING
      ========================= */
      case "tracking":
        setPage("tracking");
        return;

      /* =========================
         NOTIFICATIONS
      ========================= */
      case "notifications":
        setPage("notifications");
        return;

      /* =========================
         USERS
      ========================= */
      case "user":
      case "users":
        setPage("users");
        return;

      /* =========================
         AUDIT LOGS
      ========================= */
      case "audit":
      case "auditLogs":
      case "audit-logs":
      case "audit_logs":
        setPage("auditLogs");
        return;

      /* =========================
         SETTINGS
      ========================= */
      case "settings":
        setPage("settings");
        return;

      /* =========================
         UNKNOWN PAGE
      ========================= */
      default:
        console.warn("Unknown navigation page:", nextPage);
        setPage("dashboard");
        return;
    }
  };

  /*
   * If there is no logged-in user,
   * show Login.
   */
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  /*
   * Make the role consistent.
   *
   * Example:
   * admin
   * Admin
   * ADMIN
   *
   * All become:
   * ADMIN
   */
  const userRole = String(user?.role || "")
    .trim()
    .toUpperCase();

  console.log("Current user role:", userRole);
  console.log("Current page:", page);

  /*
   * ROLE PERMISSIONS
   */
  const allowedPages = {
    /* =========================
       ADMIN
    ========================= */
    ADMIN: [
      "dashboard",
      "customers",
      "shipments",
      "documents",
      "declarations",
      "payments",
      "tracking",
      "notifications",
      "users",
      "auditLogs",
      "settings",
    ],

    /* =========================
       ADMINISTRATOR
    ========================= */
    ADMINISTRATOR: [
      "dashboard",
      "customers",
      "shipments",
      "documents",
      "declarations",
      "payments",
      "tracking",
      "notifications",
      "users",
      "auditLogs",
      "settings",
    ],

    /* =========================
       IT ADMIN
    ========================= */
    IT_ADMIN: [
      "dashboard",
      "customers",
      "shipments",
      "documents",
      "declarations",
      "payments",
      "tracking",
      "notifications",
      "users",
      "auditLogs",
      "settings",
    ],

    /* =========================
       OPERATIONS MANAGER
    ========================= */
    OPS_MANAGER: [
      "dashboard",
      "customers",
      "shipments",
      "documents",
      "declarations",
      "payments",
      "tracking",
      "notifications",
      "users",
      "auditLogs",
      "settings",
    ],

    /* =========================
       CLERK
    ========================= */
    CLERK: [
      "dashboard",
      "customers",
      "shipments",
      "documents",
      "declarations",
      "tracking",
      "notifications",
      "auditLogs",
    ],

    /* =========================
       CUSTOMS OFFICER
    ========================= */
    CUSTOMS_OFFICER: [
      "dashboard",
      "customers",
      "shipments",
      "documents",
      "declarations",
      "tracking",
      "notifications",
      "auditLogs",
      "users",
    ],

    /* =========================
       FINANCE OFFICER
    ========================= */
    FINANCE_OFFICER: [
      "dashboard",
      "customers",
      "shipments",
      "documents",
      "declarations",
      "payments",
      "tracking",
      "notifications",
      "auditLogs",
    ],

    /* =========================
       FINANCE
    ========================= */
    FINANCE: [
      "dashboard",
      "payments",
      "notifications",
      "auditLogs",
    ],
  };

  const userAllowedPages =
    allowedPages[userRole] || ["dashboard"];

  /*
   * Check whether the current role
   * is allowed to open the current page.
   */
  if (!userAllowedPages.includes(page)) {
    console.warn(
      `Page "${page}" is not allowed for role "${userRole}". Returning to dashboard.`
    );

    if (page !== "dashboard") {
      setTimeout(() => {
        setPage("dashboard");
      }, 0);
    }

    return null;
  }

  /*
   * PAGE ROUTING
   */
  switch (page) {
    /* =========================
       CUSTOMERS
    ========================= */
    case "customers":
      return (
        <Customers
          onBack={() => navigateTo("dashboard")}
          user={user}
        />
      );

    /* =========================
       SHIPMENTS
    ========================= */
    case "shipments":
      return (
        <Shipments
          onBack={() => navigateTo("dashboard")}
          user={user}
        />
      );

    /* =========================
       DOCUMENTS
    ========================= */
    case "documents":
      return (
        <Documents
          onBack={() => navigateTo("dashboard")}
          user={user}
        />
      );

    /* =========================
       DECLARATIONS
    ========================= */
    case "declarations":
      return (
        <Declarations
          onBack={() => navigateTo("dashboard")}
          user={user}
        />
      );

    /* =========================
       PAYMENTS
    ========================= */
    case "payments":
      return (
        <Payments
          onBack={() => navigateTo("dashboard")}
          user={user}
        />
      );

    /* =========================
       TRACKING
    ========================= */
    case "tracking":
      return (
        <Tracking
          onBack={() => navigateTo("dashboard")}
          user={user}
        />
      );

    /* =========================
       NOTIFICATIONS
    ========================= */
    case "notifications":
      return (
        <Notifications
          onBack={() => navigateTo("dashboard")}
          user={user}
        />
      );

    /* =========================
       USERS
    ========================= */
    case "users":
      return (
        <Users
          onBack={() => navigateTo("dashboard")}
          user={user}
        />
      );

    /* =========================
       AUDIT LOGS
    ========================= */
    case "auditLogs":
    case "audit-logs":
    case "audit_logs":
      return (
        <AuditLogs
          onBack={() => navigateTo("dashboard")}
          user={user}
        />
      );

    /* =========================
       SETTINGS
    ========================= */
    case "settings":
      return (
        <Settings
          onBack={() => navigateTo("dashboard")}
          user={user}
        />
      );

    /* =========================
       DASHBOARD
    ========================= */
    case "dashboard":
    default:
      return (
        <Dashboard
          user={user}
          onNavigate={navigateTo}
          onRefresh={() => window.location.reload()}
        />
      );
  }
}