import { useState } from "react";

const API_URL = "http://localhost:4000/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Invalid username or password."
        );
      }

      const token =
        result.token ||
        result.data?.token;

      const user =
        result.user ||
        result.data?.user;

      if (!token) {
        throw new Error(
          "Login succeeded but no access token was returned."
        );
      }

      if (!user) {
        throw new Error(
          "Login succeeded but no user information was returned."
        );
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onLogin(user);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top left, rgba(34,211,238,0.14), transparent 35%), radial-gradient(circle at bottom right, rgba(168,85,247,0.16), transparent 35%), #07111f",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >

      {/* BACKGROUND GLOW */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(34,211,238,0.07)",
          filter: "blur(90px)",
          top: "-220px",
          left: "-180px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(168,85,247,0.07)",
          filter: "blur(90px)",
          bottom: "-220px",
          right: "-180px",
          pointerEvents: "none",
        }}
      />

      {/* LOGIN CARD */}
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          position: "relative",
          zIndex: 1,
          background: "rgba(10, 22, 38, 0.82)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "22px",
          padding: "34px",
          boxSizing: "border-box",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow:
            "0 25px 70px rgba(0,0,0,0.45), 0 0 40px rgba(34,211,238,0.06)",
        }}
      >

        {/* TOP CYAN LINE */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #22d3ee, transparent)",
            boxShadow:
              "0 0 15px rgba(34,211,238,0.8)",
          }}
        />

        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >

          {/* LOGO */}
          <div
            style={{
              width: "68px",
              height: "68px",
              margin: "0 auto 18px",
              borderRadius: "18px",
              display: "grid",
              placeItems: "center",
              background:
                "linear-gradient(135deg, #22d3ee, #2563eb)",
              boxShadow:
                "0 10px 30px rgba(34,211,238,0.25)",
              fontSize: "20px",
              fontWeight: "800",
              letterSpacing: "1px",
            }}
          >
            SCA
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
            }}
          >
            SAC Customs
          </h1>

          <h2
            style={{
              margin: "5px 0 0",
              fontSize: "15px",
              fontWeight: "500",
              color: "#22d3ee",
            }}
          >
            Management System
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: "11px",
              color: "rgba(255,255,255,0.48)",
            }}
          >
            Customs & Logistics Management Platform
          </p>
        </div>

        {/* SYSTEM STATUS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            marginBottom: "22px",
            padding: "8px",
            borderRadius: "9px",
            background: "rgba(74,222,128,0.06)",
            border: "1px solid rgba(74,222,128,0.12)",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 8px rgba(74,222,128,0.8)",
            }}
          />

          <span
            style={{
              fontSize: "10px",
              color: "#86efac",
            }}
          >
            System Online
          </span>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "rgba(239,68,68,0.10)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5",
              fontSize: "12px",
              lineHeight: "1.5",
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>

          {/* USERNAME */}
          <div style={{ marginBottom: "17px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "11px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              Username
            </label>

            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "15px",
                  opacity: 0.6,
                }}
              >
                👤
              </span>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter your username"
                autoComplete="username"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 13px 12px 40px",
                  borderRadius: "10px",
                  border:
                    "1px solid rgba(255,255,255,0.10)",
                  background:
                    "rgba(255,255,255,0.045)",
                  color: "white",
                  outline: "none",
                  fontSize: "12px",
                }}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "11px",
                fontWeight: "500",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              Password
            </label>

            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "15px",
                  opacity: 0.6,
                }}
              >
                🔒
              </span>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 13px 12px 40px",
                  borderRadius: "10px",
                  border:
                    "1px solid rgba(255,255,255,0.10)",
                  background:
                    "rgba(255,255,255,0.045)",
                  color: "white",
                  outline: "none",
                  fontSize: "12px",
                }}
              />
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "10px",
              background: loading
                ? "rgba(34,211,238,0.35)"
                : "linear-gradient(135deg,#22d3ee,#2563eb)",
              color: "white",
              fontSize: "13px",
              fontWeight: "700",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              boxShadow: loading
                ? "none"
                : "0 8px 25px rgba(34,211,238,0.20)",
              transition: "0.2s",
            }}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>

        {/* FOOTER */}
        <div
          style={{
            marginTop: "25px",
            paddingTop: "17px",
            borderTop:
              "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "10px",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            SAC Customs Management System
          </p>

          <p
            style={{
              margin: "5px 0 0",
              fontSize: "9px",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Secure Customs & Logistics Operations
          </p>
        </div>

      </div>
    </div>
  );
}