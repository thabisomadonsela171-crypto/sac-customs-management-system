export default function Settings({ onBack }) {
  return (
    <main className="dashboard-content">

      {/* Header */}
      <div className="glass-header">
        <div>
          <h2>System Settings</h2>
          <p>
            Manage SAC Customs system configuration and system information.
          </p>
        </div>

        <div className="status-badge">
          <span></span>
          System Online
        </div>
      </div>

      {/* System Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 18,
        }}
      >

        {/* Status */}
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
              SYSTEM STATUS
            </small>

            <div
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 6,
                color: "#4ade80",
              }}
            >
              Online
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "rgba(74,222,128,0.12)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            ●
          </div>
        </div>

        {/* Backend */}
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
              BACKEND SERVER
            </small>

            <div
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 6,
              }}
            >
              Node.js / Express
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "rgba(34,211,238,0.12)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            ⚙️
          </div>
        </div>

        {/* Database */}
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
              DATABASE
            </small>

            <div
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 6,
              }}
            >
              SQLite
            </div>
          </div>

          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "rgba(168,85,247,0.12)",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
            }}
          >
            🗄️
          </div>
        </div>

      </div>

      {/* System Information */}
      <div className="master-card">

        <div className="master-head">
          <div>
            <h3>System Information</h3>

            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Current SAC Customs system configuration.
            </p>
          </div>

          <button
            onClick={onBack}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              padding: "9px 14px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            ← Back
          </button>
        </div>

        {/* Information Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 14,
            marginTop: 18,
          }}
        >

          {/* System Name */}
          <div
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <small
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 10,
              }}
            >
              SYSTEM NAME
            </small>

            <div
              style={{
                marginTop: 7,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              SAC Customs Management System
            </div>
          </div>

          {/* System Status */}
          <div
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <small
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 10,
              }}
            >
              SYSTEM STATUS
            </small>

            <div
              style={{
                marginTop: 7,
                fontSize: 14,
                fontWeight: 600,
                color: "#4ade80",
              }}
            >
              ● Online
            </div>
          </div>

          {/* Backend */}
          <div
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <small
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 10,
              }}
            >
              BACKEND SERVER
            </small>

            <div
              style={{
                marginTop: 7,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Node.js / Express
            </div>
          </div>

          {/* Database */}
          <div
            style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <small
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 10,
              }}
            >
              DATABASE
            </small>

            <div
              style={{
                marginTop: 7,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              SQLite
            </div>
          </div>

        </div>

        {/* Configuration Notice */}
        <div
          style={{
            marginTop: 18,
            padding: 14,
            borderRadius: 12,
            background: "rgba(34,211,238,0.06)",
            border: "1px solid rgba(34,211,238,0.15)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#22d3ee",
              marginBottom: 5,
            }}
          >
            System Configuration
          </div>

          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6,
            }}
          >
            The SAC Customs Management System is currently connected
            to the Node.js / Express backend and SQLite database.
          </div>
        </div>

      </div>

    </main>
  );
}