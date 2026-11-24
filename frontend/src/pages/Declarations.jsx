import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

export default function Declarations({ onBack }) {
  const [declarations, setDeclarations] = useState([]);
  const [shipments, setShipments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    declaration_number: "",
    shipment_id: "",
    hs_code: "",
    goods_description: "",
    customs_value: "",
    currency: "ZAR",
    country_of_origin: "South Africa",
    status: "DRAFT",
  });

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const getArray = (result, names = []) => {
    if (Array.isArray(result)) return result;

    if (Array.isArray(result?.data)) {
      return result.data;
    }

    for (const name of names) {
      if (Array.isArray(result?.[name])) {
        return result[name];
      }
    }

    if (result?.data && typeof result.data === "object") {
      for (const name of names) {
        if (Array.isArray(result.data?.[name])) {
          return result.data[name];
        }
      }
    }

    return [];
  };

  const loadDeclarations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/declarations`, {
        headers: getHeaders(),
      });

      const result = await response.json();

      console.log("DECLARATIONS RESPONSE:", result);

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load declarations"
        );
      }

      const declarationList = getArray(result, [
        "declarations",
        "data",
      ]);

      setDeclarations(declarationList);
    } catch (err) {
      console.error("DECLARATIONS ERROR:", err);
      setError(err.message || "Failed to load declarations");
    } finally {
      setLoading(false);
    }
  };

  const loadShipments = async () => {
    try {
      const response = await fetch(`${API_URL}/shipments`, {
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        return;
      }

      const shipmentList = getArray(result, [
        "shipments",
        "data",
      ]);

      setShipments(shipmentList);
    } catch (err) {
      console.error("SHIPMENTS ERROR:", err);
    }
  };

  useEffect(() => {
    loadDeclarations();
    loadShipments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (
        !form.declaration_number ||
        !form.shipment_id ||
        !form.hs_code ||
        !form.goods_description ||
        !form.customs_value
      ) {
        setError("Please complete all required fields.");
        setSaving(false);
        return;
      }

      const response = await fetch(`${API_URL}/declarations`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          declaration_number: form.declaration_number,
          shipment_id: Number(form.shipment_id),
          hs_code: form.hs_code,
          goods_description: form.goods_description,
          customs_value: Number(form.customs_value),
          currency: form.currency,
          country_of_origin: form.country_of_origin,
          status: form.status,
        }),
      });

      const result = await response.json();

      console.log("CREATE DECLARATION RESPONSE:", result);

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create declaration"
        );
      }

      setSuccess("Declaration created successfully.");

      setForm({
        declaration_number: "",
        shipment_id: "",
        hs_code: "",
        goods_description: "",
        customs_value: "",
        currency: "ZAR",
        country_of_origin: "South Africa",
        status: "DRAFT",
      });

      setShowForm(false);

      await loadDeclarations();
    } catch (err) {
      console.error("CREATE DECLARATION ERROR:", err);
      setError(err.message || "Failed to create declaration");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-ZA");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        background:
          "radial-gradient(ellipse at top left,#6a3de8 0%, #2a1a5e 50%, #0a0e28 100%)",
        color: "white",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          padding: 18,
          marginBottom: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
            }}
          >
            Customs Declarations
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              fontSize: 11,
              opacity: 0.6,
            }}
          >
            Create, view and manage customs declarations.
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
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              padding: "8px 14px",
              borderRadius: 20,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ← Back
          </button>

          <button
            onClick={loadDeclarations}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              padding: "8px 14px",
              borderRadius: 20,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Refresh
          </button>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setError("");
              setSuccess("");
            }}
            style={{
              background:
                "linear-gradient(90deg,#a5f3fc,#22d3ee)",
              border: "none",
              color: "black",
              padding: "8px 16px",
              borderRadius: 20,
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            {showForm ? "Close Form" : "+ New Declaration"}
          </button>
        </div>
      </div>

      {/* MESSAGES */}

      {error && (
        <div
          style={{
            marginBottom: 14,
            padding: 12,
            borderRadius: 10,
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5",
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: 14,
            padding: 12,
            borderRadius: 10,
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#86efac",
            fontSize: 12,
          }}
        >
          {success}
        </div>
      )}

      {/* CREATE FORM */}

      {showForm && (
        <form
          onSubmit={handleCreate}
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: 18,
            marginBottom: 18,
          }}
        >
          <h3
            style={{
              marginTop: 0,
              fontSize: 15,
            }}
          >
            Create Customs Declaration
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <input
              name="declaration_number"
              value={form.declaration_number}
              onChange={handleChange}
              placeholder="Declaration Number"
              style={inputStyle}
            />

            <select
              name="shipment_id"
              value={form.shipment_id}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">
                Select Shipment
              </option>

              {shipments.map((shipment) => (
                <option
                  key={shipment.id || shipment.shipment_id}
                  value={shipment.id || shipment.shipment_id}
                >
                  {shipment.shipment_number ||
                    shipment.reference_number ||
                    shipment.id ||
                    shipment.shipment_id}
                </option>
              ))}
            </select>

            <input
              name="hs_code"
              value={form.hs_code}
              onChange={handleChange}
              placeholder="HS Code"
              style={inputStyle}
            />

            <input
              name="customs_value"
              type="number"
              value={form.customs_value}
              onChange={handleChange}
              placeholder="Customs Value"
              style={inputStyle}
            />

            <input
              name="currency"
              value={form.currency}
              onChange={handleChange}
              placeholder="Currency"
              style={inputStyle}
            />

            <input
              name="country_of_origin"
              value={form.country_of_origin}
              onChange={handleChange}
              placeholder="Country of Origin"
              style={inputStyle}
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="DRAFT">DRAFT</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="CLEARED">CLEARED</option>
            </select>

            <input
              name="goods_description"
              value={form.goods_description}
              onChange={handleChange}
              placeholder="Goods Description"
              style={{
                ...inputStyle,
                gridColumn: "1 / -1",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: 14,
              background:
                "linear-gradient(90deg,#a5f3fc,#22d3ee)",
              border: "none",
              color: "black",
              padding: "9px 18px",
              borderRadius: 20,
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 800,
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Creating..." : "Create Declaration"}
          </button>
        </form>
      )}

      {/* DECLARATIONS TABLE */}

      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          padding: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 15,
            }}
          >
            Declaration Records
          </h3>

          <span
            style={{
              background: "rgba(34,211,238,0.15)",
              color: "#22d3ee",
              padding: "4px 10px",
              borderRadius: 15,
              fontSize: 10,
            }}
          >
            {declarations.length} Records
          </span>
        </div>

        {loading ? (
          <div
            style={{
              padding: 30,
              textAlign: "center",
              opacity: 0.6,
            }}
          >
            Loading declarations...
          </div>
        ) : declarations.length === 0 ? (
          <div
            style={{
              padding: 30,
              textAlign: "center",
              opacity: 0.6,
            }}
          >
            No declarations found.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 11,
              }}
            >
              <thead>
                <tr
                  style={{
                    opacity: 0.5,
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: 10 }}>
                    ID
                  </th>

                  <th>Declaration No.</th>

                  <th>Shipment</th>

                  <th>HS Code</th>

                  <th>Goods</th>

                  <th>Value</th>

                  <th>Country</th>

                  <th>Status</th>

                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {declarations.map((declaration, index) => (
                  <tr
                    key={
                      declaration.id ||
                      declaration.declaration_id ||
                      index
                    }
                    style={{
                      borderTop:
                        "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <td style={{ padding: 10 }}>
                      {declaration.id ||
                        declaration.declaration_id ||
                        "—"}
                    </td>

                    <td>
                      {declaration.declaration_number ||
                        declaration.number ||
                        "—"}
                    </td>

                    <td>
                      {declaration.shipment_id || "—"}
                    </td>

                    <td>
                      {declaration.hs_code || "—"}
                    </td>

                    <td>
                      {declaration.goods_description ||
                        "—"}
                    </td>

                    <td>
                      {declaration.currency || "ZAR"}{" "}
                      {declaration.customs_value ?? "—"}
                    </td>

                    <td>
                      {declaration.country_of_origin ||
                        "—"}
                    </td>

                    <td>
                      <span
                        style={{
                          background:
                            declaration.status ===
                            "CLEARED"
                              ? "rgba(34,197,94,0.15)"
                              : "rgba(250,204,21,0.15)",
                          color:
                            declaration.status ===
                            "CLEARED"
                              ? "#86efac"
                              : "#fde047",
                          padding: "4px 8px",
                          borderRadius: 10,
                          fontSize: 9,
                          fontWeight: 700,
                        }}
                      >
                        {declaration.status || "DRAFT"}
                      </span>
                    </td>

                    <td>
                      {formatDate(
                        declaration.created_at ||
                          declaration.createdAt ||
                          declaration.updated_at
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "10px 12px",
  color: "white",
  outline: "none",
  fontSize: 11,
};