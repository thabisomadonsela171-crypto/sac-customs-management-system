import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

const STATUS_OPTIONS = [
  "RECEIVED",
  "PROCESSING",
  "DOCUMENTS_VERIFIED",
  "CUSTOMS_CLEARED",
  "IN_TRANSIT",
  "ARRIVED",
  "DELIVERED",
  "ON_HOLD",
  "CANCELLED",
];

const EMPTY_FORM = {
  shipment_number: "",
  customer_id: "",
  origin: "",
  destination: "",
  transport_mode: "ROAD",
  expected_arrival: "",
};

export default function Shipments({ onBack }) {
  const [shipments, setShipments] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // GET CURRENT USER ROLE
  // =========================================================

  const getUserRole = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) return "";

      const user = JSON.parse(storedUser);

      return user?.role || "";
    } catch (error) {
      console.error("User role error:", error);
      return "";
    }
  };

  const userRole = getUserRole();

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    loadShipments();

    if (userRole === "ADMIN" || userRole === "CLERK") {
      loadCustomers();
    }
  }, []);

  // =========================================================
  // LOAD SHIPMENTS
  // =========================================================

  const loadShipments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(`${API_URL}/shipments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to load shipments."
        );
      }

      const data =
        result.data?.shipments ||
        result.data ||
        result.shipments ||
        [];

      setShipments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Shipments error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD CUSTOMERS
  // =========================================================

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(`${API_URL}/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to load customers."
        );
      }

      const data =
        result.data?.customers ||
        result.data ||
        result.customers ||
        [];

      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Customers error:", err);
      setCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // =========================================================
  // GENERATE NEXT SHIPMENT NUMBER
  // =========================================================

  const generateShipmentNumber = () => {
    let highestNumber = 0;

    shipments.forEach((shipment) => {
      const number =
        shipment.shipment_number ||
        shipment.shipmentNumber ||
        "";

      const match = String(number).match(/^SHP-(\d+)$/);

      if (match) {
        const numericPart = parseInt(match[1], 10);

        if (numericPart > highestNumber) {
          highestNumber = numericPart;
        }
      }
    });

    return `SHP-${String(highestNumber + 1).padStart(4, "0")}`;
  };

  // =========================================================
  // OPEN CREATE FORM
  // =========================================================

  const openCreateForm = () => {
    setError("");
    setSuccess("");

    setFormData({
      ...EMPTY_FORM,
      shipment_number: generateShipmentNumber(),
    });

    setShowForm(true);
  };

  // =========================================================
  // CLOSE CREATE FORM
  // =========================================================

  const closeCreateForm = () => {
    setShowForm(false);
    setFormData(EMPTY_FORM);
    setError("");
  };

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE SHIPMENT
  // =========================================================

  const createShipment = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.customer_id) {
      setError("Please select a customer.");
      return;
    }

    if (!formData.origin.trim()) {
      setError("Please enter the shipment origin.");
      return;
    }

    if (!formData.destination.trim()) {
      setError("Please enter the shipment destination.");
      return;
    }

    if (!formData.transport_mode) {
      setError("Please select a transport mode.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(`${API_URL}/shipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipment_number: formData.shipment_number,
          customer_id: Number(formData.customer_id),
          origin: formData.origin.trim(),
          destination: formData.destination.trim(),
          transport_mode: formData.transport_mode,
          expected_arrival: formData.expected_arrival || null,
          status: "RECEIVED",
        }),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to create shipment."
        );
      }

      setSuccess(
        `Shipment ${formData.shipment_number} created successfully.`
      );

      setShowForm(false);
      setFormData(EMPTY_FORM);

      await loadShipments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CHANGE STATUS
  // =========================================================

  const changeStatus = (id, status) => {
    setShipments((current) =>
      current.map((shipment) =>
        shipment.id === id
          ? {
              ...shipment,
              newStatus: status,
            }
          : shipment
      )
    );
  };

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const updateStatus = async (shipment) => {
    const status =
      shipment.newStatus ||
      shipment.status ||
      "RECEIVED";

    try {
      setUpdating(shipment.id);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(
        `${API_URL}/shipments/${shipment.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message ||
            "Failed to update shipment status."
        );
      }

      setShipments((current) =>
        current.map((item) =>
          item.id === shipment.id
            ? {
                ...item,
                status,
                newStatus: status,
              }
            : item
        )
      );

      setSuccess(
        `Shipment ${
          shipment.shipment_number ||
          shipment.shipmentNumber ||
          ""
        } status updated to ${status}.`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    const styles = {
      RECEIVED: {
        color: "#22d3ee",
        background: "rgba(34,211,238,0.10)",
        border: "1px solid rgba(34,211,238,0.20)",
      },
      PROCESSING: {
        color: "#facc15",
        background: "rgba(250,204,21,0.10)",
        border: "1px solid rgba(250,204,21,0.20)",
      },
      DOCUMENTS_VERIFIED: {
        color: "#a855f7",
        background: "rgba(168,85,247,0.10)",
        border: "1px solid rgba(168,85,247,0.20)",
      },
      CUSTOMS_CLEARED: {
        color: "#4ade80",
        background: "rgba(74,222,128,0.10)",
        border: "1px solid rgba(74,222,128,0.20)",
      },
      IN_TRANSIT: {
        color: "#60a5fa",
        background: "rgba(96,165,250,0.10)",
        border: "1px solid rgba(96,165,250,0.20)",
      },
      ARRIVED: {
        color: "#c084fc",
        background: "rgba(192,132,252,0.10)",
        border: "1px solid rgba(192,132,252,0.20)",
      },
      DELIVERED: {
        color: "#4ade80",
        background: "rgba(74,222,128,0.10)",
        border: "1px solid rgba(74,222,128,0.20)",
      },
      ON_HOLD: {
        color: "#fb923c",
        background: "rgba(251,146,60,0.10)",
        border: "1px solid rgba(251,146,60,0.20)",
      },
      CANCELLED: {
        color: "#f87171",
        background: "rgba(248,113,113,0.10)",
        border: "1px solid rgba(248,113,113,0.20)",
      },
    };

    return (
      styles[status] || {
        color: "rgba(255,255,255,0.7)",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
      }
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="dashboard-content">
        <div className="glass-header">
          <div>
            <h2>Shipments</h2>
            <p>Loading shipment records...</p>
          </div>

          <div className="status-badge">
            <span></span>
            Loading
          </div>
        </div>

        <div
          className="master-card"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 220,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Loading shipments...
        </div>
      </main>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="dashboard-content">

      {/* HEADER */}

      <div className="glass-header">
        <div>
          <h2>Shipment Management</h2>

          <p>
            Manage shipments and update their current status.
          </p>
        </div>

        <div className="status-badge">
          <span></span>
          System Online
        </div>
      </div>

      {/* ALERTS */}

      {error && (
        <div
          style={{
            marginBottom: 15,
            padding: "12px 15px",
            borderRadius: 10,
            background: "rgba(248,113,113,0.08)",
            color: "#f87171",
            border: "1px solid rgba(248,113,113,0.20)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: 15,
            padding: "12px 15px",
            borderRadius: 10,
            background: "rgba(74,222,128,0.08)",
            color: "#4ade80",
            border: "1px solid rgba(74,222,128,0.20)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {success}
        </div>
      )}

      {/* STATISTICS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 18,
        }}
      >

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
                fontWeight: "bold",
                marginTop: 5,
              }}
            >
              {shipments.length}
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "rgba(34,211,238,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            🚢
          </div>
        </div>

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
                fontWeight: "bold",
                marginTop: 5,
              }}
            >
              {
                shipments.filter(
                  (s) => s.status === "PROCESSING"
                ).length
              }
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "rgba(250,204,21,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            ⚙️
          </div>
        </div>

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
              CLEARED
            </small>

            <div
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginTop: 5,
              }}
            >
              {
                shipments.filter(
                  (s) => s.status === "CUSTOMS_CLEARED"
                ).length
              }
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "rgba(74,222,128,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            ✓
          </div>
        </div>

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
                fontWeight: "bold",
                marginTop: 5,
              }}
            >
              {
                shipments.filter(
                  (s) => s.status === "IN_TRANSIT"
                ).length
              }
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "rgba(96,165,250,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            📍
          </div>
        </div>

      </div>

      {/* CREATE FORM */}

      {showForm && (
        <section
          className="master-card"
          style={{ marginBottom: 18 }}
        >

          <div className="master-head">
            <div>
              <h3>Create Shipment</h3>

              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Register a new customs shipment.
              </p>
            </div>

            <button
              type="button"
              onClick={closeCreateForm}
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.20)",
                color: "#f87171",
                padding: "9px 14px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={createShipment}>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 16,
                marginTop: 18,
              }}
            >

              {/* Shipment Number */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 7,
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 12,
                  }}
                >
                  Shipment Number
                </label>

                <input
                  type="text"
                  name="shipment_number"
                  value={formData.shipment_number}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    borderRadius: 9,
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.6)",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Customer */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 7,
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 12,
                  }}
                >
                  Customer
                </label>

                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  disabled={loadingCustomers}
                  required
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    borderRadius: 9,
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    background: "#111827",
                    color: "white",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">
                    {loadingCustomers
                      ? "Loading customers..."
                      : "Select customer"}
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.company_name ||
                        customer.companyName ||
                        customer.customer_number ||
                        `Customer ${customer.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Origin */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 7,
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 12,
                  }}
                >
                  Origin
                </label>

                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="e.g. Durban"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    borderRadius: 9,
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    color: "white",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Destination */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 7,
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 12,
                  }}
                >
                  Destination
                </label>

                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Johannesburg"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    borderRadius: 9,
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    color: "white",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Transport */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 7,
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 12,
                  }}
                >
                  Transport Mode
                </label>

                <select
                  name="transport_mode"
                  value={formData.transport_mode}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    borderRadius: 9,
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    background: "#111827",
                    color: "white",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="ROAD">ROAD</option>
                  <option value="SEA">SEA</option>
                  <option value="AIR">AIR</option>
                  <option value="RAIL">RAIL</option>
                </select>
              </div>

              {/* Expected Arrival */}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: 7,
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 12,
                  }}
                >
                  Expected Arrival
                </label>

                <input
                  type="date"
                  name="expected_arrival"
                  value={formData.expected_arrival}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "11px 12px",
                    borderRadius: 9,
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    color: "white",
                    boxSizing: "border-box",
                  }}
                />
              </div>

            </div>

            {/* Initial Status */}

            <div
              style={{
                marginTop: 18,
                padding: "12px 15px",
                borderRadius: 10,
                background: "rgba(34,211,238,0.06)",
                border:
                  "1px solid rgba(34,211,238,0.14)",
                fontSize: 12,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              <strong style={{ color: "#22d3ee" }}>
                Initial Status:
              </strong>{" "}
              RECEIVED
            </div>

            {/* FORM BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 18,
              }}
            >
              <button
                type="submit"
                disabled={saving}
                style={{
                  background:
                    "linear-gradient(135deg, #0891b2, #2563eb)",
                  border: "none",
                  color: "white",
                  padding: "10px 18px",
                  borderRadius: 10,
                  cursor: saving
                    ? "not-allowed"
                    : "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving
                  ? "Creating..."
                  : "Create Shipment"}
              </button>

              <button
                type="button"
                onClick={closeCreateForm}
                disabled={saving}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border:
                    "1px solid rgba(255,255,255,0.10)",
                  color: "white",
                  padding: "10px 18px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Cancel
              </button>
            </div>

          </form>
        </section>
      )}

      {/* SHIPMENT MANAGEMENT */}

      <section className="master-card">

        <div className="master-head">

          <div>
            <h3>Shipment Management</h3>

            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {shipments.length} shipment
              {shipments.length !== 1 ? "s" : ""} registered
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >

            <button
              onClick={loadShipments}
              style={{
                background: "rgba(255,255,255,0.06)",
                border:
                  "1px solid rgba(255,255,255,0.10)",
                color: "white",
                padding: "9px 14px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ↻ Refresh
            </button>

            {(userRole === "ADMIN" ||
              userRole === "CLERK") && (
              <button
                onClick={openCreateForm}
                style={{
                  background:
                    "linear-gradient(135deg, #0891b2, #2563eb)",
                  border: "none",
                  color: "white",
                  padding: "9px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                + Add Shipment
              </button>
            )}

          </div>

        </div>

        {/* TABLE */}

        <div
          style={{
            overflowX: "auto",
            marginTop: 16,
          }}
        >

          <table
            style={{
              width: "100%",
              minWidth: 1150,
              borderCollapse: "collapse",
            }}
          >

            <thead>

              <tr>

                {[
                  "SHIPMENT NUMBER",
                  "CUSTOMER",
                  "ORIGIN",
                  "DESTINATION",
                  "TRANSPORT",
                  "EXPECTED ARRIVAL",
                  "STATUS",
                  "ACTION",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      textAlign: "left",
                      padding: "12px 10px",
                      fontSize: 10,
                      color: "rgba(255,255,255,0.45)",
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

              {shipments.map((shipment) => {

                const selectedStatus =
                  shipment.newStatus ||
                  shipment.status ||
                  "RECEIVED";

                const statusStyle =
                  getStatusStyle(selectedStatus);

                return (
                  <tr key={shipment.id}>

                    <td
                      style={{
                        padding: "14px 10px",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <strong
                        style={{
                          color: "#22d3ee",
                          fontSize: 12,
                        }}
                      >
                        {shipment.shipment_number ||
                          shipment.shipmentNumber ||
                          "-"}
                      </strong>
                    </td>

                    <td
                      style={{
                        padding: "14px 10px",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",
                        fontSize: 12,
                      }}
                    >
                      {shipment.company_name ||
                        shipment.companyName ||
                        shipment.customer_number ||
                        shipment.customer_id ||
                        "-"}
                    </td>

                    <td
                      style={{
                        padding: "14px 10px",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",
                        fontSize: 12,
                        color:
                          "rgba(255,255,255,0.7)",
                      }}
                    >
                      {shipment.origin || "-"}
                    </td>

                    <td
                      style={{
                        padding: "14px 10px",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",
                        fontSize: 12,
                        color:
                          "rgba(255,255,255,0.7)",
                      }}
                    >
                      {shipment.destination || "-"}
                    </td>

                    <td
                      style={{
                        padding: "14px 10px",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",
                        fontSize: 11,
                      }}
                    >
                      {shipment.transport_mode ||
                        shipment.transportMode ||
                        "-"}
                    </td>

                    <td
                      style={{
                        padding: "14px 10px",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",
                        fontSize: 11,
                      }}
                    >
                      {shipment.expected_arrival ||
                        shipment.expectedArrival ||
                        "-"}
                    </td>

                    {/* STATUS */}

                    <td
                      style={{
                        padding: "10px",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",
                        minWidth: 210,
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >

                        <select
                          value={selectedStatus}
                          onChange={(event) =>
                            changeStatus(
                              shipment.id,
                              event.target.value
                            )
                          }
                          style={{
                            width: 200,
                            height: 36,
                            padding: "5px 9px",
                            borderRadius: 8,
                            background: "#111827",
                            color: "white",
                            border:
                              "1px solid rgba(255,255,255,0.10)",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >

                          {!STATUS_OPTIONS.includes(
                            selectedStatus
                          ) && (
                            <option
                              value={selectedStatus}
                            >
                              {selectedStatus}
                            </option>
                          )}

                          {STATUS_OPTIONS.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}

                        </select>

                        <span
                          style={{
                            ...statusStyle,
                            width: "fit-content",
                            padding: "4px 8px",
                            borderRadius: 8,
                            fontSize: 9,
                            fontWeight: 700,
                          }}
                        >
                          {selectedStatus}
                        </span>

                      </div>

                    </td>

                    {/* ACTION */}

                    <td
                      style={{
                        padding: "14px 10px",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.05)",
                        whiteSpace: "nowrap",
                      }}
                    >

                      <button
                        disabled={
                          updating === shipment.id
                        }
                        onClick={() =>
                          updateStatus(shipment)
                        }
                        style={{
                          background:
                            "rgba(34,211,238,0.08)",
                          border:
                            "1px solid rgba(34,211,238,0.20)",
                          color: "#22d3ee",
                          padding: "7px 12px",
                          borderRadius: 8,
                          cursor:
                            updating === shipment.id
                              ? "not-allowed"
                              : "pointer",
                          fontSize: 11,
                          fontWeight: 600,
                          opacity:
                            updating === shipment.id
                              ? 0.5
                              : 1,
                        }}
                      >
                        {updating === shipment.id
                          ? "Updating..."
                          : "Update"}
                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {/* EMPTY */}

        {shipments.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <div
              style={{
                fontSize: 36,
                marginBottom: 10,
              }}
            >
              🚢
            </div>

            <h3
              style={{
                color: "white",
                marginBottom: 6,
              }}
            >
              No Shipments Found
            </h3>

            <p style={{ fontSize: 12 }}>
              There are currently no shipments
              registered in the system.
            </p>
          </div>
        )}

      </section>

      {/* BACK */}

      <div
        style={{
          marginTop: 18,
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.06)",
            border:
              "1px solid rgba(255,255,255,0.10)",
            color: "white",
            padding: "9px 15px",
            borderRadius: 10,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

    </main>
  );
}