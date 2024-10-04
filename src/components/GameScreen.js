import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import StreetViewComponent from './StreetViewComponent';

const guaranteedLocations = [
  { lat: 40.7580, lng: -73.9855 },  // Times Square, New York
  { lat: 48.8584, lng: 2.2945 },    // Eiffel Tower, Paris
  { lat: 51.5007, lng: -0.1246 },   // Big Ben, London
  { lat: 35.6762, lng: 139.6503 },  // Tokyo Tower, Tokyo
  { lat: -33.8568, lng: 151.2153 }, // Sydney Opera House, Sydney
  { lat: 41.8902, lng: 12.4922 },   // Colosseum, Rome
  { lat: 37.8199, lng: -122.4783 }, // Golden Gate Bridge, San Francisco
  { lat: -22.9519, lng: -43.2105 }, // Christ the Redeemer, Rio de Janeiro
  { lat: 55.7520, lng: 37.6175 },   // Red Square, Moscow
  { lat: 40.4319, lng: 116.5704 },  // Great Wall of China, Beijing
];

const filters = [
  'none',
  'grayscale(100%)',
  'sepia(100%)',
  'invert(100%)',
  'hue-rotate(180deg)',
  'blur(5px)',
];

const GameScreen = ({ players, gameState }) => {
  const [showStreetView, setShowStreetView] = useState(false);
  const [location, setLocation] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('none');

  const getRandomLocation = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * guaranteedLocations.length);
    return guaranteedLocations[randomIndex];
  }, []);

  const getRandomFilter = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * filters.length);
    return filters[randomIndex];
  }, []);

  const setNewLocation = useCallback(() => {
    const newLocation = getRandomLocation();
    const newFilter = getRandomFilter();
    console.log('GameScreen: Setting new location:', newLocation, 'with filter:', newFilter);
    setLocation(newLocation);
    setCurrentFilter(newFilter);
    setShowStreetView(true);
  }, [getRandomLocation, getRandomFilter]);

  useEffect(() => {
    console.log('GameScreen: useEffect triggered. gameState:', gameState, 'showStreetView:', showStreetView);
    if (gameState === 'playing' && !showStreetView) {
      setNewLocation();
    }
  }, [gameState, showStreetView, setNewLocation]);

  console.log('GameScreen: Rendered. gameState:', gameState, 'showStreetView:', showStreetView, 'location:', location, 'filter:', currentFilter);

  if (gameState !== 'playing') {
    console.log('GameScreen: Not rendering, game not in playing state');
    return null;
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
      {showStreetView && location ? (
        <StreetViewContainer>
          <StreetViewComponent 
            lat={location.lat} 
            lng={location.lng} 
            onNoStreetView={setNewLocation}
            filter={currentFilter}
          />
        </StreetViewContainer>
      ) : (
        <div>Loading StreetView...</div>
      )}
    </GameScreenContainer>
  );
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

export default GameScreen;