import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

function Documents({ onBack }) {
  const [documents, setDocuments] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    document_number: "",
    shipment_id: "",
    document_type: "Commercial Invoice",
    file_name: "",
    file_path: "",
  });

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // ================================
  // LOAD DOCUMENTS
  // ================================
  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/documents`, {
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load documents"
        );
      }

      const data =
        result.documents ||
        result.data?.documents ||
        result.data ||
        [];

      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // LOAD SHIPMENTS
  // ================================
  const loadShipments = async () => {
    try {
      const response = await fetch(`${API_URL}/shipments`, {
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load shipments"
        );
      }

      const data =
        result.shipments ||
        result.data?.shipments ||
        result.data ||
        [];

      setShipments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Shipment loading error:", err.message);
    }
  };

  useEffect(() => {
    loadDocuments();
    loadShipments();
  }, []);

  // ================================
  // FORM CHANGE
  // ================================
  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // ================================
  // CREATE DOCUMENT
  // ================================
  const createDocument = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response = await fetch(`${API_URL}/documents`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create document"
        );
      }

      alert("Document created successfully.");

      setFormData({
        document_number: "",
        shipment_id: "",
        document_type: "Commercial Invoice",
        file_name: "",
        file_path: "",
      });

      setShowForm(false);

      await loadDocuments();
    } catch (err) {
      setError(err.message || "Failed to create document");
    }
  };

  // ================================
  // VERIFY DOCUMENT
  // ================================
  const verifyDocument = async (id) => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/documents/${id}/verify`,
        {
          method: "PATCH",
          headers: getHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to verify document"
        );
      }

      alert("Document verified successfully.");

      await loadDocuments();
    } catch (err) {
      setError(err.message || "Failed to verify document");
    }
  };

  // ================================
  // DOCUMENT COUNTS
  // ================================
  const verifiedCount = documents.filter(
    (doc) => doc.status === "VERIFIED"
  ).length;

  const pendingCount = documents.filter(
    (doc) => doc.status !== "VERIFIED"
  ).length;

  return (
    <main className="dashboard-content">

      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <div className="glass-header">
        <div>
          <h2>Documents</h2>
          <p>
            Manage customs and shipment documents.
          </p>
        </div>

        <div className="status-badge">
          <span></span>
          System Online
        </div>
      </div>

      {/* =========================================
          DOCUMENT ANALYTICS
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
                fontSize: "11px",
              }}
            >
              Total Documents
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
                {documents.length}
              </b>

              <span
                style={{
                  background: "rgba(168,85,247,0.15)",
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
              background: "rgba(168,85,247,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: "20px",
            }}
          >
            📄
          </div>
        </div>

        {/* VERIFIED */}
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
              Verified Documents
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
                {verifiedCount}
              </b>

              <span
                style={{
                  background: "rgba(74,222,128,0.15)",
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
              background: "rgba(74,222,128,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: "20px",
            }}
          >
            ✅
          </div>
        </div>

        {/* PENDING */}
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
              Pending Verification
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
                {pendingCount}
              </b>

              <span
                style={{
                  background: "rgba(34,211,238,0.15)",
                  color: "#22d3ee",
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
              background: "rgba(34,211,238,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: "20px",
            }}
          >
            ⏳
          </div>
        </div>
      </div>

      {/* =========================================
          MAIN DOCUMENT MANAGEMENT CARD
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
              <h3>Document Management</h3>

              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Create, review and verify customs documents.
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
                onClick={loadDocuments}
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
                onClick={() =>
                  setShowForm((previous) => !previous)
                }
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
                  : "+ Add Document"}
              </button>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "rgba(239,68,68,0.12)",
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
            CREATE DOCUMENT FORM
        ========================================= */}
        {showForm && (
          <div
            style={{
              marginTop: "16px",
              padding: "18px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.035)",
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
                Create Document
              </h3>

              <p
                style={{
                  marginTop: "4px",
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "11px",
                }}
              >
                Register a new customs or shipment document.
              </p>
            </div>

            <form onSubmit={createDocument}>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "14px",
                }}
              >

                {/* DOCUMENT NUMBER */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    Document Number
                  </label>

                  <input
                    type="text"
                    name="document_number"
                    value={formData.document_number}
                    onChange={handleChange}
                    placeholder="DOC-0002"
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

                {/* SHIPMENT */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    Shipment
                  </label>

                  <select
                    name="shipment_id"
                    value={formData.shipment_id}
                    onChange={handleChange}
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
                  >
                    <option
                      value=""
                      style={{ color: "black" }}
                    >
                      Select Shipment
                    </option>

                    {shipments.map((shipment) => (
                      <option
                        key={shipment.id}
                        value={shipment.id}
                        style={{ color: "black" }}
                      >
                        {shipment.shipment_number ||
                          `Shipment #${shipment.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DOCUMENT TYPE */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    Document Type
                  </label>

                  <select
                    name="document_type"
                    value={formData.document_type}
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
                      value="Commercial Invoice"
                      style={{ color: "black" }}
                    >
                      Commercial Invoice
                    </option>

                    <option
                      value="Packing List"
                      style={{ color: "black" }}
                    >
                      Packing List
                    </option>

                    <option
                      value="Bill of Lading"
                      style={{ color: "black" }}
                    >
                      Bill of Lading
                    </option>

                    <option
                      value="SAD500"
                      style={{ color: "black" }}
                    >
                      SAD500
                    </option>

                    <option
                      value="Certificate of Origin"
                      style={{ color: "black" }}
                    >
                      Certificate of Origin
                    </option>
                  </select>
                </div>

                {/* FILE NAME */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    File Name
                  </label>

                  <input
                    type="text"
                    name="file_name"
                    value={formData.file_name}
                    onChange={handleChange}
                    placeholder="commercial_invoice.pdf"
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

                {/* FILE PATH */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    File Path
                  </label>

                  <input
                    type="text"
                    name="file_path"
                    value={formData.file_path}
                    onChange={handleChange}
                    placeholder="/documents/commercial_invoice.pdf"
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
                  onClick={() => setShowForm(false)}
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
                  Create Document
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================
            DOCUMENT RECORDS
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
                Document Records
              </h3>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                View and verify registered documents.
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
              {documents.length} records
            </span>
          </div>

          {/* LOADING */}
          {loading && (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "rgba(255,255,255,0.55)",
                background:
                  "rgba(255,255,255,0.03)",
                borderRadius: "12px",
              }}
            >
              Loading documents...
            </div>
          )}

          {/* EMPTY */}
          {!loading && documents.length === 0 && (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "rgba(255,255,255,0.55)",
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
                📄
              </div>

              <div>No documents found.</div>
            </div>
          )}

          {/* DOCUMENT CARDS */}
          {!loading && documents.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "12px",
              }}
            >
              {documents.map((document) => {

                const verified =
                  document.status === "VERIFIED";

                return (
                  <div
                    key={document.id}
                    style={{
                      background:
                        "rgba(255,255,255,0.04)",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "14px",
                      padding: "16px",
                      transition: "0.2s",
                    }}
                  >

                    {/* CARD HEADER */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "10px",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "white",
                          }}
                        >
                          {document.document_number ||
                            document.file_name ||
                            `DOC-${document.id}`}
                        </div>

                        <div
                          style={{
                            fontSize: "10px",
                            color:
                              "rgba(255,255,255,0.45)",
                            marginTop: "3px",
                          }}
                        >
                          Document #{document.id}
                        </div>
                      </div>

                      <span
                        style={{
                          padding: "4px 9px",
                          borderRadius: "10px",
                          fontSize: "10px",
                          background: verified
                            ? "rgba(74,222,128,0.12)"
                            : "rgba(34,211,238,0.12)",
                          color: verified
                            ? "#4ade80"
                            : "#22d3ee",
                        }}
                      >
                        {document.status || "PENDING"}
                      </span>
                    </div>

                    {/* DETAILS */}
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
                            color:
                              "rgba(255,255,255,0.45)",
                            fontSize: "11px",
                          }}
                        >
                          Shipment
                        </span>

                        <strong
                          style={{
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.85)",
                          }}
                        >
                          {document.shipment_number ||
                            document.shipment_id ||
                            "-"}
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
                            color:
                              "rgba(255,255,255,0.45)",
                            fontSize: "11px",
                          }}
                        >
                          Type
                        </span>

                        <strong
                          style={{
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.85)",
                            textAlign: "right",
                          }}
                        >
                          {document.document_type ||
                            "-"}
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
                            color:
                              "rgba(255,255,255,0.45)",
                            fontSize: "11px",
                          }}
                        >
                          Created
                        </span>

                        <strong
                          style={{
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.85)",
                          }}
                        >
                          {document.created_at || "-"}
                        </strong>
                      </div>

                      {document.file_name && (
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
                              color:
                                "rgba(255,255,255,0.45)",
                              fontSize: "11px",
                            }}
                          >
                            File
                          </span>

                          <strong
                            style={{
                              fontSize: "11px",
                              color:
                                "rgba(255,255,255,0.85)",
                              textAlign: "right",
                              wordBreak: "break-word",
                            }}
                          >
                            {document.file_name}
                          </strong>
                        </div>
                      )}
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
                      {verified ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            color: "#4ade80",
                            fontSize: "11px",
                          }}
                        >
                          ✓ Document Verified
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            verifyDocument(document.id)
                          }
                          style={{
                            width: "100%",
                            background:
                              "linear-gradient(135deg,#22d3ee,#2563eb)",
                            border: "none",
                            color: "white",
                            padding: "9px",
                            borderRadius: "9px",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: "600",
                          }}
                        >
                          ✓ Verify Document
                        </button>
                      )}
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

export default Documents;