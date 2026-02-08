import { useEffect, useRef, useMemo, useState } from "react";
import { transformStreetView } from "../services/api";

/**
 * Street View panel that opens when user clicks a location.
 * Uses native Google Maps Street View Service.
 * Includes AI transformation feature to visualize green interventions.
 */
export default function StreetViewPanel({
  isOpen,
  onClose,
  location,
  trees,
  activeDataLayer,
  layerData,
}) {
  const containerRef = useRef(null);
  const panoramaRef = useRef(null);
  const locationKeyRef = useRef(null);
  
  // AI Transformation state
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Early returns AFTER hooks (rules of hooks)
  const locationKey = location ? `${location.lat.toFixed(6)},${location.lng.toFixed(6)}` : null;

  // Get nearby trees (within 50m) - memoized to prevent recalc on every render
  const nearbyTrees = useMemo(() => {
    if (!location || !trees) return [];
    try {
      return trees.filter((tree) => {
        if (!tree) return false;
        const treeLat = tree.position?.[1] ?? tree.lat ?? 0;
        const treeLon = tree.position?.[0] ?? tree.lon ?? 0;
        const dist = getDistance(location.lat, location.lng, treeLat, treeLon);
        return dist < 0.0005; // ~50m radius
      });
    } catch (err) {
      console.error("Error calculating nearby trees:", err);
      return [];
    }
  }, [trees, location]);

  // Get active layer info for this location - memoized
  const layerInfo = useMemo(() => {
    if (!location) return null;
    try {
      return getLayerInfoForLocation(location, activeDataLayer, layerData);
    } catch (err) {
      console.error("Error getting layer info:", err);
      return null;
    }
  }, [location, activeDataLayer, layerData]);

  // Initialize Street View ONLY when location changes
  useEffect(() => {
    if (!isOpen || !containerRef.current || !locationKey || !location) {
      // Clear panorama when closed
      if (!isOpen && panoramaRef.current) {
        try {
          panoramaRef.current.setVisible(false);
        } catch (err) {
          console.warn("Error hiding panorama:", err);
        }
      }
      return;
    }
    
    // Skip if same location
    if (locationKeyRef.current === locationKey && panoramaRef.current) {
      // Same location, but make sure panorama is visible
      try {
        panoramaRef.current.setVisible(true);
      } catch (err) {
        console.warn("Error showing existing panorama:", err);
        // If error, clear ref so we re-initialize
        panoramaRef.current = null;
        locationKeyRef.current = null;
      }
      return;
    }
    
    console.log("Initializing Street View at:", locationKey);
    locationKeyRef.current = locationKey;

    // Wait for Google Maps API to load
    if (typeof google === 'undefined' || !google.maps) {
      console.warn("Google Maps API not loaded yet");
      return;
    }

    try {
      const sv = new google.maps.StreetViewService();
      const position = { lat: location.lat, lng: location.lng };

      sv.getPanorama(
        {
          location: position,
          radius: 50,
          source: google.maps.StreetViewSource.OUTDOOR,
        },
        (data, status) => {
          if (status === "OK" && data && data.location) {
            try {
              // Always recreate panorama for new location
              if (panoramaRef.current) {
                try {
                  panoramaRef.current.setVisible(false);
                } catch (err) {
                  console.warn("Error cleaning up old panorama:", err);
                }
              }
              
              if (containerRef.current) {
                panoramaRef.current = new google.maps.StreetViewPanorama(
                  containerRef.current,
                  {
                    position: data.location.latLng,
                    pov: {
                      heading: 0,
                      pitch: 0,
                    },
                    zoom: 1,
                    addressControl: false,
                    linksControl: true,
                    panControl: true,
                    enableCloseButton: false,
                    fullscreenControl: false,
                  }
                );
                console.log("Street View initialized successfully");
              }
            } catch (err) {
              console.error("Error creating Street View panorama:", err);
              panoramaRef.current = null;
              locationKeyRef.current = null;
            }
          } else {
            console.warn("Street View not available at this location:", status);
            panoramaRef.current = null;
            locationKeyRef.current = null;
          }
        }
      );
    } catch (err) {
      console.error("Error initializing Street View:", err);
      panoramaRef.current = null;
      locationKeyRef.current = null;
    }
  }, [isOpen, locationKey, location]);

  // Calculate visible trees from current viewpoint
  const visibleTrees = useMemo(() => {
    if (!nearbyTrees || nearbyTrees.length === 0 || !panoramaRef.current) return [];
    
    try {
      const pov = panoramaRef.current.getPov();
      const position = panoramaRef.current.getPosition();
      const currentHeading = pov.heading;
      const viewLat = position.lat();
      const viewLng = position.lng();
      
      // Calculate which trees are in the current field of view
      return nearbyTrees.map((tree) => {
        const treeLat = tree.position?.[1] ?? tree.lat ?? 0;
        const treeLon = tree.position?.[0] ?? tree.lon ?? 0;
        
        const bearing = calculateBearing(viewLat, viewLng, treeLat, treeLon);
        const distance = getDistanceMeters(viewLat, viewLng, treeLat, treeLon);
        
        // Calculate if tree is in current field of view (±60° from heading)
        let relativeBearing = (bearing - currentHeading + 360) % 360;
        if (relativeBearing > 180) relativeBearing -= 360;
        
        const inView = Math.abs(relativeBearing) <= 60 && distance <= 50;
        
        return {
          species: tree.species || "maple",
          bearing: bearing,
          distance: distance,
          lat: treeLat,
          lng: treeLon,
          inView: inView,
        };
      }).filter(t => t.inView);
    } catch (err) {
      console.warn("Error calculating visible trees:", err);
      return [];
    }
  }, [nearbyTrees, panoramaRef.current]);

  // Handle AI transformation
  const handleSimulateGreenFuture = async () => {
    if (!panoramaRef.current || !location) return;

    try {
      setAiLoading(true);
      setAiError(null);
      setAiResult(null);

      // Get current view parameters
      const pov = panoramaRef.current.getPov();
      const position = panoramaRef.current.getPosition();

      console.log("Capturing view with trees:", visibleTrees);

      // Call API to transform with exact tree positions
      const result = await transformStreetView(
        position.lat(),
        position.lng(),
        pov.heading,
        pov.pitch,
        90,
        visibleTrees
      );

      setAiResult(result);
      setAiLoading(false);
    } catch (error) {
      console.error("AI transformation failed:", error);
      setAiError(error.message || "Failed to generate visualization");
      setAiLoading(false);
    }
  };

  // Reset AI state when location changes
  useEffect(() => {
    setAiResult(null);
    setAiError(null);
  }, [locationKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (panoramaRef.current) {
        try {
          panoramaRef.current.setVisible(false);
          panoramaRef.current = null;
        } catch (err) {
          console.warn("Error during cleanup:", err);
        }
      }
      locationKeyRef.current = null;
    };
  }, []);

  // Guard: early return AFTER all hooks
  if (!isOpen || !location) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.title}>🌍 Street View</span>
          <button onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        {/* Street View Container */}
        <div style={styles.streetViewContainer}>
          <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

          {/* Ghost Tree Markers Overlay */}
          {nearbyTrees.length > 0 && panoramaRef.current && (
            <TreeMarkers
              trees={nearbyTrees}
              panorama={panoramaRef.current}
              location={location}
            />
          )}

          {/* Data Layer Indicator Overlay */}
          {layerInfo && (
            <div
              style={{
                ...styles.layerOverlay,
                background: `linear-gradient(180deg, ${layerInfo.color}33 0%, ${layerInfo.color}11 50%, transparent 100%)`,
              }}
            >
              <div
                style={{
                  ...styles.layerBanner,
                  background: layerInfo.color,
                }}
              >
                {layerInfo.icon} {layerInfo.label}
              </div>
              {layerInfo.details && (
                <div style={styles.layerDetails}>{layerInfo.details}</div>
              )}
            </div>
          )}

          {/* Tree Counter Badge */}
          {nearbyTrees.length > 0 && (
            <div style={styles.treeBadge}>
              🌳 {nearbyTrees.length} tree{nearbyTrees.length > 1 ? "s" : ""}{" "}
              planned nearby
            </div>
          )}

          {/* AI Transformation Button - only show if trees are visible */}
          {visibleTrees.length > 0 && (
            <button
              onClick={handleSimulateGreenFuture}
              disabled={aiLoading}
              style={styles.aiButton}
              title={`Show ${visibleTrees.length} planted tree${visibleTrees.length > 1 ? 's' : ''} in this view`}
            >
              {aiLoading 
                ? "🔄 Generating..." 
                : `🌳 Show ${visibleTrees.length} Tree${visibleTrees.length > 1 ? 's' : ''}`}
            </button>
          )}
        </div>

        {/* AI Result Modal */}
        {aiResult && (
          <div style={styles.modalOverlay} onClick={() => setAiResult(null)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <span style={styles.modalTitle}>
                  🌳 Planted Trees Visualization
                </span>
                <button onClick={() => setAiResult(null)} style={styles.modalCloseBtn}>
                  ✕
                </button>
              </div>
              
              <div style={styles.splitView}>
                <div style={styles.imagePane}>
                  <div style={styles.imageLabel}>BEFORE</div>
                  <img
                    src={`data:image/jpeg;base64,${aiResult.original_image}`}
                    alt="Current Street View"
                    style={styles.image}
                  />
                </div>
                <div style={styles.imagePane}>
                  <div style={styles.imageLabelAfter}>
                    AFTER — {aiResult.trees_added} Tree{aiResult.trees_added > 1 ? 's' : ''} Added
                  </div>
                  <img
                    src={`data:image/jpeg;base64,${aiResult.transformed_image}`}
                    alt="Street View with Planted Trees"
                    style={styles.image}
                  />
                </div>
              </div>
              
              <div style={styles.modalFooter}>
                Showing {aiResult.trees_added} planted tree{aiResult.trees_added > 1 ? 's' : ''} at exact coordinates. 
                Everything else remains unchanged.
              </div>
            </div>
          </div>
        )}

        {/* AI Error Message */}
        {aiError && (
          <div style={styles.errorToast} onClick={() => setAiError(null)}>
            ⚠️ {aiError}
          </div>
        )}

        {/* Navigation hint */}
        <div style={styles.navHint}>
          Use arrow keys or drag to look around • Click arrows to move
        </div>

        {/* Footer info */}
        <div style={styles.footer}>
          <span style={styles.coords}>
            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </span>
          <button onClick={onClose} style={styles.exitBtn}>
            Exit Street View
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tree Markers Component ─────────────────────────────────

function TreeMarkers({ trees, panorama, location }) {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!panorama || !location || !trees || trees.length === 0) {
      setMarkers([]);
      return;
    }

    // Calculate projected positions for each tree
    const newMarkers = trees.map((tree) => {
      const treeLat = tree.position?.[1] ?? tree.lat ?? 0;
      const treeLon = tree.position?.[0] ?? tree.lon ?? 0;

      // Calculate bearing from Street View location to tree
      const bearing = calculateBearing(location.lat, location.lng, treeLat, treeLon);
      const distance = getDistanceMeters(location.lat, location.lng, treeLat, treeLon);

      // Estimate vertical angle (trees appear lower when farther away)
      const heightAngle = distance < 20 ? 5 : distance < 50 ? 0 : -5;

      return {
        id: tree.id,
        species: tree.species || "maple",
        bearing,
        distance,
        pitch: heightAngle,
      };
    });

    setMarkers(newMarkers);
  }, [trees, panorama, location]);

  if (markers.length === 0) return null;

  return (
    <div style={styles.treeMarkersContainer}>
      {markers.map((marker) => (
        <div
          key={marker.id}
          style={{
            ...styles.treeMarker,
            left: `${50 + (marker.bearing / 180) * 50}%`, // Rough approximation
            top: `${50 - marker.pitch}%`,
          }}
        >
          <div style={styles.treeGhost}>
            <div style={styles.treeGhostIcon}>🌳</div>
            <div style={styles.treeGhostPulse} />
            <div style={styles.treeGhostLabel}>
              Future {marker.species}
              <br />
              <span style={{ fontSize: "0.65rem", opacity: 0.7 }}>
                {Math.round(marker.distance)}m away
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

function getDistance(lat1, lon1, lat2, lon2) {
  return Math.sqrt((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2);
}

function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function calculateBearing(lat1, lon1, lat2, lon2) {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return ((θ * 180) / Math.PI + 360) % 360; // Convert to degrees, normalize
}

function getLayerInfoForLocation(location, activeLayer, layerData) {
  if (!activeLayer || !layerData) return null;

  const { lat, lng } = location;

  if (activeLayer === "hotspots" && layerData.hotspots) {
    const nearby = layerData.hotspots.find((h) => {
      const dist = getDistance(lat, lng, h.lat, h.lon);
      return dist < 0.001; // ~100m
    });
    if (nearby) {
      return {
        icon: "⚠️",
        label: `RED ZONE: ${nearby.temperature_c}°C`,
        details: `${nearby.description || "Extreme heat area"}`,
        color: "#ef4444",
      };
    }
  }

  if (activeLayer === "suggestions" && layerData.suggestions) {
    const nearby = layerData.suggestions.find((s) => {
      const dist = getDistance(lat, lng, s.lat, s.lon);
      return dist < 0.001;
    });
    if (nearby) {
      return {
        icon: "💡",
        label: `Suggested Planting Location`,
        details: `${nearby.reason || ""} (−${nearby.cooling_potential}°C)`,
        color: "#10b981",
      };
    }
  }

  if (activeLayer === "vulnerability" && layerData.vulnerability) {
    const nearby = layerData.vulnerability.find((v) => {
      const dist = getDistance(lat, lng, v.lat, v.lon);
      return dist < 0.003;
    });
    if (nearby) {
      const level =
        nearby.vulnerability_score >= 0.7
          ? "High"
          : nearby.vulnerability_score >= 0.4
          ? "Medium"
          : "Low";
      return {
        icon: "🛡️",
        label: `${nearby.label || "Vulnerable Area"} (${level})`,
        details: nearby.factors || "",
        color: "#a78bfa",
      };
    }
  }

  return null;
}

// ─── Styles ──────────────────────────────────────────────────

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    backdropFilter: "blur(4px)",
  },
  panel: {
    background: "linear-gradient(135deg, #1a2e24 0%, #1a3028 100%)",
    borderRadius: "16px",
    width: "min(95vw, 1100px)",
    height: "min(90vh, 700px)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(74,222,128,0.25)",
    boxShadow: "0 25px 60px rgba(74,222,128,0.2)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(26,26,46,0.95)",
  },
  title: {
    color: "#4ade80",
    fontSize: "1rem",
    fontWeight: 700,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "1.4rem",
    cursor: "pointer",
    lineHeight: 1,
  },
  streetViewContainer: {
    position: "relative",
    flex: 1,
    background: "#000",
  },
  layerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 10,
  },
  layerBanner: {
    position: "absolute",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 24px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.9rem",
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    letterSpacing: "0.3px",
  },
  layerDetails: {
    position: "absolute",
    top: "65px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(26,26,46,0.92)",
    padding: "8px 16px",
    borderRadius: "8px",
    color: "#ddd",
    fontSize: "0.8rem",
    maxWidth: "400px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  treeBadge: {
    position: "absolute",
    bottom: "80px",
    left: "20px",
    background: "rgba(16,185,129,0.92)",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "0.82rem",
    fontWeight: 600,
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    zIndex: 20,
  },
  navHint: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,0.75)",
    color: "#aaa",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "0.72rem",
    pointerEvents: "none",
    zIndex: 20,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(26,26,46,0.95)",
  },
  coords: {
    color: "#888",
    fontSize: "0.75rem",
    fontFamily: "monospace",
  },
  exitBtn: {
    padding: "8px 18px",
    background: "rgba(239,68,68,0.9)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
    outline: "none",
  },
  treeMarkersContainer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 15,
  },
  treeMarker: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },
  treeGhost: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  treeGhostIcon: {
    fontSize: "2rem",
    filter: "drop-shadow(0 0 8px rgba(74,222,128,0.8))",
    animation: "pulse-tree 2s ease-in-out infinite",
    position: "relative",
    zIndex: 2,
  },
  treeGhostPulse: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(74,222,128,0.4) 0%, transparent 70%)",
    animation: "pulse-ring 2s ease-in-out infinite",
    zIndex: 1,
  },
  treeGhostLabel: {
    marginTop: "4px",
    padding: "4px 8px",
    background: "rgba(20,35,30,0.95)",
    border: "1px solid rgba(74,222,128,0.5)",
    borderRadius: "6px",
    fontSize: "0.7rem",
    fontWeight: 600,
    color: "#4ade80",
    textAlign: "center",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 8px rgba(74,222,128,0.3)",
  },
  aiButton: {
    position: "absolute",
    bottom: "80px",
    right: "20px",
    padding: "12px 20px",
    background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(74,222,128,0.4)",
    zIndex: 20,
    transition: "all 0.2s",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "linear-gradient(135deg, rgba(20,30,25,0.98) 0%, rgba(25,35,30,0.98) 100%)",
    borderRadius: "16px",
    border: "1px solid rgba(74,222,128,0.3)",
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid rgba(74,222,128,0.2)",
  },
  modalTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#4ade80",
  },
  modalCloseBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#e5e5e5",
    fontSize: "20px",
  },
  splitView: {
    display: "flex",
    gap: "2px",
  },
  imagePane: {
    flex: 1,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  imageLabel: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "rgba(239,68,68,0.9)",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: 700,
    zIndex: 10,
  },
  imageLabelAfter: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "rgba(74,222,128,0.9)",
    color: "#000",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: 700,
    zIndex: 10,
  },
  modalFooter: {
    padding: "12px 20px",
    borderTop: "1px solid rgba(74,222,128,0.1)",
    color: "#999",
    fontSize: "0.8rem",
    textAlign: "center",
  },
  errorToast: {
    position: "absolute",
    bottom: "150px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(239,68,68,0.95)",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: 600,
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    cursor: "pointer",
    zIndex: 30,
  },
};
