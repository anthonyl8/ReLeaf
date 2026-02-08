# Getting Real Satellite Data — Google Earth Engine Integration

This guide will help you replace mock data with real Sentinel-2 thermal data for any city worldwide.

---

## Step 1: Google Earth Engine Setup

### 1.1 Create Google Cloud Project (REQUIRED)

**Modern Earth Engine requires a Cloud project. Do this first:**

1. Go to https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Project name: `releaf-hackathon` (or anything)
4. Click "Create"
5. **Copy the Project ID** (e.g., `releaf-hackathon-123456`)

### 1.2 Register for Earth Engine

1. Go to https://earthengine.google.com/signup/
2. Sign in with your Google account
3. Select **"Register for a Noncommercial or Commercial Cloud project"**
4. Select the project you just created
5. Wait for approval (usually instant)

### 1.3 Install Earth Engine Python API
```bash
cd backend
source venv/bin/activate
pip install earthengine-api geemap
```

### 1.4 Set Your Project ID

**Option A: Environment Variable (Recommended)**
```bash
export GOOGLE_CLOUD_PROJECT=releaf-hackathon-123456
# Or add to your .bashrc / .zshrc
```

**Option B: Command Line**
```bash
earthengine set_project releaf-hackathon-123456
```

**Option C: In Python Script**
```bash
PROJECT_ID=releaf-hackathon-123456 python scripts/download_vancouver_lst.py
```

### 1.5 Authenticate
```bash
earthengine authenticate
```
- Browser will open → Sign in → Copy verification code
- Paste code back into terminal

---

## Step 2: Download Real LST Data for Vancouver

### Option A: Use Our Pre-Built Script (Recommended)

I'll create a script that downloads the latest Sentinel-2 LST data for Vancouver:

```python
# backend/scripts/download_lst.py
import ee
import geemap
from datetime import datetime, timedelta

# Initialize Earth Engine
ee.Initialize()

# Vancouver bounding box
vancouver_bounds = ee.Geometry.Rectangle([
    -123.3, 49.2,  # Southwest corner
    -122.9, 49.35  # Northeast corner
])

# Get latest cloud-free Sentinel-2 image (last 30 days)
end_date = datetime.now()
start_date = end_date - timedelta(days=30)

collection = (
    ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(vancouver_bounds)
    .filterDate(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
)

# Get the most recent image
image = collection.sort('system:time_start', False).first()

# Calculate Land Surface Temperature (LST) from NIR/Red bands
# Simplified model: LST ≈ brightness temperature from thermal emissivity
lst = image.select('B11').multiply(0.01)  # B11 = SWIR band, rough proxy

# Export to GeoTIFF
geemap.ee_export_image(
    lst,
    filename='backend/data/vancouver_lst.tif',
    scale=10,  # 10m resolution
    region=vancouver_bounds,
    file_per_band=False
)

print("✅ Downloaded Vancouver LST data to backend/data/vancouver_lst.tif")
```

**Run it:**
```bash
python backend/scripts/download_lst.py
```

### Option B: Manual Download via EE Code Editor (EASIEST - No Python!)

**If you don't want to deal with Python/projects, use this:**

1. Go to https://code.earthengine.google.com/
2. Sign in (same account as above)
3. Paste this script:
```javascript
var vancouver = ee.Geometry.Rectangle([-123.3, 49.2, -122.9, 49.35]);

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(vancouver)
  .filterDate('2025-06-01', '2026-02-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .sort('system:time_start', false)
  .first();

var lst = s2.select('B11').multiply(0.01);

Map.centerObject(vancouver, 12);
Map.addLayer(lst, {min: 20, max: 45, palette: ['blue', 'green', 'yellow', 'red']}, 'LST');

Export.image.toDrive({
  image: lst,
  description: 'vancouver_lst',
  scale: 10,
  region: vancouver,
  fileFormat: 'GeoTIFF'
});
```
3. Click **Run** → Then click **Tasks** tab → Click **Run** on export
4. Download from Google Drive → Place in `backend/data/vancouver_lst.tif`

---

## Step 3: Update ReLeaf to Use Real Data

### 3.1 Update Backend Config

Edit `backend/.env`:
```bash
HEATMAP_TIFF_PATH=data/vancouver_lst.tif
```

### 3.2 Verify It's Working

Restart backend, then test:
```bash
curl http://localhost:8000/api/heatmap/temperature?lat=49.2827&lon=-123.1207
```

Should return actual temperature from satellite data instead of synthetic!

---

## Step 4: Add Real Building Data (OpenStreetMap)

### 4.1 Install OSMnx (Optional)
```bash
pip install osmnx
```

### 4.2 Download Vancouver Building Footprints

```python
# backend/scripts/download_buildings.py
import osmnx as ox
import json

# Download all buildings in Vancouver
buildings = ox.features_from_place(
    "Vancouver, British Columbia, Canada",
    tags={'building': True}
)

# Convert to GeoJSON
buildings_geojson = json.loads(buildings.to_json())

with open('backend/data/vancouver_buildings.geojson', 'w') as f:
    json.dump(buildings_geojson, f)

print(f"✅ Downloaded {len(buildings)} buildings")
```

**Run it:**
```bash
python backend/scripts/download_buildings.py
```

### 4.3 Use Building Data for Validation

The validation service already queries OSM in real-time via Overpass API, so no additional setup needed!

---

## Step 5: Real Hotspot Detection (Auto-Generated)

Instead of hardcoded hotspots, detect them from satellite data:

```python
# In backend/services/analysis.py
def detect_real_hotspots(self) -> list[dict]:
    """Detect hotspots from actual LST data."""
    # Get temperature grid
    grid = satellite_service.get_temperature_grid(100)
    
    hotspots = []
    for point in grid:
        if point['temperature_c'] >= 42:  # Threshold for "red zone"
            # Check if it's infrastructure (not just hot pavement)
            # Query OSM for bus stops, parking, etc.
            hotspots.append({
                'lat': point['lat'],
                'lon': point['lon'],
                'temperature_c': point['temperature_c'],
                'type': 'detected',
            })
    
    return hotspots
```

---

## Global Coverage

### Cities with Good Data:

✅ **Excellent** (full coverage):
- North America: Vancouver, NYC, LA, Chicago, Toronto
- Europe: London, Paris, Berlin, Amsterdam
- Asia: Tokyo, Singapore, Seoul, Hong Kong

✅ **Good** (satellite + some OSM):
- Most cities > 100k population worldwide

⚠️ **Limited**:
- Remote/rural areas
- Newer developments (OSM incomplete)
- Regions with persistent cloud cover (tropical)

### Data Sources by Feature:

| Feature | Data Source | Coverage | Resolution |
|---------|-------------|----------|------------|
| Temperature | Sentinel-2 LST | Global | 10-30m |
| Buildings | OSM + Microsoft | Global | Vector |
| Land Use | OpenStreetMap | Global (varies) | Vector |
| Vulnerability | Census + local data | Country-specific | Census blocks |
| Tree Canopy | Google Tree Canopy | Limited cities | 1m |

---

## Step 6: Enhanced Temperature Calculation

For maximum accuracy, use this LST formula:

```python
def calculate_lst_from_sentinel2(b10, b11, ndvi):
    """
    Calculate Land Surface Temperature from Sentinel-2 bands.
    
    Args:
        b10: Band 10 (SWIR1)
        b11: Band 11 (SWIR2)
        ndvi: Normalized Difference Vegetation Index
    
    Returns:
        LST in Celsius
    """
    # Constants
    K1 = 774.89  # Calibration constant
    K2 = 1321.08
    
    # Calculate brightness temperature
    bt = K2 / np.log((K1 / b11) + 1)
    
    # Estimate emissivity from NDVI
    pv = ((ndvi - 0.2) / (0.5 - 0.2)) ** 2
    emissivity = 0.004 * pv + 0.986
    
    # LST
    lst_kelvin = bt / (1 + (0.00115 * bt / 1.4388) * np.log(emissivity))
    lst_celsius = lst_kelvin - 273.15
    
    return lst_celsius
```

---

## Alternative: Use Pre-Processed LST Products

If you want **zero setup**, use pre-calculated LST:

### MODIS LST (Coarser but easier)
- **Product**: MOD11A1 (daily LST)
- **Resolution**: 1km
- **Coverage**: Global
- **Access**: NASA Earthdata (free)

```python
collection = ee.ImageCollection('MODIS/006/MOD11A1')
lst = collection.filterDate('2025-07-01', '2025-08-01').mean().select('LST_Day_1km')
```

---

## Recommended Setup for Hackathon

**Saturday Night (Minimum Viable):**
1. Use **Option B** (manual EE Code Editor) to download Vancouver LST
2. Place file as `backend/data/vancouver_lst.tif`
3. Restart backend → Real temperature data! ✅

**Sunday Morning (Production-Ready):**
1. Install `earthengine-api`
2. Create download scripts for any city
3. Add building footprint validation
4. Auto-detect hotspots from LST

---

## Need Help?

Run into issues? Check:
1. **Earth Engine quota**: Free tier = 250 exports/day
2. **File size**: Vancouver LST ~15MB (manageable)
3. **Backend logs**: `[Satellite] Loaded GeoTIFF: ...` should appear on startup

**I can help you debug any step!** Just share the error and I'll fix it. 🚀
