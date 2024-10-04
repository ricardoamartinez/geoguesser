import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import StreetViewComponent from './StreetViewComponent';

const GameScreen = ({ players, gameOptions = {} }) => {
  const [location, setLocation] = useState(null);
  const [isStreetViewReady, setIsStreetViewReady] = useState(false);
  const [error, setError] = useState(null);
  const initialLocationSet = useRef(false);

  const {
    filter = 'none',
    moveAllowed = true,
    region = 'world',
    locationType = 'any'
  } = gameOptions;

  console.log('GameScreen: moveAllowed:', moveAllowed);

  const getRandomLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      const regionBounds = getRegionBounds(region);
      const maxAttempts = 20; // Increase the number of attempts
      let attempts = 0;

      const tryLocation = () => {
        const lat = Math.random() * (regionBounds.north - regionBounds.south) + regionBounds.south;
        const lng = Math.random() * (regionBounds.east - regionBounds.west) + regionBounds.west;

        const streetViewService = new window.google.maps.StreetViewService();
        streetViewService.getPanorama({
          location: { lat, lng },
          radius: 50000,
          source: getStreetViewSource(locationType)
        }, (data, status) => {
          if (status === 'OK') {
            resolve({
              lat: data.location.latLng.lat(),
              lng: data.location.latLng.lng()
            });
          } else {
            attempts++;
            if (attempts < maxAttempts) {
              tryLocation();
            } else {
              reject(new Error(`Failed to find a suitable Street View location after ${maxAttempts} attempts`));
            }
          }
        });
      };

      tryLocation();
    });
  }, [region, locationType]);

  const setNewLocation = useCallback(() => {
    if (initialLocationSet.current) {
      console.log('Location already set, skipping...');
      return;
    }

    setIsStreetViewReady(false);
    setError(null);
    getRandomLocation()
      .then(newLocation => {
        console.log('GameScreen: Setting new location:', newLocation, 'with filter:', filter);
        setLocation(newLocation);
        setIsStreetViewReady(true);
        initialLocationSet.current = true;
      })
      .catch(error => {
        console.error('Failed to get random location:', error);
        setError('Failed to find a suitable location. Please try again.');
        setTimeout(() => {
          initialLocationSet.current = false;
          setNewLocation();
        }, 2000);
      });
  }, [getRandomLocation, filter]);

  useEffect(() => {
    if (!initialLocationSet.current) {
      setNewLocation();
    }
  }, [setNewLocation]);

  const memoizedStreetView = useMemo(() => {
    if (isStreetViewReady && location) {
      return (
        <StreetViewComponent 
          lat={location.lat} 
          lng={location.lng} 
          heading={0}
          pitch={0}
          allowMovement={moveAllowed}
        />
      );
    }
    return null;
  }, [isStreetViewReady, location, moveAllowed]);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <GameScreenContainer>
      {players.map((player) => (
        <PlayerCard key={player.id}>
          <PlayerAvatar>{player.avatar}</PlayerAvatar>
          <PlayerName>{player.username}</PlayerName>
          <PlayerPoints>Points: {player.points || 0}</PlayerPoints>
        </PlayerCard>
      ))}
      <StreetViewContainer>
        {memoizedStreetView || <LoadingMessage>Loading StreetView...</LoadingMessage>}
      </StreetViewContainer>
    </GameScreenContainer>
  );
};

const getRegionBounds = (region) => {
  // Define bounding boxes for each region
  const bounds = {
    world: { north: 85, south: -85, east: 180, west: -180 },
    europe: { north: 71, south: 35, east: 40, west: -25 },
    asia: { north: 53, south: -10, east: 180, west: 25 },
    americas: { north: 83, south: -56, east: -34, west: -171 },
    africa: { north: 37, south: -35, east: 51, west: -18 },
    oceania: { north: 21, south: -47, east: 180, west: 110 }
  };
  return bounds[region] || bounds.world;
};

const getStreetViewSource = (locationType) => {
  switch (locationType) {
    case 'outdoor':
      return window.google.maps.StreetViewSource.OUTDOOR;
    case 'indoor':
      return window.google.maps.StreetViewSource.INDOOR;
    default:
      return window.google.maps.StreetViewSource.DEFAULT;
  }
};

const GameScreenContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: linear-gradient(45deg, #1e1e1e, #2a0080);
`;

const PlayerCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
`;

const PlayerAvatar = styled.div`
  font-size: 4rem;
  margin-bottom: 10px;
`;

const PlayerName = styled.div`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 5px;
`;

const PlayerPoints = styled.div`
  font-size: 1.2rem;
  color: #ff00de;
`;

const StreetViewContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 20px;
`;

const LoadingMessage = styled.div`
  color: white;
  font-size: 1.2rem;
  text-align: center;
`;

export default GameScreen;