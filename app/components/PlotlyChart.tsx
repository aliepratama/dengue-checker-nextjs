'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface PlotlyChartProps {
  data: any
  layout: any
}

export default function PlotlyChart({ data, layout }: PlotlyChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('PlotlyChart mounted with data:', data)
  }, [data])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Plot
        data={data}
        layout={{
          ...layout,
          autosize: true,
          height: 600,
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
        }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    </div>
  )
}
