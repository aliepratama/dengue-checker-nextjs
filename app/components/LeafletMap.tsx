'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'

interface LeafletMapProps {
  data: any
  layout?: any
}

// Heatmap layer component
function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap()
  const layerRef = useRef<any>(null)

  useEffect(() => {
    if (!map || !points || points.length === 0) {
      console.log('⚠️ HeatmapLayer: No map or no points', {
        hasMap: !!map,
        pointsCount: points?.length
      })
      return
    }

    console.log('🗺️ HeatmapLayer: Initializing with', points.length, 'points')
    console.log('📍 First 3 points:', points.slice(0, 3))

    let mounted = true

    const initHeatmap = async () => {
      try {
        // Import Leaflet and heatmap plugin
        const L = (await import('leaflet')).default
        await import('leaflet.heat')

        if (!mounted) return

        console.log('✅ Leaflet.heat loaded')

        // Remove old layer if exists
        if (layerRef.current) {
          try {
            map.removeLayer(layerRef.current)
            console.log('🗑️ Removed old heatmap layer')
          } catch (e) {
            console.log('Could not remove old layer:', e)
          }
        }

        // Create heatmap with smaller, more precise points
        const heatmapLayer = (L as any).heatLayer(points, {
          radius: 6,           // Smaller radius for more precise visualization
          blur: 3,             // Less blur for sharper points
          maxZoom: 18,          
          max: 1.0,
          minOpacity: 0.5,      // Lower opacity for better visibility
          gradient: {           // Bright yellow to red gradient
            0.0: '#ffff00',     // Bright yellow
            0.2: '#ffdd00',
            0.4: '#ffaa00',
            0.6: '#ff7700',
            0.8: '#ff3300',
            1.0: '#ff0000'      // Red
          }
        })

        layerRef.current = heatmapLayer
        heatmapLayer.addTo(map)

        console.log('🎉 Heatmap layer added to map successfully!')

      } catch (error) {
        console.error('❌ Error loading heatmap:', error)
      }
    }

    initHeatmap()

    return () => {
      mounted = false
      if (layerRef.current && map) {
        try {
          map.removeLayer(layerRef.current)
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  }, [map, points])

  return null
}

// Main component
export default function LeafletMap({ data, layout }: LeafletMapProps) {
  const [points, setPoints] = useState<[number, number, number][]>([])

  useEffect(() => {
    console.log('🔄 LeafletMap: Processing data...')
    
    if (!data || !data[0]) {
      console.error('❌ No data provided to LeafletMap')
      return
    }

    const trace = data[0]
    const { lat, lon, z } = trace

    if (!lat || !lon || !z) {
      console.error('❌ Missing lat, lon, or z in data')
      return
    }

    console.log('📊 Data info:', {
      latCount: lat.length,
      lonCount: lon.length,
      zCount: z.length
    })

    // Process points
    const processedPoints: [number, number, number][] = []
    
    for (let i = 0; i < lat.length; i++) {
      // All points visible: 0 -> 0.5 intensity, 1 -> 1.0 intensity
      const intensity = z[i] === 1 ? 1.0 : 0.5
      processedPoints.push([lat[i], lon[i], intensity])
    }

    console.log('✅ Processed', processedPoints.length, 'points for heatmap')
    console.log('📍 Sample:', processedPoints.slice(0, 3))
    
    setPoints(processedPoints)
  }, [data])

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[-2.5, 117.5]}
        zoom={5}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {points.length > 0 && (
          <>
            <HeatmapLayer points={points} />
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: 'white', padding: '5px', borderRadius: '3px', fontSize: '12px' }}>
              {points.length} data points loaded
            </div>
          </>
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="text-xs font-bold mb-2 text-gray-800">Tingkat Kasus DBD</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffff00' }}></div>
            <span className="text-xs text-gray-600">Sangat Rendah</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffdd00' }}></div>
            <span className="text-xs text-gray-600">Rendah</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffaa00' }}></div>
            <span className="text-xs text-gray-600">Sedang</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff7700' }}></div>
            <span className="text-xs text-gray-600">Tinggi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff0000' }}></div>
            <span className="text-xs text-gray-600">Sangat Tinggi</span>
          </div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md z-[1000]">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Scroll untuk zoom, drag untuk pan</span>
        </div>
      </div>
    </div>
  )
}
