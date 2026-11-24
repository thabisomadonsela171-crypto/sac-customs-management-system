function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">

      <div className="module-icon">
        {icon}
      </div>

      <span>{title}</span>

      <strong>{value ?? 0}</strong>

    </div>
  );
}

export default StatCard;