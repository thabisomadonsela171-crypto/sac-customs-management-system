function Topbar({ user, onLogout }) {
  return (
    <header className="topbar">

      <div className="brand">

        <div className="brand-logo">
          SC
        </div>

        <div className="brand-text">
          <strong>SAC CUSTOMS</strong>
          <span>Customs Management System</span>
        </div>

      </div>

      <div className="user-area">

        <span>
          {user?.username || "User"}{" "}
          {user?.role || ""}
        </span>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Topbar;