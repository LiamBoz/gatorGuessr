import React from 'react';
import Header from '../components/Header';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';
import { useMutation } from "@tanstack/react-query";
import { useRandomEntry } from "../hooks/useRandomEntry.ts";
import { postGuess, GuessResponse } from "../services/entries.ts";
import flagIconUrl from "../assets/flag.svg";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

function MapPolyline({ path }: { path: google.maps.LatLngLiteral[] }) {
  const map = useMap();

  React.useEffect(() => {
    if (!map || path.length < 2) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    path.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });

    const [start, end] = path;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const earthRadius = 6371000;
    const dLat = toRad(end.lat - start.lat);
    const dLng = toRad(end.lng - start.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(start.lat)) * Math.cos(toRad(end.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const distance = 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const polylinePath = path;

    const boundsListener = google.maps.event.addListenerOnce(map, "idle", () => {
      const zoom = map.getZoom();
      if (zoom === undefined) {
        return;
      }
      let minZoom = 4;
      if (distance < 1500) {
        minZoom = 15;
      } else if (distance < 5000) {
        minZoom = 13;
      }
      const clampedZoom = Math.min(Math.max(zoom, minZoom), 18);
      if (clampedZoom !== zoom) {
        map.setZoom(clampedZoom);
      }
    });

    const polyline = new google.maps.Polyline({
      path: polylinePath,
      geodesic: true,
      strokeColor: "#111827",
      strokeOpacity: 0.8,
      strokeWeight: 2,
    });

    polyline.setMap(map);

    return () => {
      google.maps.event.removeListener(boundsListener);
      polyline.setMap(null);
    };
  }, [map, path]);

  return null;
}

export default function Landing() {

const {data: entry, isLoading, error, refetch, isFetching } = useRandomEntry();
const [guessPosition, setGuessPosition] = React.useState<{ lat: number; lng: number } | null>(null);
const [guessResult, setGuessResult] = React.useState<GuessResponse | null>(null);
const [showResults, setShowResults] = React.useState(false);
const guessMutation = useMutation({
  mutationFn: postGuess,
  onSuccess: (data) => {
    setGuessResult(data);
    setShowResults(true);
  },
});

function handleMapClick(event: { detail?: { latLng?: { lat: number | (() => number); lng: number | (() => number) } } }) {
  const latLng = event.detail?.latLng;
  if (!latLng) {
    return;
  }
  const lat = typeof latLng.lat === "function" ? latLng.lat() : latLng.lat;
  const lng = typeof latLng.lng === "function" ? latLng.lng() : latLng.lng;
  setGuessPosition({ lat, lng });
}

function handleGuessClick() {
  if (!entry || !guessPosition || guessMutation.isPending) {
    return;
  }

  guessMutation.mutate({
    img_id: entry.id,
    latitude: guessPosition.lat,
    longitude: guessPosition.lng,
  });
}

function handleContinue() {
  setShowResults(false);
  setGuessResult(null);
  setGuessPosition(null);
  refetch();
}

const resultPath = guessResult
  ? [
      { lat: guessResult.guess_latitude, lng: guessResult.guess_longitude },
      { lat: guessResult.true_latitude, lng: guessResult.true_longitude },
    ]
  : [];
const resultCenter = guessResult
  ? {
      lat: (guessResult.guess_latitude + guessResult.true_latitude) / 2,
      lng: (guessResult.guess_longitude + guessResult.true_longitude) / 2,
    }
  : { lat: 29.6465, lng: -82.3533 };
const distanceMiles = guessResult ? guessResult.distance / 1609.344 : 0;
const flagMarkerIcon = React.useMemo(() => {
  if (typeof window === "undefined") {
    return undefined;
  }
  const maps = (window as typeof window & { google?: typeof google }).google?.maps;
  if (!maps) {
    return undefined;
  }
  return {
    url: flagIconUrl,
    scaledSize: new maps.Size(36, 36),
    anchor: new maps.Point(8, 30),
  };
}, [showResults]);

if (isLoading) return "Loading...";
if (error || !entry) return "Failed to load.";

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Header />
      <main className={showResults ? "flex items-start justify-center py-0 results-main" : "flex items-start justify-center py-8 px-4"}>
        {showResults && guessResult ? (
          <div className="w-full results-map">
            {API_KEY ? (
              <APIProvider apiKey={API_KEY}>
                <Map
                  defaultZoom={5}
                  defaultCenter={resultCenter}
                  disableDefaultUI={true}
                  gestureHandling={'greedy'}
                  clickableIcons={false}
                >
                  <Marker position={{ lat: guessResult.guess_latitude, lng: guessResult.guess_longitude }} />
                  <Marker
                    position={{ lat: guessResult.true_latitude, lng: guessResult.true_longitude }}
                    icon={flagMarkerIcon}
                  />
                  <MapPolyline path={resultPath} />
                </Map>
              </APIProvider>
            ) : (
              <div className="w-full h-full bg-gray-200/60 flex items-center justify-center text-slate-700">Map</div>
            )}
            <div className="results-panel">
              <div className="results-metric">
                <div className="results-label">Score</div>
                <div className="results-value">{guessResult.score}</div>
              </div>
              <div className="results-divider" aria-hidden="true"></div>
              <div className="results-metric">
                <div className="results-label">Distance</div>
                <div className="results-value">{distanceMiles.toFixed(2)} mi</div>
              </div>
              <div className="results-divider" aria-hidden="true"></div>
              <div className="results-metric results-message">
                <div className="results-label">Remark</div>
                <div className="results-value">It could have been worse.</div>
              </div>
            </div>
            <button className="continue-btn" onClick={handleContinue}>
              Continue <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : (
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
        )}

        {/* Fixed map overlay in bottom-right with Guess button underneath */}
        {!showResults ? (
          <div className="fixed right-8 bottom-8 z-50 flex flex-col items-end gap-3 map-guess-stack">
            <div className="w-56 h-40 rounded-md overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm map-overlay">
              {API_KEY ? (
                <APIProvider apiKey={API_KEY}>
                  <Map
                    defaultZoom={13}
                    defaultCenter={{ lat: 29.6465, lng: -82.3533 }}
                    disableDefaultUI={true}
                    gestureHandling={'greedy'}
                    onClick={handleMapClick}
                    clickableIcons={false}
                  >
                    {guessPosition ? (
                      <Marker position={guessPosition} />
                    ) : null}
                  </Map>
                </APIProvider>
              ) : (
                <div className="w-full h-full bg-gray-200/60 flex items-center justify-center text-slate-700">Map</div>
              )}
            </div>

            <div className="w-56 guess-wrapper">{/* match map width */}
              <div className="guess-container">
                <div className="guess-bg" aria-hidden="true"></div>
                <button
                  className="guess-btn"
                  onClick={handleGuessClick}
                  disabled={isFetching || guessMutation.isPending || !guessPosition}
                >
                  Guess!
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
