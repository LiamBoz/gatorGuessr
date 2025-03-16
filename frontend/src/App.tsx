import React from 'react';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';

const API_KEY = '';


function App() {
  console.log('App component rendering');
  console.log('API Key:', API_KEY);

  const test_location  = [
    {lat: 29.6465, lng: 82.3533, title: 'test'},
  ];
  return (
    <div className="map-container">
      <APIProvider apiKey={API_KEY}>
        <Map
          style={{width: '25%', height: '50%'}}
          defaultZoom={5}
          defaultCenter={{lat: 29.6465, lng: 82.3533}}
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
  );
}

export default App;
