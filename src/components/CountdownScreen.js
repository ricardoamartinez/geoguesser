import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const playCountdownSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
  audio.play().catch(error => console.error('Error playing countdown sound:', error));
};

function CountdownScreen({ players, onCountdownComplete }) {
  const [countdownText, setCountdownText] = useState('');
  const [showPlayers, setShowPlayers] = useState(true);

  useEffect(() => {
    const playerDisplayTimeout = setTimeout(() => {
      setShowPlayers(false);
      let count = 10;
      const countdownInterval = setInterval(() => {
        if (count >= 0) {
          setCountdownText(count.toString());
          playCountdownSound();
          count--;
        } else {
          clearInterval(countdownInterval);
          onCountdownComplete();
        }
      }, 1000);

      return () => clearInterval(countdownInterval);
    }, 5000);

    return () => clearTimeout(playerDisplayTimeout);
  }, [onCountdownComplete]);

  return (
    <FullScreenContainer>
      <CenteredContent>
        {showPlayers ? (
          <PlayerList>
            {players.map((player, index) => (
              <PlayerItem key={index}>
                <PlayerAvatar>{player.avatar}</PlayerAvatar>
                <PlayerInfo>
                  <PlayerName>{player.username}</PlayerName>
                  <PlayerPoints>Points: {player.points || 0}</PlayerPoints>
                </PlayerInfo>
              </PlayerItem>
            ))}
          </PlayerList>
        ) : (
          <CountdownText>{countdownText}</CountdownText>
        )}
      </CenteredContent>
    </FullScreenContainer>
  );
}

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 35px #ff00de, 0 0 40px #ff00de, 0 0 50px #ff00de, 0 0 75px #ff00de; }
  100% { text-shadow: 0 0 2.5px #fff, 0 0 5px #fff, 0 0 7.5px #fff, 0 0 10px #ff00de, 0 0 17.5px #ff00de, 0 0 20px #ff00de, 0 0 25px #ff00de, 0 0 37.5px #ff00de; }
`;

const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
  z-index: 1000;
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const PlayerList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
`;

const PlayerItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
`;

const PlayerAvatar = styled.span`
  font-size: 4rem;
  margin-bottom: 0.5rem;
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlayerName = styled.span`
  font-size: 1.5rem;
  font-weight: bold;
`;

const PlayerPoints = styled.span`
  font-size: 1.2rem;
  color: #ff00de;
`;

const CountdownText = styled.div`
  font-size: 20rem;
  font-weight: bold;
  animation: ${glowAnimation} 1s ease-in-out infinite alternate;
`;

export default CountdownScreen;