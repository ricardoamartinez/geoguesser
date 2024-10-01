import React, { useEffect, useRef } from 'react';

function StreetView({ lat, lng }) {
  const streetViewRef = useRef(null);

  useEffect(() => {
    if (streetViewRef.current) {
      new window.google.maps.StreetViewPanorama(
        streetViewRef.current,
        {
          position: { lat, lng },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        }
      );
    }
  }, [lat, lng]);

  return <div ref={streetViewRef} style={{ width: '100%', height: '100%' }} />;
}

export default StreetView;