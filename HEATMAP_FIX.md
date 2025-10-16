# Heatmap Visualization Fix

## Problem
Plotly heatmap tidak tampil saat halaman pertama kali dibuka di Next.js karena:
1. Dynamic import memerlukan waktu untuk load library
2. SSR/CSR mismatch di Next.js
3. Plotly membutuhkan window object yang tersedia

## Solutions Implemented

### Solution 1: Fixed PlotlyChart Component
File: `app/components/PlotlyChart.tsx`

**Improvements:**
- ✅ Added Plotly library detection with interval check
- ✅ Added loading states (library loading, initializing, error)
- ✅ Added timeout (10s) with error handling
- ✅ Added `onInitialized` callback with force resize
- ✅ Added `onError` callback
- ✅ Better console logging for debugging

**Usage:**
```tsx
<PlotlyChart data={plotData.data} layout={plotData.layout} />
```

### Solution 2: SVG-Based Fallback Visualization
File: `app/components/RechartsHeatmap.tsx`

**Features:**
- ✅ Pure SVG rendering (no external dependencies)
- ✅ Fast initial render
- ✅ Lightweight alternative
- ✅ Color gradient (blue → yellow → red)
- ✅ Interactive tooltips on hover
- ✅ Legend included

**Usage:**
```tsx
<RechartsHeatmap data={plotData.data} layout={plotData.layout} />
```

### Solution 3: Page with Toggle Feature
File: `app/page.tsx`

**Features:**
- ✅ Automatic fallback after 8s if Plotly takes too long
- ✅ Manual toggle buttons to switch between views
- ✅ Better loading states with detailed messages
- ✅ Error handling with reload button
- ✅ Proper isMounted check for Next.js

**Toggle Buttons:**
- "Plotly View" - Full interactive Plotly map
- "Simple View" - Lightweight SVG visualization

## Testing

### Check Console Logs
Open browser DevTools (F12) and check for:
```
Heatmap data loaded successfully
Plotly library ready (if using Plotly)
Plot initialized successfully (if using Plotly)
```

### Manual Testing Steps
1. Open homepage
2. Wait for chart to load
3. If Plotly doesn't load within 8s, fallback activates automatically
4. Use toggle buttons to switch between views
5. Check that both visualizations display the data correctly

## Troubleshooting

### Plotly still not loading?
Check if dependencies are installed:
```bash
npm install react-plotly.js plotly.js
# or
bun install react-plotly.js plotly.js
```

### Data not loading?
- Check `/public/heatmap_geo.json` exists
- Verify JSON structure has `data` and `layout` properties
- Check network tab in DevTools

### Want to force one visualization?
In `app/page.tsx`, modify initial state:
```tsx
// Force simple view
const [useFallback, setUseFallback] = useState<boolean>(true)

// Force Plotly view  
const [useFallback, setUseFallback] = useState<boolean>(false)
```

## Recommendations

### For Production:
- Use Simple View (SVG) as default if:
  - Target users have slow internet
  - Mobile-first approach
  - Simpler data visualization is sufficient

- Use Plotly View as default if:
  - Need full interactivity (zoom, pan, download)
  - Complex data requires advanced features
  - Desktop-first approach

### Performance Tips:
1. Consider lazy loading heatmap data
2. Cache plotly.js bundle for faster subsequent loads
3. Use CDN for Plotly if bundle size is concern
4. Implement service worker for offline support

## Alternative Libraries for Next.js

If you want to replace Plotly entirely, consider:

### 1. **Recharts** (Recommended for most cases)
```bash
npm install recharts
```
- ✅ Built for React
- ✅ Great Next.js support
- ✅ Smaller bundle size
- ❌ No built-in geographic heatmap

### 2. **Victory**
```bash
npm install victory
```
- ✅ Flexible and customizable
- ✅ Good documentation
- ❌ Larger bundle than Recharts

### 3. **Nivo**
```bash
npm install @nivo/core @nivo/heatmap
```
- ✅ Beautiful defaults
- ✅ Has HeatMap component
- ✅ SSR friendly
- ⚠️ Steeper learning curve

### 4. **Chart.js + react-chartjs-2**
```bash
npm install chart.js react-chartjs-2
```
- ✅ Very popular
- ✅ Simple API
- ❌ No geographic heatmap out-of-box

### 5. **D3.js** (Advanced)
```bash
npm install d3
```
- ✅ Ultimate flexibility
- ✅ Can create any visualization
- ❌ Steep learning curve
- ❌ More code required

## Current Implementation Status

- ✅ Plotly with proper initialization
- ✅ SVG fallback visualization
- ✅ Toggle between views
- ✅ Auto fallback after timeout
- ✅ Error handling
- ✅ Loading states
- ✅ Console debugging

## Next Steps (Optional Improvements)

1. Add more visualization options (table view, list view)
2. Implement data filtering/search
3. Add export functionality (CSV, PNG)
4. Optimize initial bundle size
5. Add animation transitions
6. Implement zoom/pan for SVG view
7. Add responsive breakpoints for mobile
