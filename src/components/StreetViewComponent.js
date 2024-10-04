import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const StreetViewComponent = ({ lat, lng, heading, pitch, allowMovement }) => {
  const streetViewRef = useRef(null);
  const panoramaRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    loader.load().then(() => {
      if (!panoramaRef.current) {
        panoramaRef.current = new window.google.maps.StreetViewPanorama(
          streetViewRef.current,
          {
            position: { lat, lng },
            pov: { heading, pitch },
            zoom: 1,
            addressControl: false,
            showRoadLabels: false,
            disableDefaultUI: true,
            clickToGo: allowMovement,
            scrollwheel: allowMovement,
            panControl: allowMovement,
          }
        );

        // Prevent the view from changing when movement is allowed
        panoramaRef.current.addListener('position_changed', () => {
          if (!allowMovement) {
            panoramaRef.current.setPosition({ lat, lng });
          }
        });

        panoramaRef.current.addListener('pov_changed', () => {
          if (!allowMovement) {
            panoramaRef.current.setPov({ heading, pitch });
          }
        });
      } else {
        // Update existing panorama
        panoramaRef.current.setPosition({ lat, lng });
        panoramaRef.current.setPov({ heading, pitch });
        panoramaRef.current.setOptions({
          clickToGo: allowMovement,
          scrollwheel: allowMovement,
          panControl: allowMovement,
        });
      }

      if (allowMovement) {
        const streetViewService = new window.google.maps.StreetViewService();
        streetViewService.getPanorama({ location: { lat, lng }, radius: 50 }, (data, status) => {
          if (status === 'OK') {
            console.log('Movement is available at this location');
          } else {
            console.log('No movement available at this location');
          }
        });
      }
    });
  }, [lat, lng, heading, pitch, allowMovement]);

  return <div ref={streetViewRef} style={{ width: '100%', height: '100%' }} />;
};

export default StreetViewComponent;