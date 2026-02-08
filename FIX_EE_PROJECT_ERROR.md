# Fix Earth Engine "No Project Found" Error

You got this error:
```
❌ Failed to initialize Earth Engine: no project found. Call with project=
```

## Quick Fix (Choose One)

### Option 1: Set Project via Command (Fastest)

```bash
# 1. Go to https://console.cloud.google.com/
# 2. Look at the top bar, you'll see your project name and ID
# 3. Copy the Project ID (e.g., "my-project-123456")

# 4. Set it as default:
earthengine set_project YOUR_PROJECT_ID_HERE

# 5. Try again:
python scripts/download_vancouver_lst.py
```

### Option 2: Use Environment Variable

```bash
export GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID_HERE
python scripts/download_vancouver_lst.py
```

### Option 3: Skip Python Entirely (Use Web Editor)

**This is actually easier for hackathons!**

1. Go to https://code.earthengine.google.com/
2. Paste this code:

```javascript
// Vancouver LST Download
var vancouver = ee.Geometry.Rectangle([-123.25, 49.23, -123.05, 49.33]);

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(vancouver)
  .filterDate('2025-06-01', '2026-02-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15))
  .sort('system:time_start', false)
  .first();

// Calculate LST proxy from SWIR band
var lst = s2.select('B11')
  .multiply(0.0001)
  .subtract(0.1)
  .multiply(150)
  .clamp(15, 55);

// Visualize
Map.centerObject(vancouver, 12);
Map.addLayer(lst, {min: 25, max: 45, palette: ['0000ff', '00ff00', 'ffff00', 'ff0000']}, 'LST');

// Export to Google Drive
Export.image.toDrive({
  image: lst,
  description: 'vancouver_lst',
  scale: 20,
  region: vancouver,
  fileFormat: 'GeoTIFF',
  maxPixels: 1e9
});
```

3. Click **Run** (top of editor)
4. Click **Tasks** tab (right panel)
5. Click **Run** next to "vancouver_lst"
6. Wait 2-5 minutes
7. Download from Google Drive
8. Move file to: `backend/data/vancouver_lst.tif`
9. Restart backend

**Done! You now have real Sentinel-2 data.**

---

## What Project ID to Use?

### If you just signed up:
- Earth Engine may have created one for you
- Check: https://console.cloud.google.com/
- Look for project named "My First Project" or similar

### If you have existing projects:
- Use any project
- Doesn't matter which one
- Just need one to initialize EE

### Don't have any projects?
1. Go to https://console.cloud.google.com/
2. Click "Select a project" dropdown
3. Click "NEW PROJECT"
4. Name: `releaf-hackathon`
5. Click "Create"
6. Copy the Project ID from the dashboard

---

## Still Stuck?

**For hackathon, I recommend Option 3** (Web Editor):
- ✅ No Python issues
- ✅ No project configuration
- ✅ Works in browser
- ✅ Downloads to Drive
- ✅ 5 minutes total

**After hackathon**, set up Python properly for automation.

---

## Already Authenticated but Still Getting Error?

Try this:
```bash
earthengine authenticate --force
earthengine set_project YOUR_PROJECT_ID
python scripts/download_vancouver_lst.py
```

---

You got this! 🚀
