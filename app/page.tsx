'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function Home() {
  const [plotData, setPlotData] = useState<any>(null);

  useEffect(() => {
    // Load heatmap data
    fetch('/heatmap_geo.json')
      .then(response => response.json())
      .then(data => setPlotData(data))
      .catch(error => console.error('Error loading heatmap:', error));
  }, []);

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
                Sistem ini dapat membantu Anda untuk mendeteksi Demam Berdarah Dengue (DBD) lebih dini dengan AI
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  className="flex gap-x-2 rounded bg-red-700 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-800 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                  href="/form"
                >
                  <img
                    src="/scan-search.svg"
                    alt="Scan Icon"
                    className="w-5 h-5"
                  />
                  Periksa
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="py-2 md:py-16">
        <div id="chart" className="chart mx-auto w-full lg:w-3/4 px-8">
          {plotData && (
            <Plot
              data={plotData.data}
              layout={{
                ...plotData.layout,
                autosize: true,
                responsive: true,
                title: {
                  ...plotData.layout.title,
                  font: {
                    family: 'General Sans, sans-serif',
                  },
                  automargin: true,
                },
              }}
              config={{ responsive: true }}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler={true}
            />
          )}
        </div>
      </section>
    </div>
  );
}
