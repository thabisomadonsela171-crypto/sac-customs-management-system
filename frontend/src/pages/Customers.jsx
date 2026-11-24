import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

const glassCard = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 14,
};

const primaryButton = {
  background: "linear-gradient(90deg,#a5f3fc,#22d3ee)",
  border: "none",
  color: "black",
  padding: "7px 14px",
  borderRadius: 20,
  fontSize: 10,
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButton = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
  padding: "7px 14px",
  borderRadius: 20,
  fontSize: 10,
  fontWeight: 700,
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "10px 12px",
  color: "white",
  outline: "none",
  fontSize: 11,
};

export default function Customers({ onBack }) {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [editingCustomer, setEditingCustomer] =
    useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
  });

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_URL}/customers`,
        {
          headers: getHeaders(),
        }
      );

      const result = await res.json();

      console.log(
        "CUSTOMERS RESPONSE:",
        result
      );

      if (!res.ok) {
        throw new Error(
          result.message ||
            "Failed to load customers"
        );
      }

      const data =
        result.data?.customers ||
        result.data ||
        result.customers ||
        [];

      setCustomers(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "CUSTOMERS ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      company_name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
    });

    setEditingCustomer(null);
    setShowForm(false);
    setError("");
  };

  const handleAddCustomer = async () => {
    if (!formData.company_name.trim()) {
      setError(
        "Company name is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const res = await fetch(
        `${API_URL}/customers`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            customer_number: `CUST-${Date.now()}`,
            company_name:
              formData.company_name.trim(),
            contact_person:
              formData.contact_person.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
          }),
        }
      );

      const result = await res.json();

      console.log(
        "CREATE CUSTOMER RESPONSE:",
        result
      );

      if (!res.ok) {
        throw new Error(
          result.message ||
            "Failed to create customer"
        );
      }

      resetForm();

      await loadCustomers();
    } catch (err) {
      console.error(
        "CREATE CUSTOMER ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to create customer"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);

    setFormData({
      company_name:
        customer.company_name || "",
      contact_person:
        customer.contact_person || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });

    setShowForm(true);
    setError("");
  };

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) {
      setError(
        "No customer selected for editing."
      );
      return;
    }

    if (!formData.company_name.trim()) {
      setError(
        "Company name is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const id =
        editingCustomer.id ||
        editingCustomer._id;

      const res = await fetch(
        `${API_URL}/customers/${id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            company_name:
              formData.company_name.trim(),
            contact_person:
              formData.contact_person.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message ||
            "Failed to update customer"
        );
      }

      resetForm();

      await loadCustomers();
    } catch (err) {
      console.error(
        "UPDATE CUSTOMER ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to update customer"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingCustomer) {
      await handleUpdateCustomer();
    } else {
      await handleAddCustomer();
    }
  };

  const handleDelete = async (customer) => {
    const id =
      customer.id || customer._id;

    if (!id) {
      setError(
        "Customer ID was not found."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${customer.company_name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const res = await fetch(
        `${API_URL}/customers/${id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message ||
            "Failed to delete customer"
        );
      }

      setCustomers((previous) =>
        previous.filter(
          (item) =>
            (item.id || item._id) !== id
        )
      );
    } catch (err) {
      console.error(
        "DELETE CUSTOMER ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to delete customer"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCustomers =
    customers.filter((customer) => {
      const value =
        search.trim().toLowerCase();

      if (!value) return true;

      return (
        String(
          customer.company_name || ""
        )
          .toLowerCase()
          .includes(value) ||
        String(
          customer.contact_person || ""
        )
          .toLowerCase()
          .includes(value) ||
        String(
          customer.email || ""
        )
          .toLowerCase()
          .includes(value) ||
        String(
          customer.customer_number || ""
        )
          .toLowerCase()
          .includes(value)
      );
    });

  return (
    <main
      className="dashboard-content"
      style={{
        padding: 16,
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at top left,#6a3de8 0%, #2a1a5e 50%, #0a0e28 100%)",
        color: "white",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          ...glassCard,
          padding: "12px 16px",
          marginBottom: 14,
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 800,
              margin: 0,
            }}
          >
            SAC Customs Management System
          </h2>

          <p
            style={{
              fontSize: 10,
              opacity: 0.5,
              margin: "4px 0 0",
            }}
          >
            Customs & Logistics Management
            Platform
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background:
                "rgba(34,197,94,0.15)",
              border:
                "1px solid rgba(34,197,94,0.3)",
              padding: "5px 10px",
              borderRadius: 20,
              fontSize: 10,
              color: "#4ade80",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: "#4ade80",
                borderRadius: "50%",
              }}
            />

            System Online
          </div>

          {onBack && (
            <button
              onClick={onBack}
              style={secondaryButton}
            >
              ← Dashboard
            </button>
          )}
        </div>
      </div>

      {/* CUSTOMER MANAGEMENT */}

      <section
        style={{
          ...glassCard,
          padding: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 15,
                margin: 0,
              }}
            >
              Customer Management
            </h3>

            <p
              style={{
                fontSize: 10,
                opacity: 0.5,
                margin: "5px 0 0",
              }}
            >
              View, register, edit and delete
              customs clients.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
            }}
          >
            <button
              onClick={loadCustomers}
              style={secondaryButton}
            >
              Refresh
            </button>

            <button
              onClick={() => {
                if (showForm) {
                  resetForm();
                } else {
                  setShowForm(true);
                  setError("");
                }
              }}
              style={primaryButton}
            >
              {showForm
                ? "Close Form"
                : "+ Add Customer"}
            </button>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              marginBottom: 14,
              padding: 10,
              borderRadius: 10,
              background:
                "rgba(239,68,68,0.15)",
              border:
                "1px solid rgba(239,68,68,0.3)",
              color: "#fca5a5",
              fontSize: 11,
            }}
          >
            {error}
          </div>
        )}

        {/* ADD / EDIT FORM */}

        {showForm && (
          <div
            style={{
              ...glassCard,
              padding: 14,
              marginBottom: 14,
              background:
                "rgba(255,255,255,0.04)",
            }}
          >
            <div
              style={{
                marginBottom: 12,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 13,
                }}
              >
                {editingCustomer
                  ? "Edit Customer"
                  : "Register New Customer"}
              </h3>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 9,
                  opacity: 0.5,
                }}
              >
                Enter the customer's
                information below.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2,minmax(0,1fr))",
                  gap: 10,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      opacity: 0.6,
                      marginBottom: 5,
                    }}
                  >
                    Company Name *
                  </label>

                  <input
                    name="company_name"
                    value={
                      formData.company_name
                    }
                    onChange={handleChange}
                    placeholder="Company name"
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      opacity: 0.6,
                      marginBottom: 5,
                    }}
                  >
                    Contact Person
                  </label>

                  <input
                    name="contact_person"
                    value={
                      formData.contact_person
                    }
                    onChange={handleChange}
                    placeholder="Contact person"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      opacity: 0.6,
                      marginBottom: 5,
                    }}
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      opacity: 0.6,
                      marginBottom: 5,
                    }}
                  >
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    style={inputStyle}
                  />
                </div>

                <div
                  style={{
                    gridColumn:
                      "1 / -1",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: 10,
                      opacity: 0.6,
                      marginBottom: 5,
                    }}
                  >
                    Address
                  </label>

                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Company address"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 8,
                }}
              >
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    ...primaryButton,
                    opacity: saving
                      ? 0.6
                      : 1,
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingCustomer
                    ? "Update Customer"
                    : "Save Customer"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  style={secondaryButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SEARCH + COUNT */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search customers..."
            style={{
              ...inputStyle,
              maxWidth: 300,
            }}
          />

          <span
            style={{
              background:
                "rgba(34,211,238,0.15)",
              color: "#22d3ee",
              padding: "5px 10px",
              borderRadius: 15,
              fontSize: 10,
            }}
          >
            {filteredCustomers.length} Customers
          </span>
        </div>

        {/* CUSTOMER LIST */}

        {loading ? (
          <div
            style={{
              padding: 30,
              textAlign: "center",
              opacity: 0.5,
              fontSize: 11,
            }}
          >
            Loading customers...
          </div>
        ) : filteredCustomers.length ===
          0 ? (
          <div
            style={{
              padding: 30,
              textAlign: "center",
              opacity: 0.5,
              fontSize: 11,
            }}
          >
            No customers found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3,minmax(0,1fr))",
              gap: 10,
            }}
          >
            {filteredCustomers.map(
              (customer) => {
                const id =
                  customer.id ||
                  customer._id;

                return (
                  <div
                    key={id}
                    style={{
                      ...glassCard,
                      padding: 12,
                      background:
                        "rgba(255,255,255,0.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "flex-start",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          background:
                            "rgba(34,211,238,0.12)",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 17,
                        }}
                      >
                        👥
                      </div>

                      <span
                        style={{
                          fontSize: 8,
                          background:
                            "rgba(34,197,94,0.12)",
                          color: "#86efac",
                          padding:
                            "3px 7px",
                          borderRadius: 10,
                        }}
                      >
                        Active
                      </span>
                    </div>

                    <h4
                      style={{
                        fontSize: 12,
                        margin:
                          "10px 0 4px",
                      }}
                    >
                      {customer.company_name ||
                        "Unnamed Company"}
                    </h4>

                    <div
                      style={{
                        fontSize: 10,
                        opacity: 0.6,
                        lineHeight: 1.7,
                      }}
                    >
                      <div>
                        Customer No:{" "}
                        {customer.customer_number ||
                          "—"}
                      </div>

                      <div>
                        Contact:{" "}
                        {customer.contact_person ||
                          "—"}
                      </div>

                      <div>
                        Email:{" "}
                        {customer.email ||
                          "—"}
                      </div>

                      <div>
                        Phone:{" "}
                        {customer.phone ||
                          "—"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 7,
                        marginTop: 10,
                      }}
                    >
                      <button
                        onClick={() =>
                          handleEdit(
                            customer
                          )
                        }
                        style={{
                          ...secondaryButton,
                          padding:
                            "6px 11px",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            customer
                          )
                        }
                        disabled={
                          deletingId === id
                        }
                        style={{
                          ...secondaryButton,
                          padding:
                            "6px 11px",
                          color: "#fca5a5",
                          border:
                            "1px solid rgba(239,68,68,0.25)",
                        }}
                      >
                        {deletingId === id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}