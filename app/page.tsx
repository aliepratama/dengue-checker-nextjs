'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from './components/Navbar'

const LeafletMap = dynamic(() => import('./components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
        <p className="text-gray-500">Memuat komponen peta...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  const [plotData, setPlotData] = useState<any>(null)
  const [isLoadingPlot, setIsLoadingPlot] = useState<boolean>(true)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)

    // Load heatmap data
    setIsLoadingPlot(true)
    fetch('/heatmap_geo.json')
      .then((response) => response.json())
      .then((data) => {
        console.log('Heatmap data loaded successfully')
        setPlotData(data)
        setIsLoadingPlot(false)
      })
      .catch((err) => {
        console.error('Failed to load heatmap data:', err)
        setIsLoadingPlot(false)
      })
  }, [])

  return (
    <div>
      <Navbar active="home" />

      <div style={{ top: 0, marginTop: 80 }}>
        <section className="bg-gray-50">
          <div className="mx-auto max-w-screen-xl px-4 py-2 lg:flex lg:h-[40vh] lg:items-center">
            <div className="mx-auto max-w-xl text-center">
              <div className="flex flex-col text-3xl font-extrabold sm:text-5xl">
                <span>Deteksi DBD</span>
                <span className="text-red-700">lebih dini!</span>
              </div>

              <p className="mt-4 sm:text-xl/relaxed">
                Sistem ini dapat membantu Anda untuk mendeteksi Demam Berdarah
                Dengue (DBD) lebih dini dengan AI
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  className="flex gap-x-2 rounded bg-red-700 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-800 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                  href="/form"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="m16 16-1.9-1.9" />
                  </svg>
                  Periksa
                </a>
                
                <a
                  className="flex gap-x-2 rounded bg-white border-2 border-red-700 px-12 py-3 text-sm font-medium text-red-700 shadow hover:bg-red-50 focus:outline-none focus:ring active:bg-red-100 sm:w-auto"
                  href="/login"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" x2="3" y1="12" y2="12" />
                  </svg>
                  Masuk
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="py-2 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Peta Sebaran DBD di Indonesia
            </h2>
            <p className="text-gray-600">
              Visualisasi data kasus DBD berdasarkan lokasi geografis
            </p>
          </div>
          
          <div
            id="chart"
            className="chart mx-auto w-full bg-white rounded-lg shadow-lg p-4"
            style={{ minHeight: 600, height: 600, width: '100%' }}
          >
            {isLoadingPlot && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
                  <p className="text-gray-500">Memuat peta Indonesia...</p>
                </div>
              </div>
            )}
            {!isLoadingPlot && !plotData && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-red-500 font-medium">Gagal memuat data peta</p>
                  <p className="text-gray-500 text-sm mt-2">Silakan refresh halaman atau coba lagi nanti</p>
                </div>
              </div>
            )}
            {!isLoadingPlot && plotData && isMounted && (
              <LeafletMap
                data={plotData.data}
                layout={plotData.layout}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
