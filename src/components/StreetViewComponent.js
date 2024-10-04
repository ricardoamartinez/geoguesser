import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const StreetViewComponent = ({ lat, lng, onNoStreetView, filter, moveAllowed }) => {
  const streetViewRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStreetView = () => {
      if (window.google && window.google.maps) {
        const panorama = new window.google.maps.StreetViewPanorama(
          streetViewRef.current,
          {
            position: { lat, lng },
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
            motionTracking: false,
            motionTrackingControl: false,
            addressControl: false,
            linksControl: moveAllowed,
            panControl: moveAllowed,
            enableCloseButton: false,
            fullscreenControl: false,
          }
        );

        // Apply filter
        if (filter && filter !== 'none') {
          const canvas = streetViewRef.current.querySelector('canvas');
          if (canvas) {
            canvas.style.filter = filter;
          }
        }
      } else {
        setError('Google Maps JavaScript API not loaded');
      }
    };

    loadStreetView();
  }, [lat, lng, filter, moveAllowed]);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return <StreetViewContainer ref={streetViewRef} />;
};

const StreetViewContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ErrorMessage = styled.div`
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

export default StreetViewComponent;