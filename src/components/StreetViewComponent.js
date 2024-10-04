import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 35px #ff00de, 0 0 40px #ff00de, 0 0 50px #ff00de, 0 0 75px #ff00de; }
  100% { text-shadow: 0 0 2.5px #fff, 0 0 5px #fff, 0 0 7.5px #fff, 0 0 10px #ff00de, 0 0 17.5px #ff00de, 0 0 20px #ff00de, 0 0 25px #ff00de, 0 0 37.5px #ff00de; }
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1001;
`;

const SubmitButton = styled(motion.button)`
  padding: 10px;
  background: linear-gradient(45deg, #8e2de2, #4a00e0);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapToggleButton = styled(motion.button)`
  padding: 10px;
  background: linear-gradient(45deg, #8e2de2, #4a00e0);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MapContainer = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 500px;
  height: 500px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
`;

const StreetViewComponent = ({ lat, lng, heading, pitch, allowMovement, profile, onGuess }) => {
  const streetViewRef = useRef(null);
  const mapRef = useRef(null);
  const panoramaRef = useRef(null);
  const [error, setError] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const markerRef = useRef(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [marker, setMarker] = useState(null);

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

  useEffect(() => {
    if (mapsLoaded && isMapVisible) {
      initializeMap();
    }
  }, [mapsLoaded, isMapVisible]);

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
            panControl: true,
            panControlOptions: {
              position: window.google.maps.ControlPosition.TOP_LEFT
            },
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
    const darkModeStyle = [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ];

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 0, lng: 0 }, // Center of the world
      zoom: 2, // Global view
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
      styles: darkModeStyle,
    });

    setMapInstance(map);

    // Recreate marker if it exists
    if (marker) {
      createMarker(map, marker.position, marker.avatar);
      map.setCenter(marker.position);
      map.setZoom(8); // Zoom in if a marker exists
    }

    map.addListener('click', (e) => {
      const avatarContent = profile && profile.avatar ? profile.avatar : '📍';
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      const newMarker = createMarker(map, e.latLng, avatarContent);
      setMarker({ position: e.latLng, avatar: avatarContent });
      setMarkerPosition(e.latLng);
      map.setCenter(e.latLng);
      map.setZoom(8); // Zoom in when a marker is placed
    });
  };

  const createMarker = (map, position, avatarContent) => {
    const pinSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="120" viewBox="-20 -20 80 120">
        <defs>
          <style>
            @keyframes smoothGlow {
              0%, 100% { filter: drop-shadow(0 0 2px #ff00de) drop-shadow(0 0 4px #ff00de); }
              50% { filter: drop-shadow(0 0 3px #ff00de) drop-shadow(0 0 6px #ff00de); }
            }
            .pin {
              fill: #ff00de;
              animation: smoothGlow 2s ease-in-out infinite;
            }
          </style>
        </defs>
        <path class="pin" d="M20 0 C8.954 0 0 8.954 0 20 C0 31.046 20 60 20 60 C20 60 40 31.046 40 20 C40 8.954 31.046 0 20 0 Z"/>
        <circle cx="20" cy="18" r="16" fill="white"/>
        <text x="20" y="18" font-size="24" text-anchor="middle" dominant-baseline="central" fill="black">${avatarContent}</text>
      </svg>
    `;

    const pinUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(pinSVG);

    const newMarker = new window.google.maps.Marker({
      position: position,
      map: map,
      draggable: true,
      icon: {
        url: pinUrl,
        scaledSize: new window.google.maps.Size(80, 120),
        anchor: new window.google.maps.Point(40, 80),
        origin: new window.google.maps.Point(0, 0),
      },
    });

    newMarker.addListener('dragend', (event) => {
      const newPosition = event.latLng;
      setMarker(prevMarker => ({ ...prevMarker, position: newPosition }));
      setMarkerPosition(newPosition);
    });

    markerRef.current = newMarker;
    return newMarker;
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

  const toggleMap = () => {
    setIsMapVisible(!isMapVisible);
  };

  const mapVariants = {
    hidden: { 
      width: 0, 
      height: 0, 
      opacity: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    visible: { 
      width: 500, 
      height: 500, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const buttonVariants = {
    map: { rotate: 0 },
    pin: { rotate: 360 }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={streetViewRef} style={{ width: '100%', height: '100%' }} />
      <AnimatePresence>
        {isMapVisible && (
          <MapContainer
            ref={mapRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mapVariants}
          />
        )}
      </AnimatePresence>
      <ButtonContainer>
        <AnimatePresence>
          {isMapVisible && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <SubmitButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSubmit}
              >
                ✅
              </SubmitButton>
            </motion.div>
          )}
        </AnimatePresence>
        <MapToggleButton
          onClick={toggleMap}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isMapVisible ? "map" : "pin"}
          variants={buttonVariants}
        >
          {isMapVisible ? '🗺️' : '📍'}
        </MapToggleButton>
      </ButtonContainer>
    </div>
  );
};

export default StreetViewComponent;