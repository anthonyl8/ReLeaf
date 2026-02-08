/**
 * Dismissible alert bar - green-tinted for sustainability theme.
 * Shows heat resilience alerts when hotspots exist.
 */
export default function AlertBar({ hotspots, dismissed, onDismiss }) {
  if (dismissed || !hotspots?.length) return null;

  const count = hotspots.length;
  const hottest = Math.max(...hotspots.map((h) => h.temperature_c ?? 0), 0);

  return (
    <div style={styles.alert}>
      <span style={styles.infoIcon}>ℹ️</span>
      <span style={styles.text}>
        {count} heat hotspot{count !== 1 ? "s" : ""} detected (up to {Math.round(hottest)}°C). 
        Add trees, cool roofs, or bio-swales to reduce urban heat.
      </span>
      <button
        onClick={onDismiss}
        style={styles.closeBtn}
        title="Dismiss"
        aria-label="Dismiss alert"
      >
        ×
      </button>
    </div>
  );
}

const styles = {
  alert: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 20px",
    background: "linear-gradient(135deg, #14532d 0%, #166534 100%)",
    borderBottom: "1px solid rgba(74, 222, 128, 0.3)",
    color: "#fff",
    fontSize: "0.85rem",
    zIndex: 199,
    boxShadow: "0 1px 8px rgba(0,0,0,0.15)",
  },
  infoIcon: {
    fontSize: "1rem",
    flexShrink: 0,
  },
  text: {
    flex: 1,
    lineHeight: 1.4,
  },
  closeBtn: {
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: 600,
    lineHeight: 1,
    flexShrink: 0,
  },
};
