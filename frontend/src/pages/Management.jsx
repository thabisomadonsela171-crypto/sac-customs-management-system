import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

export default function UserManagement({ onBack }) {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    user_number: "",
    username: "",
    password: "",
    full_name: "",
    email: "",
    role: "CLERK",
  });

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // =========================================
  // LOAD USERS
  // =========================================
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/users`, {
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load users"
        );
      }

      const userList =
        result.data?.users ||
        result.users ||
        result.data ||
        [];

      setUsers(Array.isArray(userList) ? userList : []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =========================================
  // FORM CHANGE
  // =========================================
  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================================
  // CREATE USER
  // =========================================
  const createUser = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create user"
        );
      }

      setMessage("User created successfully.");

      setFormData({
        user_number: "",
        username: "",
        password: "",
        full_name: "",
        email: "",
        role: "CLERK",
      });

      setShowForm(false);

      await loadUsers();
    } catch (err) {
      setError(err.message || "Failed to create user");
    }
  };

  // =========================================
  // ACTIVATE / DEACTIVATE USER
  // =========================================
  const toggleUserStatus = async (user) => {
    try {
      setError("");
      setMessage("");

      const newStatus =
        user.status === "ACTIVE"
          ? "INACTIVE"
          : "ACTIVE";

      const response = await fetch(
        `${API_URL}/users/${user.id}`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update user"
        );
      }

      setMessage(
        `User ${
          newStatus === "ACTIVE"
            ? "activated"
            : "deactivated"
        } successfully.`
      );

      await loadUsers();
    } catch (err) {
      setError(
        err.message || "Failed to update user"
      );
    }
  };

  // =========================================
  // USER STATISTICS
  // =========================================
  const activeUsers = users.filter(
    (user) => user.status === "ACTIVE"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status !== "ACTIVE"
  ).length;

  return (
    <main className="dashboard-content">

      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <div className="glass-header">
        <div>
          <h2>User Management</h2>

          <p>
            Manage SAC Customs system users and roles.
          </p>
        </div>

        <div className="status-badge">
          <span></span>
          System Online
        </div>
      </div>

      {/* =========================================
          USER ANALYTICS
      ========================================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "18px",
        }}
      >

        {/* TOTAL USERS */}
        <div
          className="analytics-card"
          style={{
            marginBottom: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <small
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "11px",
              }}
            >
              Total Users
            </small>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "4px",
              }}
            >
              <b style={{ fontSize: "22px" }}>
                {users.length}
              </b>

              <span
                style={{
                  background:
                    "rgba(168,85,247,0.15)",
                  color: "#a855f7",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "10px",
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background:
                "rgba(168,85,247,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: "20px",
            }}
          >
            👥
          </div>
        </div>

        {/* ACTIVE USERS */}
        <div
          className="analytics-card"
          style={{
            marginBottom: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <small
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "11px",
              }}
            >
              Active Users
            </small>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "4px",
              }}
            >
              <b style={{ fontSize: "22px" }}>
                {activeUsers}
              </b>

              <span
                style={{
                  background:
                    "rgba(74,222,128,0.15)",
                  color: "#4ade80",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "10px",
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background:
                "rgba(74,222,128,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: "20px",
            }}
          >
            🟢
          </div>
        </div>

        {/* INACTIVE USERS */}
        <div
          className="analytics-card"
          style={{
            marginBottom: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <small
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "11px",
              }}
            >
              Inactive Users
            </small>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "4px",
              }}
            >
              <b style={{ fontSize: "22px" }}>
                {inactiveUsers}
              </b>

              <span
                style={{
                  background:
                    "rgba(239,68,68,0.15)",
                  color: "#f87171",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "10px",
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background:
                "rgba(239,68,68,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: "20px",
            }}
          >
            🔴
          </div>
        </div>
      </div>

      {/* =========================================
          MAIN USER MANAGEMENT CARD
      ========================================= */}
      <div className="master-card">

        {/* HEADER */}
        <div className="master-head">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3>System User Management</h3>

              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Create users, manage roles and control
                account access.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    background:
                      "rgba(255,255,255,0.06)",
                    border:
                      "1px solid rgba(255,255,255,0.10)",
                    color: "white",
                    padding: "9px 14px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  ← Back
                </button>
              )}

              <button
                type="button"
                onClick={loadUsers}
                style={{
                  background:
                    "rgba(255,255,255,0.06)",
                  border:
                    "1px solid rgba(255,255,255,0.10)",
                  color: "white",
                  padding: "9px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                ↻ Refresh
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(
                    (previous) => !previous
                  );
                  setError("");
                  setMessage("");
                }}
                style={{
                  background:
                    "linear-gradient(135deg,#22d3ee,#2563eb)",
                  border: "none",
                  color: "white",
                  padding: "9px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "600",
                  boxShadow:
                    "0 4px 15px rgba(34,211,238,0.20)",
                }}
              >
                {showForm
                  ? "Close Form"
                  : "+ Add User"}
              </button>
            </div>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px 14px",
              borderRadius: "10px",
              background:
                "rgba(74,222,128,0.10)",
              border:
                "1px solid rgba(74,222,128,0.22)",
              color: "#86efac",
              fontSize: "12px",
            }}
          >
            ✓ {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px 14px",
              borderRadius: "10px",
              background:
                "rgba(239,68,68,0.10)",
              border:
                "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5",
              fontSize: "12px",
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* =========================================
            CREATE USER FORM
        ========================================= */}
        {showForm && (
          <div
            style={{
              marginTop: "16px",
              padding: "18px",
              borderRadius: "14px",
              background:
                "rgba(255,255,255,0.035)",
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                }}
              >
                Create New User
              </h3>

              <p
                style={{
                  marginTop: "4px",
                  color:
                    "rgba(255,255,255,0.45)",
                  fontSize: "11px",
                }}
              >
                Register a new SAC Customs system
                user and assign a role.
              </p>
            </div>

            <form onSubmit={createUser}>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "14px",
                }}
              >

                {/* USER NUMBER */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "11px",
                      color:
                        "rgba(255,255,255,0.65)",
                    }}
                  >
                    User Number
                  </label>

                  <input
                    name="user_number"
                    value={formData.user_number}
                    onChange={handleChange}
                    placeholder="USR-0001"
                    required
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "11px 12px",
                      borderRadius: "9px",
                      border:
                        "1px solid rgba(255,255,255,0.10)",
                      background:
                        "rgba(255,255,255,0.05)",
                      color: "white",
                      outline: "none",
                    }}
                  />
                </div>

                {/* USERNAME */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "11px",
                      color:
                        "rgba(255,255,255,0.65)",
                    }}
                  >
                    Username
                  </label>

                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="username"
                    required
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "11px 12px",
                      borderRadius: "9px",
                      border:
                        "1px solid rgba(255,255,255,0.10)",
                      background:
                        "rgba(255,255,255,0.05)",
                      color: "white",
                      outline: "none",
                    }}
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "11px",
                      color:
                        "rgba(255,255,255,0.65)",
                    }}
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "11px 12px",
                      borderRadius: "9px",
                      border:
                        "1px solid rgba(255,255,255,0.10)",
                      background:
                        "rgba(255,255,255,0.05)",
                      color: "white",
                      outline: "none",
                    }}
                  />
                </div>

                {/* FULL NAME */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "11px",
                      color:
                        "rgba(255,255,255,0.65)",
                    }}
                  >
                    Full Name
                  </label>

                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "11px 12px",
                      borderRadius: "9px",
                      border:
                        "1px solid rgba(255,255,255,0.10)",
                      background:
                        "rgba(255,255,255,0.05)",
                      color: "white",
                      outline: "none",
                    }}
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "11px",
                      color:
                        "rgba(255,255,255,0.65)",
                    }}
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@sacustoms.co.za"
                    required
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "11px 12px",
                      borderRadius: "9px",
                      border:
                        "1px solid rgba(255,255,255,0.10)",
                      background:
                        "rgba(255,255,255,0.05)",
                      color: "white",
                      outline: "none",
                    }}
                  />
                </div>

                {/* ROLE */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "11px",
                      color:
                        "rgba(255,255,255,0.65)",
                    }}
                  >
                    Role
                  </label>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "11px 12px",
                      borderRadius: "9px",
                      border:
                        "1px solid rgba(255,255,255,0.10)",
                      background:
                        "rgba(255,255,255,0.05)",
                      color: "white",
                      outline: "none",
                    }}
                  >
                    <option
                      value="ADMIN"
                      style={{ color: "black" }}
                    >
                      ADMIN
                    </option>

                    <option
                      value="CLERK"
                      style={{ color: "black" }}
                    >
                      CLERK
                    </option>

                    <option
                      value="FINANCE"
                      style={{ color: "black" }}
                    >
                      FINANCE
                    </option>

                    <option
                      value="CUSTOMS_OFFICER"
                      style={{ color: "black" }}
                    >
                      CUSTOMS OFFICER
                    </option>
                  </select>
                </div>
              </div>

              {/* FORM BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  style={{
                    background:
                      "rgba(255,255,255,0.06)",
                    border:
                      "1px solid rgba(255,255,255,0.10)",
                    color: "white",
                    padding: "10px 16px",
                    borderRadius: "9px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    background:
                      "linear-gradient(135deg,#22d3ee,#2563eb)",
                    border: "none",
                    color: "white",
                    padding: "10px 18px",
                    borderRadius: "9px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================
            SYSTEM USERS
        ========================================= */}
        <div style={{ marginTop: "20px" }}>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                }}
              >
                System Users
              </h3>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "11px",
                  color:
                    "rgba(255,255,255,0.45)",
                }}
              >
                View system accounts and manage
                account status.
              </p>
            </div>

            <span
              style={{
                background:
                  "rgba(168,85,247,0.12)",
                color: "#c084fc",
                padding: "5px 10px",
                borderRadius: "10px",
                fontSize: "10px",
              }}
            >
              {users.length} users
            </span>
          </div>

          {/* LOADING */}
          {loading && (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color:
                  "rgba(255,255,255,0.55)",
                background:
                  "rgba(255,255,255,0.03)",
                borderRadius: "12px",
              }}
            >
              Loading users...
            </div>
          )}

          {/* EMPTY */}
          {!loading && users.length === 0 && (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color:
                  "rgba(255,255,255,0.55)",
                background:
                  "rgba(255,255,255,0.03)",
                borderRadius: "12px",
                border:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "8px",
                }}
              >
                👥
              </div>

              <div>No users found.</div>
            </div>
          )}

          {/* USER CARDS */}
          {!loading && users.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "12px",
              }}
            >
              {users.map((user) => {

                const active =
                  user.status === "ACTIVE";

                return (
                  <div
                    key={user.id}
                    style={{
                      background:
                        "rgba(255,255,255,0.04)",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "14px",
                      padding: "16px",
                    }}
                  >

                    {/* USER HEADER */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "flex-start",
                        gap: "10px",
                        marginBottom: "14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background:
                              "linear-gradient(135deg,#22d3ee,#2563eb)",
                            display: "grid",
                            placeItems: "center",
                            fontSize: "17px",
                          }}
                        >
                          👤
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            {user.full_name ||
                              user.username}
                          </div>

                          <div
                            style={{
                              fontSize: "10px",
                              color:
                                "rgba(255,255,255,0.45)",
                              marginTop: "3px",
                            }}
                          >
                            @{user.username}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          padding: "4px 9px",
                          borderRadius: "10px",
                          fontSize: "10px",
                          background: active
                            ? "rgba(74,222,128,0.12)"
                            : "rgba(239,68,68,0.12)",
                          color: active
                            ? "#4ade80"
                            : "#f87171",
                        }}
                      >
                        {user.status || "UNKNOWN"}
                      </span>
                    </div>

                    {/* USER DETAILS */}
                    <div
                      style={{
                        display: "grid",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            color:
                              "rgba(255,255,255,0.45)",
                          }}
                        >
                          User Number
                        </span>

                        <strong
                          style={{
                            fontSize: "11px",
                          }}
                        >
                          {user.user_number || "-"}
                        </strong>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            color:
                              "rgba(255,255,255,0.45)",
                          }}
                        >
                          Email
                        </span>

                        <strong
                          style={{
                            fontSize: "11px",
                            textAlign: "right",
                            wordBreak: "break-word",
                          }}
                        >
                          {user.email || "-"}
                        </strong>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            color:
                              "rgba(255,255,255,0.45)",
                          }}
                        >
                          Role
                        </span>

                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "8px",
                            background:
                              "rgba(168,85,247,0.12)",
                            color: "#c084fc",
                            fontSize: "10px",
                          }}
                        >
                          {user.role || "-"}
                        </span>
                      </div>
                    </div>

                    {/* ACTION */}
                    <div
                      style={{
                        marginTop: "14px",
                        paddingTop: "12px",
                        borderTop:
                          "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          toggleUserStatus(user)
                        }
                        style={{
                          width: "100%",
                          background: active
                            ? "rgba(239,68,68,0.10)"
                            : "rgba(74,222,128,0.10)",
                          border: active
                            ? "1px solid rgba(239,68,68,0.20)"
                            : "1px solid rgba(74,222,128,0.20)",
                          color: active
                            ? "#f87171"
                            : "#4ade80",
                          padding: "9px",
                          borderRadius: "9px",
                          cursor: "pointer",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        {active
                          ? "Deactivate User"
                          : "Activate User"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}