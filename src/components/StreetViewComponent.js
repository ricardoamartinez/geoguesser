import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const StreetViewComponent = ({ lat, lng, onNoStreetView, filter }) => {
  const streetViewRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStreetView = () => {
      if (window.google && window.google.maps) {
        const streetViewService = new window.google.maps.StreetViewService();
        streetViewService.getPanorama({ location: { lat, lng }, radius: 50 }, (data, status) => {
          if (status === 'OK') {
            const panorama = new window.google.maps.StreetViewPanorama(
              streetViewRef.current,
              {
                position: data.location.latLng,
                pov: { heading: 165, pitch: 0 },
                zoom: 1,
                motionTracking: false,
                motionTrackingControl: false,
                addressControl: false,
                linksControl: false,
                panControl: false,
                enableCloseButton: false,
                fullscreenControl: false,
              }
            );

            // Apply filter
            if (filter) {
              const canvas = streetViewRef.current.querySelector('canvas');
              if (canvas) {
                canvas.style.filter = filter;
              }
            }
          } else {
            setError('No Street View available at this location.');
            onNoStreetView();
          }
        });
      } else {
        setError('Google Maps JavaScript API not loaded');
      }
    };

    if (window.google && window.google.maps) {
      loadStreetView();
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          loadStreetView();
        }
      }, 100);
    }
  }, [lat, lng, onNoStreetView, filter]);

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