import React from 'react';
import Header from '../components/Header';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useRandomEntry } from "../hooks/useRandomEntry.ts";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

export default function Landing() {

const {data: entry, isLoading, error, refetch, isFetching } = useRandomEntry();

if (isLoading) return "Loading...";
if (error || !entry) return "Failed to load.";

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Header />
      <main className="flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-6xl">
          {/* Hero image (bigger) */}
          <div className="w-full h-[560px] rounded-sm overflow-hidden">
            <img
              src={entry.filepath}
              alt="hero"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Fixed map overlay in bottom-right with Guess button underneath */}
        <div className="fixed right-8 bottom-8 z-50 flex flex-col items-end gap-3">
          <div className="w-56 h-40 rounded-md overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm map-overlay">
            {API_KEY ? (
              <APIProvider apiKey={API_KEY}>
                <Map
                  defaultZoom={13}
                  defaultCenter={{ lat: 29.6465, lng: -82.3533 }}
                  disableDefaultUI={true}
                  gestureHandling={'greedy'}
                >
                </Map>
              </APIProvider>
            ) : (
              <div className="w-full h-full bg-gray-200/60 flex items-center justify-center text-slate-700">Map</div>
            )}
          </div>

          <div className="w-56 guess-wrapper">{/* match map width */}
            <div className="guess-container">
              <div className="guess-bg" aria-hidden="true"></div>
              <button className="guess-btn" onClick={() => refetch()} disabled = {isFetching}>Guess!</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
