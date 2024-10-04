import React, { useEffect, useRef, useState } from 'react';

const StreetViewComponent = ({ lat, lng, heading, pitch, allowMovement }) => {
  const streetViewRef = useRef(null);
  const panoramaRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('StreetViewComponent: Effect triggered with:', { lat, lng, heading, pitch, allowMovement });
    if (window.google && window.google.maps) {
      if (!panoramaRef.current) {
        initializeStreetView();
      } else {
        updateStreetView();
      }
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps);
          initializeStreetView();
        }
      }, 100);
    }
  }, [lat, lng, heading, pitch, allowMovement]);

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

        applyMovementRestrictions();
        setError(null);
      } else {
        console.error('Street View data not found for this location.');
        setError('No Street View available for this location');
      }
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

  if (error) {
    return <div>{error}</div>;
  }

  return <div ref={streetViewRef} style={{ width: '100%', height: '100%' }} />;
};

export default StreetViewComponent;