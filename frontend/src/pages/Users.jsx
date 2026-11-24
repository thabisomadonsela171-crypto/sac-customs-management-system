import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

function Users({ onBack, user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    user_number: "",
    username: "",
    password: "",
    full_name: "",
    email: "",
    role: "CLERK",
  });

  // =====================================================
  // AUTH HEADERS
  // =====================================================

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // =====================================================
  // LOAD USERS
  // =====================================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: getHeaders(),
      });

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            `Failed to load users. Server returned ${response.status}.`
        );
      }

      const records =
        result?.data?.users ||
        result?.data ||
        result?.users ||
        result?.results ||
        [];

      setUsers(Array.isArray(records) ? records : []);
    } catch (err) {
      console.error("Load users error:", err);

      setError(
        err.message ||
          "Unable to load users from the SAC Customs server."
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE USER
  // =====================================================

  const createUser = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(form),
      });

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Failed to create user."
        );
      }

      setForm({
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
      console.error("Create user error:", err);

      setError(
        err.message ||
          "Unable to create the user."
      );
    }
  };

  // =====================================================
  // DEACTIVATE USER
  // =====================================================

  const deactivateUser = async (id) => {
    if (!window.confirm("Deactivate this user?")) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/users/${id}/status`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({
            status: "INACTIVE",
          }),
        }
      );

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Failed to update user."
        );
      }

      await loadUsers();
    } catch (err) {
      console.error("Deactivate user error:", err);

      setError(
        err.message ||
          "Unable to deactivate the user."
      );
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (item) =>
      String(item.status || "ACTIVE").toUpperCase() ===
      "ACTIVE"
  ).length;

  const inactiveUsers = users.filter(
    (item) =>
      String(item.status || "").toUpperCase() ===
      "INACTIVE"
  ).length;

  const adminUsers = users.filter(
    (item) =>
      String(item.role || "").toUpperCase() ===
      "ADMIN"
  ).length;

  // =====================================================
  // ROLE STYLE
  // =====================================================

  const getRoleStyle = (role) => {
    const value = String(role || "").toUpperCase();

    if (
      value === "ADMIN" ||
      value === "ADMINISTRATOR" ||
      value === "IT_ADMIN"
    ) {
      return {
        background: "rgba(168,85,247,0.12)",
        color: "#c084fc",
        border: "1px solid rgba(168,85,247,0.25)",
      };
    }

    if (value === "CLERK") {
      return {
        background: "rgba(34,211,238,0.10)",
        color: "#22d3ee",
        border: "1px solid rgba(34,211,238,0.25)",
      };
    }

    if (
      value === "FINANCE" ||
      value === "FINANCE_OFFICER"
    ) {
      return {
        background: "rgba(74,222,128,0.10)",
        color: "#4ade80",
        border: "1px solid rgba(74,222,128,0.25)",
      };
    }

    if (value === "CUSTOMS_OFFICER") {
      return {
        background: "rgba(251,191,36,0.10)",
        color: "#fbbf24",
        border: "1px solid rgba(251,191,36,0.25)",
      };
    }

    if (value === "OPS_MANAGER") {
      return {
        background: "rgba(96,165,250,0.10)",
        color: "#60a5fa",
        border: "1px solid rgba(96,165,250,0.25)",
      };
    }

    return {
      background: "rgba(255,255,255,0.07)",
      color: "#d1d5db",
      border: "1px solid rgba(255,255,255,0.12)",
    };
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(status || "ACTIVE").toUpperCase();

    if (value === "ACTIVE") {
      return {
        background: "rgba(74,222,128,0.10)",
        color: "#4ade80",
        border: "1px solid rgba(74,222,128,0.25)",
      };
    }

    return {
      background: "rgba(248,113,113,0.10)",
      color: "#f87171",
      border: "1px solid rgba(248,113,113,0.25)",
    };
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main
      className="dashboard-content"
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="glass-header">
        <div>
          <h2>User Management</h2>

          <p>
            Manage SAC Customs system users, roles and
            access.
          </p>
        </div>

        <div className="status-badge">
          <span></span>
          System Online
        </div>
      </div>

      {/* =================================================
          CURRENT USER
      ================================================= */}

      <div
        style={{
          marginBottom: 18,
          padding: "10px 14px",
          borderRadius: 10,
          background: "rgba(34,211,238,0.06)",
          border: "1px solid rgba(34,211,238,0.12)",
          color: "rgba(255,255,255,0.65)",
          fontSize: 11,
        }}
      >
        Logged in as:{" "}
        <strong style={{ color: "#22d3ee" }}>
          {user?.full_name ||
            user?.username ||
            user?.email ||
            "System User"}
        </strong>

        {user?.role && (
          <>
            {" • "}
            <strong style={{ color: "#c084fc" }}>
              {user.role}
            </strong>
          </>
        )}
      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 18,
        }}
      >
        {/* TOTAL */}

        <div
          className="analytics-card"
          style={statCardStyle}
        >
          <div>
            <small style={statLabelStyle}>
              Total Users
            </small>

            <div style={statValueWrapper}>
              <b style={statNumberStyle}>
                {totalUsers}
              </b>

              <span
                style={{
                  ...statDot,
                  background:
                    "rgba(34,211,238,0.12)",
                  color: "#22d3ee",
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              ...statIconStyle,
              background:
                "rgba(34,211,238,0.10)",
            }}
          >
            👥
          </div>
        </div>

        {/* ACTIVE */}

        <div
          className="analytics-card"
          style={statCardStyle}
        >
          <div>
            <small style={statLabelStyle}>
              Active Users
            </small>

            <div style={statValueWrapper}>
              <b style={statNumberStyle}>
                {activeUsers}
              </b>

              <span
                style={{
                  ...statDot,
                  background:
                    "rgba(74,222,128,0.12)",
                  color: "#4ade80",
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              ...statIconStyle,
              background:
                "rgba(74,222,128,0.10)",
            }}
          >
            ✓
          </div>
        </div>

        {/* INACTIVE */}

        <div
          className="analytics-card"
          style={statCardStyle}
        >
          <div>
            <small style={statLabelStyle}>
              Inactive Users
            </small>

            <div style={statValueWrapper}>
              <b style={statNumberStyle}>
                {inactiveUsers}
              </b>

              <span
                style={{
                  ...statDot,
                  background:
                    "rgba(248,113,113,0.12)",
                  color: "#f87171",
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              ...statIconStyle,
              background:
                "rgba(248,113,113,0.10)",
            }}
          >
            !
          </div>
        </div>

        {/* ADMINS */}

        <div
          className="analytics-card"
          style={statCardStyle}
        >
          <div>
            <small style={statLabelStyle}>
              Administrators
            </small>

            <div style={statValueWrapper}>
              <b style={statNumberStyle}>
                {adminUsers}
              </b>

              <span
                style={{
                  ...statDot,
                  background:
                    "rgba(168,85,247,0.12)",
                  color: "#c084fc",
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              ...statIconStyle,
              background:
                "rgba(168,85,247,0.10)",
            }}
          >
            🛡️
          </div>
        </div>
      </div>

      {/* =================================================
          ACTION BAR
      ================================================= */}

      <div className="master-card">
        <div
          className="master-head"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3>User Management</h3>

            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                marginTop: 4,
              }}
            >
              View and manage registered SAC Customs
              system users.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={onBack}
              style={backButtonStyle}
            >
              ← Back to Dashboard
            </button>

            <button
              type="button"
              onClick={loadUsers}
              style={refreshButtonStyle}
            >
              ↻ Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(!showForm);
                setError("");
              }}
              style={addButtonStyle}
            >
              {showForm ? "✕ Close Form" : "+ Add User"}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          CREATE USER FORM
      ================================================= */}

      {showForm && (
        <div
          className="master-card"
          style={{ marginTop: 16 }}
        >
          <div className="master-head">
            <h3>Create User</h3>

            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Register a new SAC Customs system user.
            </p>
          </div>

          <form
            onSubmit={createUser}
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: 14,
              marginTop: 18,
            }}
          >
            <FormField
              label="User Number"
              name="user_number"
              value={form.user_number}
              onChange={handleChange}
              placeholder="e.g. USR-0005"
            />

            <FormField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
            />

            <FormField
              label="Full Name"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="e.g. Admin Test"
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin.test@example.com"
            />

            <div>
              <label style={labelStyle}>
                Role
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="CLERK">CLERK</option>
                <option value="FINANCE">
                  FINANCE
                </option>
                <option value="FINANCE_OFFICER">
                  FINANCE OFFICER
                </option>
                <option value="CUSTOMS_OFFICER">
                  CUSTOMS OFFICER
                </option>
                <option value="OPS_MANAGER">
                  OPERATIONS MANAGER
                </option>
                <option value="IT_ADMIN">
                  IT ADMIN
                </option>
              </select>
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 4,
              }}
            >
              <button
                type="submit"
                style={createButtonStyle}
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            marginTop: 16,
            padding: "12px 14px",
            borderRadius: 10,
            background:
              "rgba(248,113,113,0.08)",
            border:
              "1px solid rgba(248,113,113,0.20)",
            color: "#fca5a5",
            fontSize: 12,
          }}
        >
          <strong>User Management:</strong>{" "}
          {error}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div
          className="master-card"
          style={{
            marginTop: 16,
            textAlign: "center",
            padding: 30,
          }}
        >
          <span
            style={{
              color: "#22d3ee",
              fontSize: 13,
            }}
          >
            Loading users...
          </span>
        </div>
      )}

      {/* =================================================
          USERS TABLE
      ================================================= */}

      {!loading && (
        <div
          className="master-card"
          style={{
            marginTop: 16,
            overflow: "hidden",
          }}
        >
          <div className="master-head">
            <h3>Registered Users</h3>

            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {users.length} user
              {users.length !== 1 ? "s" : ""} registered
            </p>
          </div>

          <div
            style={{
              overflowX: "auto",
              marginTop: 14,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 950,
              }}
            >
              <thead>
                <tr>
                  {[
                    "ID",
                    "USER NUMBER",
                    "USERNAME",
                    "FULL NAME",
                    "EMAIL",
                    "ROLE",
                    "STATUS",
                    "ACTION",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: "12px 10px",
                        fontSize: 10,
                        color:
                          "rgba(255,255,255,0.45)",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.08)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        color:
                          "rgba(255,255,255,0.5)",
                        fontSize: 12,
                      }}
                    >
                      No users found in the system.
                    </td>
                  </tr>
                ) : (
                  users.map((item) => {
                    const status =
                      item.status || "ACTIVE";

                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom:
                            "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <td style={cellStyle}>
                          {item.id}
                        </td>

                        <td style={cellStyle}>
                          {item.user_number || "-"}
                        </td>

                        <td
                          style={{
                            ...cellStyle,
                            color: "#22d3ee",
                            fontWeight: 600,
                          }}
                        >
                          {item.username || "-"}
                        </td>

                        <td style={cellStyle}>
                          {item.full_name || "-"}
                        </td>

                        <td style={cellStyle}>
                          {item.email || "-"}
                        </td>

                        <td style={cellStyle}>
                          <span
                            style={{
                              ...getRoleStyle(
                                item.role
                              ),
                              display:
                                "inline-block",
                              padding: "5px 9px",
                              borderRadius: 8,
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            {item.role || "-"}
                          </span>
                        </td>

                        <td style={cellStyle}>
                          <span
                            style={{
                              ...getStatusStyle(
                                status
                              ),
                              display:
                                "inline-block",
                              padding: "5px 9px",
                              borderRadius: 8,
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            ● {status}
                          </span>
                        </td>

                        <td style={cellStyle}>
                          {String(
                            status
                          ).toUpperCase() !==
                          "INACTIVE" ? (
                            <button
                              type="button"
                              onClick={() =>
                                deactivateUser(
                                  item.id
                                )
                              }
                              style={{
                                background:
                                  "rgba(248,113,113,0.08)",
                                border:
                                  "1px solid rgba(248,113,113,0.20)",
                                color: "#f87171",
                                borderRadius: 8,
                                padding:
                                  "6px 10px",
                                cursor:
                                  "pointer",
                                fontSize: 10,
                              }}
                            >
                              Deactivate
                            </button>
                          ) : (
                            <span
                              style={{
                                color:
                                  "rgba(255,255,255,0.35)",
                                fontSize: 10,
                              }}
                            >
                              Disabled
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

// =====================================================
// FORM FIELD
// =====================================================

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        style={inputStyle}
      />
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const statCardStyle = {
  marginBottom: 0,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const statLabelStyle = {
  color: "rgba(255,255,255,0.5)",
  fontSize: 11,
};

const statValueWrapper = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 4,
};

const statNumberStyle = {
  fontSize: 22,
};

const statDot = {
  padding: "2px 8px",
  borderRadius: 10,
  fontSize: 10,
};

const statIconStyle = {
  width: 40,
  height: 40,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  fontSize: 20,
};

const labelStyle = {
  display: "block",
  fontSize: 11,
  color: "rgba(255,255,255,0.65)",
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 10,
  padding: "11px 12px",
  color: "white",
  outline: "none",
  fontSize: 12,
};

const backButtonStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "white",
  borderRadius: 10,
  padding: "9px 14px",
  cursor: "pointer",
  fontSize: 12,
};

const refreshButtonStyle = {
  background: "rgba(34,211,238,0.08)",
  border: "1px solid rgba(34,211,238,0.20)",
  color: "#22d3ee",
  borderRadius: 10,
  padding: "9px 14px",
  cursor: "pointer",
  fontSize: 12,
};

const addButtonStyle = {
  background: "rgba(34,211,238,0.12)",
  border: "1px solid rgba(34,211,238,0.25)",
  color: "#22d3ee",
  borderRadius: 10,
  padding: "9px 14px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
};

const createButtonStyle = {
  background: "rgba(34,211,238,0.14)",
  border: "1px solid rgba(34,211,238,0.30)",
  color: "#22d3ee",
  borderRadius: 10,
  padding: "11px 18px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
};

const cellStyle = {
  padding: "12px 10px",
  color: "rgba(255,255,255,0.78)",
  fontSize: 11,
  whiteSpace: "nowrap",
};

export default Users;