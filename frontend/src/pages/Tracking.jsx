import { useEffect, useState, useRef } from "react";

const API_URL = "http://localhost:4000/api";

export default function Tracking({ onBack }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLive, setIsLive] = useState(false);
  const [selected, setSelected] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const intervalRef = useRef(null);

  // =========================================================
  // LOAD TRACKING DATA
  // =========================================================

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const res = await fetch(`${API_URL}/shipments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.message || "Failed to load tracking records."
        );
      }

      const data =
        json.data?.shipments ||
        json.shipments ||
        json.data ||
        [];

      setRecords(Array.isArray(data) ? data : []);
      setLastUpdate(new Date());

    } catch (error) {
      console.error("Tracking error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================================
  // LIVE POLLING
  // =========================================================

  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive]);

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusColor = (status) => {
    if (!status) {
      return {
        bg: "rgba(255,255,255,0.08)",
        color: "#9ca3af",
        border: "rgba(255,255,255,0.15)",
      };
    }

    const up = status.toUpperCase();

    if (up.includes("PROCESSING")) {
      return {
        bg: "rgba(250,204,21,0.10)",
        color: "#facc15",
        border: "rgba(250,204,21,0.25)",
      };
    }

    if (up.includes("IN_TRANSIT")) {
      return {
        bg: "rgba(34,211,238,0.10)",
        color: "#22d3ee",
        border: "rgba(34,211,238,0.25)",
      };
    }

    if (up.includes("RECEIVED")) {
      return {
        bg: "rgba(74,222,128,0.10)",
        color: "#4ade80",
        border: "rgba(74,222,128,0.25)",
      };
    }

    if (up.includes("CLEARED")) {
      return {
        bg: "rgba(168,85,247,0.10)",
        color: "#c084fc",
        border: "rgba(168,85,247,0.25)",
      };
    }

    if (up.includes("ARRIVED")) {
      return {
        bg: "rgba(96,165,250,0.10)",
        color: "#60a5fa",
        border: "rgba(96,165,250,0.25)",
      };
    }

    if (
      up.includes("DOCUMENTS_VERIFIED") ||
      up.includes("VERIFIED")
    ) {
      return {
        bg: "rgba(251,146,60,0.10)",
        color: "#fb923c",
        border: "rgba(251,146,60,0.25)",
      };
    }

    if (up.includes("PENDING")) {
      return {
        bg: "rgba(148,163,184,0.10)",
        color: "#94a3b8",
        border: "rgba(148,163,184,0.25)",
      };
    }

    if (up.includes("DELIVERED")) {
      return {
        bg: "rgba(34,197,94,0.12)",
        color: "#22c55e",
        border: "rgba(34,197,94,0.30)",
      };
    }

    if (up.includes("ON_HOLD")) {
      return {
        bg: "rgba(251,146,60,0.10)",
        color: "#fb923c",
        border: "rgba(251,146,60,0.25)",
      };
    }

    if (up.includes("CANCELLED")) {
      return {
        bg: "rgba(248,113,113,0.10)",
        color: "#f87171",
        border: "rgba(248,113,113,0.25)",
      };
    }

    return {
      bg: "rgba(255,255,255,0.08)",
      color: "white",
      border: "rgba(255,255,255,0.15)",
    };
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filtered = records.filter((record) => {
    const trackingNumber =
      record.trackingNumber ||
      record.tracking_number ||
      `TRK-${record.id || ""}`;

    const shipmentNumber =
      record.shipmentNumber ||
      record.shipment_number ||
      "";

    const location =
      record.currentLocation ||
      record.current_location ||
      record.origin ||
      "";

    const text = `
      ${trackingNumber}
      ${shipmentNumber}
      ${record.status || ""}
      ${location}
      ${record.origin || ""}
      ${record.destination || ""}
    `.toLowerCase();

    const matchesSearch = text.includes(
      search.toLowerCase()
    );

    const matchesStatus =
      statusFilter === "All" ||
      (record.status || "").toUpperCase() ===
        statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  // =========================================================
  // STATISTICS
  // =========================================================

  const total = records.length;

  const processing = records.filter(
    (record) =>
      record.status === "PROCESSING"
  ).length;

  const inTransit = records.filter(
    (record) =>
      record.status === "IN_TRANSIT"
  ).length;

  const delivered = records.filter(
    (record) =>
      record.status === "DELIVERED"
  ).length;

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="dashboard-content">

      {/* HEADER */}

      <div className="glass-header">

        <div>
          <h2>
            Shipment Tracking

            {isLive && (
              <span
                style={{
                  color: "#4ade80",
                  fontSize: 11,
                  marginLeft: 10,
                  fontWeight: 700,
                }}
              >
                ● LIVE
              </span>
            )}
          </h2>

          <p>
            Monitor shipment locations and current
            shipment statuses.
          </p>
        </div>

        <div className="status-badge">
          <span></span>
          {isLive ? "Live Tracking" : "Tracking Online"}
        </div>

      </div>

      {/* STATISTICS */}

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
                fontSize: 10,
              }}
            >
              TOTAL SHIPMENTS
            </small>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginTop: 5,
              }}
            >
              {total}
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background:
                "rgba(34,211,238,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            🚢
          </div>

        </div>

        {/* PROCESSING */}

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
                fontSize: 10,
              }}
            >
              PROCESSING
            </small>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginTop: 5,
              }}
            >
              {processing}
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background:
                "rgba(250,204,21,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            ⚙️
          </div>

        </div>

        {/* IN TRANSIT */}

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
                fontSize: 10,
              }}
            >
              IN TRANSIT
            </small>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginTop: 5,
              }}
            >
              {inTransit}
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background:
                "rgba(96,165,250,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            📍
          </div>

        </div>

        {/* DELIVERED */}

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
                fontSize: 10,
              }}
            >
              DELIVERED
            </small>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                marginTop: 5,
              }}
            >
              {delivered}
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background:
                "rgba(74,222,128,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            ✓
          </div>

        </div>

      </div>

      {/* TRACKING CARD */}

      <section className="master-card">

        <div className="master-head">

          <div>
            <h3>All Shipments Tracking</h3>

            <p
              style={{
                fontSize: 11,
                color:
                  "rgba(255,255,255,0.5)",
              }}
            >
              Last checked:{" "}
              {lastUpdate.toLocaleTimeString()}{" "}
              · {filtered.length} record
              {filtered.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >

            {/* LIVE */}

            <button
              onClick={() => setIsLive(!isLive)}
              style={{
                background: isLive
                  ? "rgba(74,222,128,0.10)"
                  : "rgba(255,255,255,0.06)",
                border: isLive
                  ? "1px solid rgba(74,222,128,0.30)"
                  : "1px solid rgba(255,255,255,0.10)",
                color: isLive
                  ? "#4ade80"
                  : "white",
                padding: "7px 13px",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isLive
                ? "● Live ON"
                : "○ Live OFF"}
            </button>

            {/* REFRESH */}

            <button
              onClick={fetchData}
              style={{
                background:
                  "rgba(255,255,255,0.06)",
                border:
                  "1px solid rgba(255,255,255,0.10)",
                color: "white",
                padding: "7px 13px",
                borderRadius: 20,
                fontSize: 10,
                cursor: "pointer",
              }}
            >
              ↻ Refresh
            </button>

            {/* STATUS FILTER */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              style={{
                background: "#111827",
                border:
                  "1px solid rgba(255,255,255,0.10)",
                color: "white",
                borderRadius: 20,
                padding: "7px 12px",
                fontSize: 10,
                cursor: "pointer",
              }}
            >
              <option value="All">
                All Status
              </option>
              <option value="RECEIVED">
                RECEIVED
              </option>
              <option value="PROCESSING">
                PROCESSING
              </option>
              <option value="DOCUMENTS_VERIFIED">
                DOCUMENTS_VERIFIED
              </option>
              <option value="CUSTOMS_CLEARED">
                CUSTOMS_CLEARED
              </option>
              <option value="IN_TRANSIT">
                IN_TRANSIT
              </option>
              <option value="ARRIVED">
                ARRIVED
              </option>
              <option value="DELIVERED">
                DELIVERED
              </option>
              <option value="ON_HOLD">
                ON_HOLD
              </option>
              <option value="CANCELLED">
                CANCELLED
              </option>
            </select>

          </div>

        </div>

        {/* SEARCH */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 15,
            marginBottom: 15,
            background:
              "rgba(255,255,255,0.04)",
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "8px 12px",
          }}
        >

          <span
            style={{
              color:
                "rgba(255,255,255,0.4)",
              fontSize: 16,
            }}
          >
            ⌕
          </span>

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search shipment number, tracking number, location..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: 12,
            }}
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "transparent",
                border: "none",
                color:
                  "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}

        </div>

        {/* LOADING */}

        {loading ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color:
                "rgba(255,255,255,0.5)",
              fontSize: 13,
            }}
          >
            Loading tracking records...
          </div>
        ) : (

          <div
            style={{
              overflowX: "auto",
            }}
          >

            <table
              style={{
                width: "100%",
                minWidth: 850,
                borderCollapse: "collapse",
              }}
            >

              <thead>

                <tr>

                  {[
                    "TRACKING NO",
                    "SHIPMENT",
                    "STATUS",
                    "LOCATION",
                    "UPDATED",
                    "ACTION",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding:
                          "12px 10px",
                        fontSize: 10,
                        color:
                          "rgba(255,255,255,0.45)",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.08)",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}

                </tr>

              </thead>

              <tbody>

                {filtered.map(
                  (record, index) => {

                    const trackingNumber =
                      record.trackingNumber ||
                      record.tracking_number ||
                      `TRK-1000${
                        index + 1
                      }`;

                    const shipmentNumber =
                      record.shipmentNumber ||
                      record.shipment_number ||
                      "-";

                    const location =
                      record.currentLocation ||
                      record.current_location ||
                      record.origin ||
                      "Unknown";

                    const status =
                      record.status ||
                      "PENDING";

                    const style =
                      getStatusColor(status);

                    return (
                      <tr
                        key={
                          record._id ||
                          record.id ||
                          index
                        }
                      >

                        <td
                          style={{
                            padding:
                              "14px 10px",
                            borderBottom:
                              "1px solid rgba(255,255,255,0.05)",
                            color:
                              "#22d3ee",
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {trackingNumber}
                        </td>

                        <td
                          style={{
                            padding:
                              "14px 10px",
                            borderBottom:
                              "1px solid rgba(255,255,255,0.05)",
                            fontSize: 12,
                          }}
                        >
                          {shipmentNumber}
                        </td>

                        <td
                          style={{
                            padding:
                              "14px 10px",
                            borderBottom:
                              "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <span
                            style={{
                              display:
                                "inline-block",
                              background:
                                style.bg,
                              color:
                                style.color,
                              border:
                                `1px solid ${style.border}`,
                              padding:
                                "5px 10px",
                              borderRadius: 10,
                              fontSize: 9,
                              fontWeight: 800,
                              letterSpacing:
                                "0.4px",
                            }}
                          >
                            {status}
                          </span>
                        </td>

                        <td
                          style={{
                            padding:
                              "14px 10px",
                            borderBottom:
                              "1px solid rgba(255,255,255,0.05)",
                            fontSize: 12,
                            color:
                              "rgba(255,255,255,0.7)",
                          }}
                        >
                          📍 {location}
                        </td>

                        <td
                          style={{
                            padding:
                              "14px 10px",
                            borderBottom:
                              "1px solid rgba(255,255,255,0.05)",
                            fontSize: 11,
                            color:
                              "rgba(255,255,255,0.5)",
                          }}
                        >
                          {lastUpdate.toLocaleTimeString()}
                        </td>

                        <td
                          style={{
                            padding:
                              "14px 10px",
                            borderBottom:
                              "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <button
                            onClick={() =>
                              setSelected(
                                record
                              )
                            }
                            style={{
                              background:
                                "rgba(34,211,238,0.08)",
                              border:
                                "1px solid rgba(34,211,238,0.20)",
                              color:
                                "#22d3ee",
                              padding:
                                "7px 12px",
                              borderRadius: 8,
                              cursor:
                                "pointer",
                              fontSize: 10,
                              fontWeight: 700,
                            }}
                          >
                            View →
                          </button>
                        </td>

                      </tr>
                    );
                  }
                )}

                {filtered.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign:
                          "center",
                        padding: 45,
                        color:
                          "rgba(255,255,255,0.4)",
                        fontSize: 12,
                      }}
                    >
                      No tracking records
                      found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

      {/* DETAILS MODAL */}

      {selected && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.65)",
            backdropFilter:
              "blur(10px)",
            display: "grid",
            placeItems: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() =>
            setSelected(null)
          }
        >

          <div
            className="master-card"
            style={{
              width: "100%",
              maxWidth: 520,
              background:
                "#111827",
              border:
                "1px solid rgba(255,255,255,0.10)",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="master-head">

              <div>
                <h3>
                  Tracking Details
                </h3>

                <p
                  style={{
                    fontSize: 11,
                    color:
                      "rgba(255,255,255,0.5)",
                  }}
                >
                  Shipment tracking information
                </p>
              </div>

              <button
                onClick={() =>
                  setSelected(null)
                }
                style={{
                  background:
                    "rgba(255,255,255,0.06)",
                  border:
                    "1px solid rgba(255,255,255,0.10)",
                  color: "white",
                  padding:
                    "7px 12px",
                  borderRadius: 8,
                  cursor:
                    "pointer",
                  fontSize: 11,
                }}
              >
                Close
              </button>

            </div>

            <div
              style={{
                display: "grid",
                gap: 14,
                marginTop: 18,
              }}
            >

              {/* Tracking Number */}

              <div
                style={{
                  padding: 15,
                  background:
                    "rgba(34,211,238,0.05)",
                  border:
                    "1px solid rgba(34,211,238,0.12)",
                  borderRadius: 10,
                }}
              >

                <small
                  style={{
                    color:
                      "rgba(255,255,255,0.45)",
                    fontSize: 10,
                  }}
                >
                  TRACKING NUMBER
                </small>

                <div
                  style={{
                    marginTop: 5,
                    color:
                      "#22d3ee",
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  {selected.trackingNumber ||
                    selected.tracking_number ||
                    `TRK-${selected.id}`}
                </div>

              </div>

              {/* Details Grid */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 12,
                }}
              >

                <div
                  style={{
                    background:
                      "rgba(255,255,255,0.035)",
                    border:
                      "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    padding: 13,
                  }}
                >
                  <small
                    style={{
                      color:
                        "rgba(255,255,255,0.4)",
                      fontSize: 9,
                    }}
                  >
                    STATUS
                  </small>

                  <div
                    style={{
                      marginTop: 6,
                    }}
                  >
                    {(() => {
                      const status =
                        selected.status ||
                        "PENDING";

                      const style =
                        getStatusColor(
                          status
                        );

                      return (
                        <span
                          style={{
                            background:
                              style.bg,
                            color:
                              style.color,
                            border:
                              `1px solid ${style.border}`,
                            padding:
                              "4px 9px",
                            borderRadius:
                              8,
                            fontSize: 9,
                            fontWeight:
                              800,
                          }}
                        >
                          {status}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "rgba(255,255,255,0.035)",
                    border:
                      "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    padding: 13,
                  }}
                >
                  <small
                    style={{
                      color:
                        "rgba(255,255,255,0.4)",
                      fontSize: 9,
                    }}
                  >
                    LOCATION
                  </small>

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                    }}
                  >
                    📍{" "}
                    {selected.currentLocation ||
                      selected.current_location ||
                      selected.origin ||
                      "Unknown"}
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "rgba(255,255,255,0.035)",
                    border:
                      "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    padding: 13,
                  }}
                >
                  <small
                    style={{
                      color:
                        "rgba(255,255,255,0.4)",
                      fontSize: 9,
                    }}
                  >
                    SHIPMENT
                  </small>

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                    }}
                  >
                    {selected.shipmentNumber ||
                      selected.shipment_number ||
                      "-"}
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "rgba(255,255,255,0.035)",
                    border:
                      "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                    padding: 13,
                  }}
                >
                  <small
                    style={{
                      color:
                        "rgba(255,255,255,0.4)",
                      fontSize: 9,
                    }}
                  >
                    DESTINATION
                  </small>

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 12,
                    }}
                  >
                    {selected.destination ||
                      "-"}
                  </div>
                </div>

              </div>

              {/* TIMELINE */}

              <div
                style={{
                  background:
                    "rgba(255,255,255,0.035)",
                  border:
                    "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  padding: 15,
                }}
              >

                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  Shipment Timeline
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color:
                      "rgba(255,255,255,0.55)",
                    lineHeight: 1.8,
                  }}
                >
                  📦 RECEIVED
                  <br />
                  ↓
                  <br />
                  ⚙️ PROCESSING
                  <br />
                  ↓
                  <br />
                  🚚 IN TRANSIT
                  <br />
                  ↓
                  <br />
                  📍 ARRIVED
                  <br />
                  ↓
                  <br />
                  ✅ DELIVERED
                </div>

              </div>

              {/* REFRESH */}

              <button
                onClick={() => {
                  setSelected(null);
                  fetchData();
                }}
                style={{
                  width: "100%",
                  background:
                    "linear-gradient(135deg, #0891b2, #2563eb)",
                  border: "none",
                  color: "white",
                  padding: 11,
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ↻ Refresh Tracking
              </button>

            </div>

          </div>

        </div>

      )}

      {/* BACK */}

      <div
        style={{
          marginTop: 18,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background:
              "rgba(255,255,255,0.06)",
            border:
              "1px solid rgba(255,255,255,0.10)",
            color: "white",
            padding:
              "9px 15px",
            borderRadius: 10,
            cursor:
              "pointer",
            fontSize: 12,
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

    </main>
  );
}