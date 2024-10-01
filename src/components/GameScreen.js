import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import StreetView from './StreetView';

const GameScreen = ({ players, gameState }) => {
  const [showStreetView, setShowStreetView] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    console.log('GameScreen: useEffect triggered. gameState:', gameState, 'showStreetView:', showStreetView);
    if (gameState === 'playing' && !showStreetView) {
      const randomLat = Math.random() * 180 - 90;
      const randomLng = Math.random() * 360 - 180;
      console.log('GameScreen: Setting new location:', { lat: randomLat, lng: randomLng });
      setLocation({ lat: randomLat, lng: randomLng });
      setShowStreetView(true);
    }
  }, [gameState, showStreetView]);

  console.log('GameScreen: Rendered. gameState:', gameState, 'showStreetView:', showStreetView, 'location:', location);

  if (gameState !== 'playing') {
    console.log('GameScreen: Not rendering, game not in playing state');
    return null;
  }

  return (
    <GameScreenContainer>
      {players.map((player, index) => (
        <PlayerCard key={player.id}>
          <PlayerAvatar>{player.avatar}</PlayerAvatar>
          <PlayerName>{player.username}</PlayerName>
          <PlayerPoints>Points: {player.points || 0}</PlayerPoints>
        </PlayerCard>
      ))}
      {showStreetView ? (
        <StreetViewContainer>
          <StreetView lat={location.lat} lng={location.lng} />
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