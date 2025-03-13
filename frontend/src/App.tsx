import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const API_KEY = 'AIzaSyChOFDctKTEQCTumeImc5LHEUeJwok5yN8';

function App() {
  console.log('App component rendering');
  console.log('API Key:', API_KEY);
 
  return (
    <div className="map-container">
      <APIProvider apiKey={API_KEY}>
        <Map
          style={{width: '20%', height: '20%'}}
          defaultZoom={10}
          defaultCenter={{lat: 22.54992, lng: 0}}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        />
      </APIProvider>
    </div>
  );
}

export default App;
