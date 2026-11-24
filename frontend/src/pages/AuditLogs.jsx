import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

function AuditLogs({ onBack }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // =====================================================
  // LOAD AUDIT LOGS
  // =====================================================

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/audit-logs`, {
        headers: getHeaders(),
      });

      const result = await response.json();

      console.log("AUDIT LOG RESPONSE:", result);

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load audit logs"
        );
      }

      let auditLogs = [];

      if (Array.isArray(result)) {
        auditLogs = result;
      } else if (Array.isArray(result.data)) {
        auditLogs = result.data;
      } else if (Array.isArray(result.logs)) {
        auditLogs = result.logs;
      } else if (Array.isArray(result.auditLogs)) {
        auditLogs = result.auditLogs;
      } else if (Array.isArray(result.audit_logs)) {
        auditLogs = result.audit_logs;
      }

      console.log("AUDIT LOGS FOUND:", auditLogs);

      setLogs(auditLogs);
    } catch (err) {
      console.error("AUDIT LOG ERROR:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalLogs = logs.length;

  const uniqueUsers = new Set(
    logs
      .map(
        (log) =>
          log.username ||
          log.user_name ||
          log.user_id
      )
      .filter(Boolean)
  ).size;

  const uniqueEntities = new Set(
    logs
      .map(
        (log) =>
          log.entity_type ||
          log.entity
      )
      .filter(Boolean)
  ).size;

  const uniqueActions = new Set(
    logs
      .map((log) => log.action)
      .filter(Boolean)
  ).size;

  // =====================================================
  // ACTION STYLE
  // =====================================================

  const getActionStyle = (action) => {
    const value = (action || "").toUpperCase();

    if (
      value.includes("CREATE") ||
      value.includes("ADD") ||
      value.includes("INSERT")
    ) {
      return {
        background: "rgba(74,222,128,0.10)",
        color: "#4ade80",
        border: "1px solid rgba(74,222,128,0.25)",
      };
    }

    if (
      value.includes("UPDATE") ||
      value.includes("EDIT")
    ) {
      return {
        background: "rgba(34,211,238,0.10)",
        color: "#22d3ee",
        border: "1px solid rgba(34,211,238,0.25)",
      };
    }

    if (
      value.includes("DELETE") ||
      value.includes("REMOVE")
    ) {
      return {
        background: "rgba(248,113,113,0.10)",
        color: "#f87171",
        border: "1px solid rgba(248,113,113,0.25)",
      };
    }

    if (
      value.includes("LOGIN") ||
      value.includes("AUTH")
    ) {
      return {
        background: "rgba(168,85,247,0.10)",
        color: "#c084fc",
        border: "1px solid rgba(168,85,247,0.25)",
      };
    }

    return {
      background: "rgba(255,255,255,0.07)",
      color: "#d1d5db",
      border: "1px solid rgba(255,255,255,0.12)",
    };
  };

  // =====================================================
  // ENTITY STYLE
  // =====================================================

  const getEntityStyle = () => ({
    background: "rgba(96,165,250,0.10)",
    color: "#60a5fa",
    border: "1px solid rgba(96,165,250,0.25)",
  });

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (value) => {
    if (!value) return "-";

    try {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return value;
      }

      return date.toLocaleString();
    } catch {
      return value;
    }
  };

  return (
    <main className="dashboard-content">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="glass-header">

        <div>
          <h2>Audit Logs</h2>

          <p>
            Monitor system activities, changes and user actions.
          </p>
        </div>

        <div className="status-badge">
          <span></span>
          System Online
        </div>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 18,
        }}
      >

        {/* TOTAL LOGS */}

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
                fontSize: 11,
              }}
            >
              Total Logs
            </small>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 4,
              }}
            >
              <b style={{ fontSize: 22 }}>
                {totalLogs}
              </b>

              <span
                style={{
                  background: "rgba(34,211,238,0.12)",
                  color: "#22d3ee",
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontSize: 10,
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(34,211,238,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            📊
          </div>
        </div>

        {/* USERS */}

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
                fontSize: 11,
              }}
            >
              Active Users
            </small>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 4,
              }}
            >
              <b style={{ fontSize: 22 }}>
                {uniqueUsers}
              </b>

              <span
                style={{
                  background: "rgba(168,85,247,0.12)",
                  color: "#c084fc",
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontSize: 10,
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(168,85,247,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            👥
          </div>
        </div>

        {/* ENTITIES */}

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
                fontSize: 11,
              }}
            >
              Entities
            </small>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 4,
              }}
            >
              <b style={{ fontSize: 22 }}>
                {uniqueEntities}
              </b>

              <span
                style={{
                  background: "rgba(74,222,128,0.12)",
                  color: "#4ade80",
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontSize: 10,
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(74,222,128,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            🗂️
          </div>
        </div>

        {/* ACTIONS */}

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
                fontSize: 11,
              }}
            >
              Action Types
            </small>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 4,
              }}
            >
              <b style={{ fontSize: 22 }}>
                {uniqueActions}
              </b>

              <span
                style={{
                  background: "rgba(251,146,60,0.12)",
                  color: "#fb923c",
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontSize: 10,
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(251,146,60,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            ⚡
          </div>
        </div>

      </div>

      {/* =================================================
          MAIN AUDIT LOG CARD
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
            <h3>System Activity</h3>

            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                marginTop: 4,
              }}
            >
              A record of important actions performed in the system.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
            }}
          >

            <button
              onClick={onBack}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "white",
                borderRadius: 10,
                padding: "9px 14px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ← Back
            </button>

            <button
              onClick={loadLogs}
              style={{
                background: "rgba(34,211,238,0.08)",
                border: "1px solid rgba(34,211,238,0.20)",
                color: "#22d3ee",
                borderRadius: 10,
                padding: "9px 14px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ↻ Refresh
            </button>

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: 35,
              color: "#22d3ee",
              fontSize: 13,
            }}
          >
            Loading audit logs...
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
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.20)",
              color: "#fca5a5",
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}

        {/* =================================================
            TABLE
        ================================================= */}

        {!loading && !error && (
          <>
            {logs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                }}
              >
                No audit logs found.
              </div>
            ) : (
              <div
                style={{
                  overflowX: "auto",
                  marginTop: 16,
                }}
              >

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 1000,
                  }}
                >

                  <thead>

                    <tr>

                      {[
                        "ID",
                        "USER",
                        "ACTION",
                        "ENTITY",
                        "DESCRIPTION",
                        "DATE",
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

                    {logs.map((log) => {

                      const username =
                        log.username ||
                        log.user_name ||
                        log.user_id ||
                        "-";

                      const action =
                        log.action || "-";

                      const entity =
                        log.entity_type ||
                        log.entity ||
                        "-";

                      const description =
                        log.description ||
                        log.details ||
                        "-";

                      const date =
                        log.created_at ||
                        log.timestamp ||
                        "-";

                      return (
                        <tr
                          key={log.id}
                          style={{
                            borderBottom:
                              "1px solid rgba(255,255,255,0.05)",
                          }}
                        >

                          <td style={cellStyle}>
                            {log.id || "-"}
                          </td>

                          <td
                            style={{
                              ...cellStyle,
                              color: "#22d3ee",
                              fontWeight: 600,
                            }}
                          >
                            {username}
                          </td>

                          <td style={cellStyle}>

                            <span
                              style={{
                                ...getActionStyle(action),
                                display: "inline-block",
                                padding: "5px 9px",
                                borderRadius: 8,
                                fontSize: 10,
                                fontWeight: 600,
                              }}
                            >
                              {action}
                            </span>

                          </td>

                          <td style={cellStyle}>

                            <span
                              style={{
                                ...getEntityStyle(),
                                display: "inline-block",
                                padding: "5px 9px",
                                borderRadius: 8,
                                fontSize: 10,
                                fontWeight: 600,
                              }}
                            >
                              {entity}
                            </span>

                          </td>

                          <td
                            style={{
                              ...cellStyle,
                              maxWidth: 350,
                              whiteSpace: "normal",
                              lineHeight: 1.5,
                            }}
                          >
                            {description}
                          </td>

                          <td
                            style={{
                              ...cellStyle,
                              color:
                                "rgba(255,255,255,0.55)",
                            }}
                          >
                            {formatDate(date)}
                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            )}
          </>
        )}

      </div>

    </main>
  );
}

// =====================================================
// TABLE CELL STYLE
// =====================================================

const cellStyle = {
  padding: "12px 10px",
  color: "rgba(255,255,255,0.78)",
  fontSize: 11,
  whiteSpace: "nowrap",
};

export default AuditLogs;