import React from 'react';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function App() {
  console.log('App component rendering');
  console.log('API Key:', API_KEY);

  const test_location  = [
    {lat: 29.6465, lng: -82.3533, title: 'test'},
  ];
  return (
    <div className="game-container">
      <header className="header">Gator Guessr</header>
  
      <div className="photo-container">
        {/* image path */}
        <div className="photo-placeholder">Photo goes here</div>
      </div>
  
      <div className="map-wrapper">
        <APIProvider apiKey={API_KEY}>
          <Map
            style={{ width: '100%', height: '100%', borderRadius: '12px' }}
            defaultZoom={15}
            defaultCenter={{ lat: 29.6465, lng: -82.3533 }}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
            {test_location.map((location, index) => (
              <Marker
                key={index}
                position={location}
                title={location.title}
              />
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
  
}

export default App;
