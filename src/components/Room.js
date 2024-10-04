import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CountdownScreen from './CountdownScreen';
import GameScreen from './GameScreen';

const Room = ({ initialGameState, players, gameOptions, profile }) => {
  const [currentGameState, setCurrentGameState] = useState(initialGameState || 'countdown');

  useEffect(() => {
    console.log('Room: Received profile:', profile);
  }, [profile]);

  const handleCountdownComplete = () => {
    console.log('Room: Countdown complete, setting gameState to playing');
    setCurrentGameState('playing');
  };

  return (
    <RoomContainer>
      {currentGameState === 'countdown' && (
        <CountdownScreen 
          players={players} 
          onCountdownComplete={handleCountdownComplete} 
        />
      )}
      {currentGameState === 'playing' && (
        <GameScreen 
          players={players} 
          gameOptions={gameOptions} 
          profile={profile}  // Make sure this line exists
        />
      )}
    </RoomContainer>
  );
};

const RoomContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

export default Room;