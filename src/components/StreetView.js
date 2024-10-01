import React, { useEffect, useRef } from 'react';

function StreetView({ lat, lng }) {
  const streetViewRef = useRef(null);

  useEffect(() => {
    console.log('StreetView: useEffect triggered. lat:', lat, 'lng:', lng);
    if (streetViewRef.current && window.google && window.google.maps) {
      console.log('StreetView: Creating StreetViewPanorama');
      new window.google.maps.StreetViewPanorama(
        streetViewRef.current,
        {
          position: { lat, lng },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        }
      );
    } else {
      console.error('StreetView: Google Maps API not loaded or streetViewRef not available');
    }
  }, [lat, lng]);

  return <div ref={streetViewRef} style={{ width: '100%', height: '100%' }} />;
}

export default StreetView;