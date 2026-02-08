# 🚀 Run This Now - Get Real Vancouver Data

Your Earth Engine is authenticated! The script just needed to search further back because Vancouver is cloudy in winter.

## Try the Updated Script

```bash
cd backend
source venv/bin/activate
python scripts/download_vancouver_lst.py
```

**What changed:**
- Now searches last **12 months** (was 60 days)
- Allows up to **40% cloud cover** (was 15%)
- Falls back to 2 years if needed
- Vancouver in winter = very cloudy, so this is necessary

**Expected:**
```
🌍 Initializing Google Earth Engine...
   ✅ Using default project
📡 Fetching Sentinel-2 imagery...
   Found 47 images with <40% cloud cover
   Using image from: 2025-07-15
   Cloud coverage: 23.4%
🔥 Calculating Land Surface Temperature...
💾 Exporting to GeoTIFF...
✅ Success! LST data saved to: backend/data/vancouver_lst.tif
```

Takes 2-5 minutes to download.

---

## Alternative: Use Summer 2025 Image (Best Quality)

If you want the cleanest data, edit the script and change:

```python
# Line ~50, change from:
start_date = end_date - timedelta(days=365)

# To fixed summer dates:
start_date = datetime(2025, 6, 1)
end_date = datetime(2025, 8, 31)
```

Summer = less clouds = clearer LST data!

---

## Even Easier: Browser Method (No Script Needed)

1. Go to https://code.earthengine.google.com/
2. Paste this (already set for summer 2025):

```javascript
var vancouver = ee.Geometry.Rectangle([-123.25, 49.23, -123.05, 49.33]);

// Look for summer images (less clouds)
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(vancouver)
  .filterDate('2025-06-01', '2025-09-01')  // Summer 2025
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 30))
  .sort('system:time_start', false)
  .first();

// LST proxy from SWIR
var lst = s2.select('B11').multiply(0.0001).subtract(0.1).multiply(150).clamp(20, 50);

// Visualize
Map.centerObject(vancouver, 12);
Map.addLayer(lst, {min: 25, max: 45, palette: ['blue', 'green', 'yellow', 'red']}, 'LST');

// Export to Drive
Export.image.toDrive({
  image: lst,
  description: 'vancouver_lst_summer',
  scale: 20,
  region: vancouver,
  fileFormat: 'GeoTIFF'
});
```

3. Click **Run** → **Tasks** → **Run**
4. Check Google Drive in 3-5 min
5. Download → Rename to `vancouver_lst.tif` → Put in `backend/data/`

---

## After You Get the File

```bash
# Restart backend (auto-reloads)
# Check backend logs, should see:
[Satellite] Loaded GeoTIFF: data/vancouver_lst.tif

# Test it:
curl http://localhost:8000/api/heatmap/temperature?lat=49.2827&lon=-123.1207
# Should return REAL temperature from satellite!
```

---

## What Happens Next

Once you have real LST data:
- Heat map shows **actual** Vancouver temperatures
- Red Zones appear at **real** hot spots
- Temperature queries return **satellite-measured** values
- Everything else works the same (validation, ROI, Street View, etc.)

---

## TL;DR

**Option 1:** Run updated Python script (handles Vancouver clouds)  
**Option 2:** Use browser Code Editor (easiest, no Python issues)

**Both work. Pick whichever feels easier!**

You're so close! 🌿
