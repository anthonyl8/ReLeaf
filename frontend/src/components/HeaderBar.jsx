/**
 * Top header bar - green sustainability theme.
 * Matches Figma "Urban Heat Resilience Platform" layout.
 */
import SearchBar from "./SearchBar";

/**
 * Top header bar - green sustainability theme.
 * Integrated Navigation and Search to reduce UI clutter.
 */
export default function HeaderBar({ activeTab, onTabChange, onPlaceSelect }) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "heatmap", label: "Heat Map" },
    { id: "carbon", label: "Carbon & ROI" },
  ];

  return (
    <header style={styles.header}>
      {/* Brand */}
      <div style={styles.brandSection}>
        <span style={styles.logo}>🌿</span>
        <div style={styles.brand}>
          <span style={styles.title}>ReLeaf</span>
          <span style={styles.subtitle}>Resilience Platform</span>
        </div>
      </div>

      {/* Navigation Tabs (Centered) */}
      <nav style={styles.nav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.tabActive : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Search Bar (Right) */}
      <div style={styles.searchSection}>
        <SearchBar onPlaceSelect={onPlaceSelect} />
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "0 24px",
    height: "64px",
    background: "linear-gradient(135deg, #14532d 0%, #166534 100%)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
    color: "#fff",
    zIndex: 200,
  },
  brandSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "200px",
  },
  logo: {
    fontSize: "1.8rem",
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
  },
  brand: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    lineHeight: 1,
  },
  subtitle: {
    fontSize: "0.7rem",
    opacity: 0.8,
    fontWeight: 500,
    letterSpacing: "0.5px",
  },
  nav: {
    display: "flex",
    gap: "4px",
    background: "rgba(0,0,0,0.15)",
    padding: "4px",
    borderRadius: "8px",
  },
  tab: {
    padding: "8px 16px",
    background: "transparent",
    color: "#a7f3d0",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    color: "#fff",
    background: "rgba(255,255,255,0.15)",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  searchSection: {
    minWidth: "260px",
    display: "flex",
    justifyContent: "flex-end",
  },
};
