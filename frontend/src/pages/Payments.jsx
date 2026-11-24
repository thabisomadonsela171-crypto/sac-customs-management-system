import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

export default function Payments({ onBack }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    paymentNumber: `PAY-${Date.now().toString().slice(-4)}`,
    declaration: "",
    customer: "",
    amount: "",
    method: "BANK_TRANSFER",
    status: "PENDING",
  });

  // ================================
  // LOAD PAYMENTS
  // ================================
  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      const data =
        json.data?.payments ||
        json.payments ||
        json.data ||
        [];

      setRecords(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Payment loading error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================================
  // STATUS STYLE
  // ================================
  const getStatusStyle = (status) => {
    const up = (status || "").toUpperCase();

    if (up === "PAID") {
      return {
        bg: "rgba(34,197,94,0.18)",
        color: "#4ade80",
        border: "rgba(34,197,94,0.45)",
      };
    }

    if (up === "PENDING") {
      return {
        bg: "rgba(251,191,36,0.18)",
        color: "#fbbf24",
        border: "rgba(251,191,36,0.45)",
      };
    }

    if (up === "PROCESSING") {
      return {
        bg: "rgba(59,130,246,0.18)",
        color: "#60a5fa",
        border: "rgba(59,130,246,0.45)",
      };
    }

    if (up === "FAILED") {
      return {
        bg: "rgba(239,68,68,0.18)",
        color: "#f87171",
        border: "rgba(239,68,68,0.45)",
      };
    }

    return {
      bg: "rgba(255,255,255,0.08)",
      color: "white",
      border: "rgba(255,255,255,0.18)",
    };
  };

  // ================================
  // UPDATE PAYMENT STATUS
  // ================================
  const handleStatusChange = async (id, newStatus) => {
    console.log("Updating payment:", id, newStatus);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/payments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      console.log(
        "STATUS RESPONSE:",
        response.status,
        result
      );

      if (!response.ok) {
        alert(
          result.message ||
            result.error ||
            `Failed to update payment status (${response.status})`
        );

        await fetchData();
        return;
      }

      // Update screen only after backend succeeds
      setRecords((prev) =>
        prev.map((r) =>
          r._id === id || r.id === id
            ? { ...r, status: newStatus }
            : r
        )
      );

      console.log("Payment status updated successfully.");

    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);

      alert("Could not update payment status.");

      await fetchData();
    }
  };

  // ================================
  // CREATE PAYMENT
  // ================================
  const handleCreate = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        paymentNumber: form.paymentNumber,
        declarationNumber: form.declaration,
        declaration: form.declaration,
        customer: form.customer,
        amount: Number(form.amount),
        method: form.method,
        status: form.status,
        paymentDate: new Date(),
      };

      const res = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok) {
        setShowCreate(false);

        setForm({
          paymentNumber: `PAY-${Date.now()
            .toString()
            .slice(-4)}`,
          declaration: "",
          customer: "",
          amount: "",
          method: "BANK_TRANSFER",
          status: "PENDING",
        });

        await fetchData();

        alert("Payment created successfully!");
      } else {
        alert(
          json.message ||
            "Failed to create payment"
        );
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // SEARCH
  // ================================
  const filtered = records.filter((r) => {
    const text = `
      ${r.paymentNumber || ""}
      ${r.customer?.name || r.customer || ""}
      ${r.declarationNumber || r.declaration || ""}
      ${r.method || ""}
      ${r.status || ""}
    `.toLowerCase();

    return text.includes(
      search.toLowerCase()
    );
  });

  // ================================
  // STATISTICS
  // ================================
  const totalPayments = records.length;

  const pendingPayments = records.filter(
    (r) =>
      (r.status || "").toUpperCase() ===
      "PENDING"
  ).length;

  const paidPayments = records.filter(
    (r) =>
      (r.status || "").toUpperCase() ===
      "PAID"
  ).length;

  const processingPayments = records.filter(
    (r) =>
      (r.status || "").toUpperCase() ===
      "PROCESSING"
  ).length;

  // ================================
  // STYLES
  // ================================
  const inputStyle = {
    width: "100%",
    marginTop: 5,
    background: "rgba(255,255,255,0.06)",
    border:
      "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: "10px 12px",
    color: "white",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <main className="dashboard-content">

      {/* =====================================
          HEADER
      ====================================== */}
      <div className="glass-header">
        <div>
          <h2>Payments</h2>

          <p>
            Manage customs duties, invoices and
            payments.{" "}
            {filtered.length} records found
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
            className="add-btn"
            style={{
              background:
                "rgba(255,255,255,0.08)",
              color: "white",
            }}
            onClick={onBack}
          >
            ← Back
          </button>

          <button
            className="add-btn"
            style={{
              background:
                "rgba(255,255,255,0.08)",
              color: "white",
            }}
            onClick={fetchData}
          >
            ↻ Refresh
          </button>

          <button
            className="add-btn"
            onClick={() =>
              setShowCreate(true)
            }
          >
            + Create Payment
          </button>
        </div>
      </div>

      {/* =====================================
          STATISTICS
      ====================================== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: 16,
          marginBottom: 18,
        }}
      >
        {[
          {
            label: "Total Payments",
            value: totalPayments,
            icon: "💳",
            color: "#22d3ee",
          },
          {
            label: "Pending",
            value: pendingPayments,
            icon: "⏳",
            color: "#fbbf24",
          },
          {
            label: "Processing",
            value: processingPayments,
            icon: "🔄",
            color: "#60a5fa",
          },
          {
            label: "Paid",
            value: paidPayments,
            icon: "✓",
            color: "#4ade80",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="analytics-card"
            style={{
              marginBottom: 0,
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <small
                style={{
                  color:
                    "rgba(255,255,255,0.5)",
                  fontSize: 11,
                }}
              >
                {card.label}
              </small>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 5,
                }}
              >
                <b
                  style={{
                    fontSize: 23,
                  }}
                >
                  {card.value}
                </b>

                <span
                  style={{
                    background:
                      `${card.color}22`,
                    color: card.color,
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
                width: 42,
                height: 42,
                borderRadius: 12,
                background:
                  `${card.color}18`,
                display: "grid",
                placeItems: "center",
                fontSize: 20,
              }}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* =====================================
          PAYMENT RECORDS
      ====================================== */}
      <div className="master-card">

        <div
          className="master-head"
          style={{
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3>Payment Records</h3>

            <p
              style={{
                fontSize: 11,
                color:
                  "rgba(255,255,255,0.5)",
                marginTop: 4,
              }}
            >
              View and manage customs payment
              transactions.
            </p>
          </div>

          <div
            className="master-search"
            style={{
              width: 300,
              maxWidth: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>⌕</span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search payments..."
                style={{
                  flex: 1,
                  background:
                    "transparent",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontSize: 12,
                }}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              padding: 30,
              textAlign: "center",
              color:
                "rgba(255,255,255,0.6)",
            }}
          >
            Loading payments...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color:
                "rgba(255,255,255,0.55)",
            }}
          >
            <div
              style={{
                fontSize: 35,
              }}
            >
              💳
            </div>

            <p
              style={{
                marginTop: 10,
              }}
            >
              No payment records found.
            </p>
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              marginTop: 10,
            }}
          >
            <table className="master-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Payment Number</th>
                  <th>Declaration</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r, i) => {
                  const style =
                    getStatusStyle(
                      r.status
                    );

                  return (
                    <tr
                      key={
                        r._id ||
                        r.id ||
                        i
                      }
                    >
                      <td>
                        {r.id || i + 1}
                      </td>

                      <td
                        style={{
                          color:
                            "#22d3ee",
                          fontWeight: 700,
                        }}
                      >
                        {r.paymentNumber ||
                          `PAY-000${i + 1}`}
                      </td>

                      <td>
                        {r.declarationNumber ||
                          r.declaration ||
                          "DEC-0001"}
                      </td>

                      <td>
                        {r.customer?.name ||
                          r.customer ||
                          "SCA Logistics"}
                      </td>

                      <td
                        style={{
                          fontWeight: 700,
                        }}
                      >
                        ZAR{" "}
                        {Number(
                          r.amount || 25000
                        ).toLocaleString()}
                      </td>

                      <td>
                        {r.method ||
                          "BANK_TRANSFER"}
                      </td>

                      <td>
                        <select
                          value={
                            r.status ||
                            "PENDING"
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              r._id ||
                                r.id,
                              e.target.value
                            )
                          }
                          style={{
                            background:
                              style.bg,
                            color:
                              style.color,
                            border:
                              `1px solid ${style.border}`,
                            padding:
                              "5px 12px",
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 800,
                            outline:
                              "none",
                            cursor:
                              "pointer",
                          }}
                        >
                          <option
                            value="PROCESSING"
                            style={{
                              color:
                                "black",
                            }}
                          >
                            PROCESSING
                          </option>

                          <option
                            value="PAID"
                            style={{
                              color:
                                "black",
                            }}
                          >
                            PAID
                          </option>

                          <option
                            value="PENDING"
                            style={{
                              color:
                                "black",
                            }}
                          >
                            PENDING
                          </option>

                          <option
                            value="FAILED"
                            style={{
                              color:
                                "black",
                            }}
                          >
                            FAILED
                          </option>
                        </select>
                      </td>

                      <td>
                        {r.paymentDate
                          ? new Date(
                              r.paymentDate
                            ).toLocaleString()
                          : new Date().toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================
          CREATE PAYMENT MODAL
      ====================================== */}
      {showCreate && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.72)",
            backdropFilter:
              "blur(12px)",
            display: "grid",
            placeItems: "center",
            zIndex: 2000,
            padding: 20,
          }}
          onClick={() =>
            setShowCreate(false)
          }
        >
          <form
            onSubmit={handleCreate}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="master-card"
            style={{
              width: "100%",
              maxWidth: 520,
              background:
                "linear-gradient(145deg,#151936,#1e1b4b)",
              border:
                "1px solid rgba(34,211,238,0.18)",
            }}
          >
            <div className="master-head">

              <div>
                <h3>Create Payment</h3>

                <p
                  style={{
                    fontSize: 11,
                    color:
                      "rgba(255,255,255,0.5)",
                    marginTop: 4,
                  }}
                >
                  Register a customs payment.
                </p>
              </div>

              <button
                type="button"
                className="add-btn"
                onClick={() =>
                  setShowCreate(false)
                }
                style={{
                  background:
                    "rgba(255,255,255,0.08)",
                }}
              >
                ✕
              </button>

            </div>

            <div
              style={{
                display: "grid",
                gap: 13,
                marginTop: 15,
              }}
            >

              {/* PAYMENT NUMBER */}
              <div>
                <label
                  style={{
                    fontSize: 11,
                    color:
                      "rgba(255,255,255,0.55)",
                  }}
                >
                  Payment Number
                </label>

                <input
                  value={
                    form.paymentNumber
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paymentNumber:
                        e.target.value,
                    })
                  }
                  required
                  style={inputStyle}
                />
              </div>

              {/* DECLARATION + CUSTOMER */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(180px,1fr))",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      color:
                        "rgba(255,255,255,0.55)",
                    }}
                  >
                    Declaration No
                  </label>

                  <input
                    value={
                      form.declaration
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        declaration:
                          e.target.value,
                      })
                    }
                    placeholder="DEC-0001"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 11,
                      color:
                        "rgba(255,255,255,0.55)",
                    }}
                  >
                    Customer
                  </label>

                  <input
                    value={
                      form.customer
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        customer:
                          e.target.value,
                      })
                    }
                    placeholder="ABC Imports"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* AMOUNT + METHOD */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(180px,1fr))",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 11,
                      color:
                        "rgba(255,255,255,0.55)",
                    }}
                  >
                    Amount (ZAR)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.amount
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount:
                          e.target.value,
                      })
                    }
                    placeholder="30000"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 11,
                      color:
                        "rgba(255,255,255,0.55)",
                    }}
                  >
                    Payment Method
                  </label>

                  <select
                    value={
                      form.method
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        method:
                          e.target.value,
                      })
                    }
                    style={inputStyle}
                  >
                    <option
                      value="BANK_TRANSFER"
                      style={{
                        color:
                          "black",
                      }}
                    >
                      BANK_TRANSFER
                    </option>

                    <option
                      value="CASH"
                      style={{
                        color:
                          "black",
                      }}
                    >
                      CASH
                    </option>

                    <option
                      value="CARD"
                      style={{
                        color:
                          "black",
                      }}
                    >
                      CARD
                    </option>
                  </select>
                </div>
              </div>

              {/* STATUS */}
              <div>
                <label
                  style={{
                    fontSize: 11,
                    color:
                      "rgba(255,255,255,0.55)",
                  }}
                >
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                >
                  <option
                    value="PENDING"
                    style={{
                      color:
                        "black",
                    }}
                  >
                    PENDING
                  </option>

                  <option
                    value="PROCESSING"
                    style={{
                      color:
                        "black",
                    }}
                  >
                    PROCESSING
                  </option>

                  <option
                    value="PAID"
                    style={{
                      color:
                        "black",
                    }}
                  >
                    PAID
                  </option>
                </select>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={saving}
                className="add-btn"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: 5,
                  fontSize: 13,
                  opacity: saving
                    ? 0.6
                    : 1,
                }}
              >
                {saving
                  ? "Saving..."
                  : "💾 Create Payment"}
              </button>

            </div>
          </form>
        </div>
      )}
    </main>
  );
}