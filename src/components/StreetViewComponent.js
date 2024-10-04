import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 35px #ff00de, 0 0 40px #ff00de, 0 0 50px #ff00de, 0 0 75px #ff00de; }
  100% { text-shadow: 0 0 2.5px #fff, 0 0 5px #fff, 0 0 7.5px #fff, 0 0 10px #ff00de, 0 0 17.5px #ff00de, 0 0 20px #ff00de, 0 0 25px #ff00de, 0 0 37.5px #ff00de; }
`;

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
    console.log('StreetViewComponent mounted');
    return () => {
      console.log('StreetViewComponent unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('Maps loaded:', mapsLoaded);
  }, [mapsLoaded]);

  useEffect(() => {
    if (mapsLoaded) {
      initializeStreetView();
    }
  }, [mapsLoaded, lat, lng, heading, pitch, allowMovement]);

  useEffect(() => {
    console.log('Profile received in StreetViewComponent:', profile);
  }, [profile]);

  const initializeStreetView = () => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API not loaded');
      return;
    }
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
      const avatarContent = profile && profile.avatar ? profile.avatar : '📍';

      const pinSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="60" viewBox="0 0 40 60">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <style>
              @keyframes glowAnimation {
                0% { filter: url(#glow) drop-shadow(0 0 0.5px #fff) drop-shadow(0 0 1px #ff00de); }
                100% { filter: url(#glow) drop-shadow(0 0 1px #fff) drop-shadow(0 0 2px #ff00de); }
              }
              .pin { animation: glowAnimation 1s ease-in-out infinite alternate; }
            </style>
          </defs>
          <path class="pin" d="M20 0 C8.954 0 0 8.954 0 20 C0 31.046 20 60 20 60 C20 60 40 31.046 40 20 C40 8.954 31.046 0 20 0 Z" fill="#ff00de"/>
          <circle cx="20" cy="18" r="16" fill="white"/>
          <text x="20" y="18" font-size="24" text-anchor="middle" dominant-baseline="central" fill="black">${avatarContent}</text>
        </svg>
      `;

      const pinUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(pinSVG);

      const newMarker = new window.google.maps.Marker({
        position: e.latLng,
        map: map,
        icon: {
          url: pinUrl,
          scaledSize: new window.google.maps.Size(40, 60),
          anchor: new window.google.maps.Point(20, 60),
          origin: new window.google.maps.Point(0, 0),
        },
      });

      markerRef.current = newMarker;
      setMarkerPosition(e.latLng);
    });

    // Original marker for the street view location
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
          width: '500px',
          height: '500px',
          zIndex: 1000,
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