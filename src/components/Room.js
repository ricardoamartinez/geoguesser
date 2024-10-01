import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CountdownScreen from './CountdownScreen';
import GameScreen from './GameScreen';

const Room = ({ players, roomCode }) => {
  const [gameState, setGameState] = useState('countdown');

  const handleCountdownComplete = () => {
    console.log('Countdown complete, setting gameState to playing');
    setGameState('playing');
  };

  useEffect(() => {
    console.log('Current gameState:', gameState);
  }, [gameState]);

  return (
    <RoomContainer>
      {gameState === 'countdown' && (
        <CountdownScreen 
          players={players} 
          onCountdownComplete={handleCountdownComplete} 
        />
      )}
      <GameScreen players={players} gameState={gameState} />
    </RoomContainer>
  );
};

const RoomContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

export default Room;