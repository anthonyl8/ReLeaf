/**
 * Left sidebar - Temperature trends and Heat Resilience Alerts.
 * Matches Figma layout with green sustainability theme.
 */
export default function LeftPanel({ hotspots, simulation }) {
  const temps = (hotspots || []).map((h) => h.temperature_c ?? 0);
  const avgTemp = temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : "—";
  const maxTemp = temps.length ? Math.max(...temps).toFixed(1) : "—";

  const alerts = (hotspots || [])
    .slice(0, 5)
    .sort((a, b) => (b.temperature_c ?? 0) - (a.temperature_c ?? 0))
    .map((h) => ({
      temp: Math.round(h.temperature_c ?? 0),
      label: `Hotspot ${h.lat?.toFixed(4)}, ${h.lon?.toFixed(4)}`,
    }));

  return (
    <div style={styles.container}>
      {/* Temperature trends placeholder */}
      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>Temperature Overview</h3>
        <div style={styles.trendRow}>
          <div style={styles.trendItem}>
            <span style={styles.trendValue}>{avgTemp}°C</span>
            <span style={styles.trendLabel}>Avg (Hotspots)</span>
          </div>
          <div style={styles.trendItem}>
            <span style={styles.trendValue}>{maxTemp}°C</span>
            <span style={styles.trendLabel}>Peak</span>
          </div>
        </div>
        {simulation?.area_cooling_c > 0 && (
          <div style={styles.cooling}>
            <span style={styles.coolingValue}>−{simulation.area_cooling_c}°C</span>
            <span style={styles.coolingLabel}>Cooling from interventions</span>
          </div>
        )}
      </div>

      {/* Heat Resilience Alerts */}
      <div style={styles.panel}>
        <h3 style={styles.panelTitle}>Heat Resilience Alerts</h3>
        {alerts.length > 0 ? (
          <ul style={styles.alertList}>
            {alerts.map((a, i) => (
              <li key={i} style={styles.alertItem}>
                <span style={getTempStyle(a.temp)}>{a.temp}°C</span>
                <span style={styles.alertText}> — Elevated heat zone</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.emptyText}>No critical hotspots in view.</p>
        )}
      </div>
    </div>
  );
}

function getTempStyle(temp) {
  if (temp >= 42) return { color: "#ef4444", fontWeight: 700 };
  if (temp >= 35) return { color: "#f97316", fontWeight: 600 };
  if (temp >= 30) return { color: "#eab308", fontWeight: 600 };
  return { color: "#4ade80", fontWeight: 500 };
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
  },
  panel: {
    background: "linear-gradient(135deg, rgba(20, 40, 32, 0.95) 0%, rgba(26, 45, 38, 0.95) 100%)",
    borderRadius: "12px",
    border: "1px solid rgba(74, 222, 128, 0.25)",
    padding: "14px 16px",
    backdropFilter: "blur(12px)",
  },
  panelTitle: {
    color: "#4ade80",
    fontSize: "0.85rem",
    fontWeight: 700,
    marginBottom: "12px",
    letterSpacing: "0.3px",
  },
  trendRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "8px",
  },
  trendItem: {
    display: "flex",
    flexDirection: "column",
  },
  trendValue: {
    color: "#fff",
    fontSize: "1.25rem",
    fontWeight: 700,
  },
  trendLabel: {
    color: "#888",
    fontSize: "0.7rem",
    marginTop: "2px",
  },
  cooling: {
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "1px solid rgba(74, 222, 128, 0.2)",
  },
  coolingValue: {
    color: "#4ade80",
    fontSize: "1.1rem",
    fontWeight: 700,
    display: "block",
  },
  coolingLabel: {
    color: "#888",
    fontSize: "0.68rem",
  },
  alertList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  alertItem: {
    padding: "6px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    fontSize: "0.8rem",
    color: "#ccc",
  },
  alertText: {
    color: "#888",
  },
  emptyText: {
    color: "#666",
    fontSize: "0.8rem",
    margin: 0,
  },
};
