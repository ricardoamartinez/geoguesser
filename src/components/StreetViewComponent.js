import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SubmitButton = styled(motion.button)`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background: linear-gradient(45deg, #8e2de2, #4a00e0);
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  z-index: 1000;
`;

const StreetViewComponent = ({ lat, lng, heading, pitch, allowMovement, profile, onGuess }) => {
  const streetViewRef = useRef(null);
  const mapRef = useRef(null);
  const panoramaRef = useRef(null);
  const [error, setError] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      window.initMap = () => {
        setMapsLoaded(true);
      };
    } else {
      setMapsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapsLoaded) {
      initializeStreetView();
    }
  }, [mapsLoaded, lat, lng, heading, pitch, allowMovement]);

  useEffect(() => {
    console.log('Profile received in StreetViewComponent:', profile);
  }, [profile]);

  const initializeStreetView = () => {
    console.log('Initializing Street View');
    const streetViewService = new window.google.maps.StreetViewService();

    streetViewService.getPanorama({ location: { lat, lng }, radius: 50 }, (data, status) => {
      if (status === 'OK') {
        console.log('Street View data found, creating new panorama');
        panoramaRef.current = new window.google.maps.StreetViewPanorama(
          streetViewRef.current,
          {
            position: { lat, lng },
            pov: { heading, pitch },
            zoom: 1,
            addressControl: false,
            showRoadLabels: false,
            fullscreenControl: false,
            zoomControl: false,
            panControl: false,
            linksControl: false,
            enableCloseButton: false,
            clickToGo: false,
            scrollwheel: false,
          }
        );

        panoramaRef.current.addListener('position_changed', () => {
          console.log('Position changed:', panoramaRef.current.getPosition().toJSON());
        });

        initializeMap();
        applyMovementRestrictions();
        setError(null);
      } else {
        console.error('Street View data not found for this location.');
        setError('No Street View available for this location');
      }
    });
  };

  const initializeMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 8,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
    });

    map.addListener('click', (e) => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      console.log('Creating new marker with profile:', profile);
      const newMarker = new window.google.maps.Marker({
        position: e.latLng,
        map: map,
        icon: profile && profile.avatar
          ? {
              url: `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><text x="50%" y="50%" font-size="30" text-anchor="middle" dy=".35em">${encodeURIComponent(profile.avatar)}</text></svg>`,
              scaledSize: new window.google.maps.Size(40, 40),
            }
          : null, // Use default marker if profile or avatar is not available
      });
      markerRef.current = newMarker;
      setMarkerPosition(e.latLng);
    });

    new window.google.maps.Marker({
      position: { lat, lng },
      map: map,
    });
  };

  const updateStreetView = () => {
    console.log('Updating existing Street View panorama');
    if (panoramaRef.current) {
      panoramaRef.current.setPosition({ lat, lng });
      panoramaRef.current.setPov({ heading, pitch });
      applyMovementRestrictions();
    } else {
      console.error('Panorama ref is null during update');
    }
  };

  const applyMovementRestrictions = () => {
    if (panoramaRef.current) {
      console.log('Applying movement restrictions:', allowMovement ? 'Enabling' : 'Disabling');
      
      if (allowMovement) {
        enableMovement();
      } else {
        disableMovement();
      }
    } else {
      console.error('Panorama ref is null when applying movement restrictions');
    }
  };

  const enableMovement = () => {
    panoramaRef.current.setOptions({
      panControl: true,
      linksControl: true,
      clickToGo: true,
      scrollwheel: true,
      disableDefaultUI: false,
      disableDoubleClickZoom: false,
      draggable: true,
    });

    window.google.maps.event.clearListeners(panoramaRef.current, 'click');
    window.google.maps.event.clearListeners(panoramaRef.current, 'mousedown');
    console.log('Movement enabled');
  };

  const disableMovement = () => {
    panoramaRef.current.setOptions({
      panControl: false,
      linksControl: false,
      clickToGo: false,
      scrollwheel: false,
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      draggable: false,
    });

    panoramaRef.current.addListener('click', (event) => {
      event.stop();
    });

    panoramaRef.current.addListener('mousedown', (event) => {
      event.stop();
    });
    console.log('Movement disabled');
  };

  const handleSubmit = () => {
    if (markerPosition) {
      onGuess(markerPosition);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={streetViewRef} style={{ width: '100%', height: '100%' }} />
      <div 
        ref={mapRef} 
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '500px',  // Increased from 300px
          height: '500px', // Increased from 300px
          border: '2px solid white',
          borderRadius: '5px',
          zIndex: 1000, // Add this line
        }}
      />
      <SubmitButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
      >
        Submit Guess
      </SubmitButton>
    </div>
  );
};

export default StreetViewComponent;