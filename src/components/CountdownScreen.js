import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM for portals
import styled, { keyframes } from 'styled-components';

const playCountdownSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
  audio.play().catch(error => console.error('Error playing countdown sound:', error));
};

function CountdownScreen({ players, onCountdownComplete }) {
  const [countdownText, setCountdownText] = useState('');

  useEffect(() => {
    let count = 1;
    const countdownInterval = setInterval(() => {
      if (count > 0) {
        setCountdownText(count.toString());
        playCountdownSound();
        count--;
      } else {
        clearInterval(countdownInterval);
        setCountdownText('GO!');
        setTimeout(() => {
          console.log('CountdownScreen: Countdown complete, calling onCountdownComplete');
          onCountdownComplete();
        }, 1000);
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []); // Empty dependency array to ensure it only runs once

  // Use React Portal to render the CountdownScreen at the end of the DOM
  return ReactDOM.createPortal(
    <FullScreenContainer>
      <CenteredContent>
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
        <CountdownText>{countdownText}</CountdownText>
      </CenteredContent>
    </FullScreenContainer>,
    document.body // Render the portal to the body
  );
}

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 35px #ff00de, 0 0 40px #ff00de, 0 0 50px #ff00de, 0 0 75px #ff00de; }
  100% { text-shadow: 0 0 2.5px #fff, 0 0 5px #fff, 0 0 7.5px #fff, 0 0 10px #ff00de, 0 0 17.5px #ff00de, 0 0 20px #ff00de, 0 0 25px #ff00de, 0 0 37.5px #ff00de; }
`;

// Update the FullScreenContainer to ensure proper centering
const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center; // Center vertically
  justify-content: center; // Center horizontally
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999; // Increase z-index to ensure it's on top
`;

// Ensure CountdownText is centered and responsive
const CountdownText = styled.div`
  font-size: 10vmin; // Responsive font size
  font-weight: bold;
  animation: ${glowAnimation} 1s ease-in-out infinite alternate;
  color: #ffffff;
  text-align: center; // Center text horizontally
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; // Ensure text is centered
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

export default CountdownScreen;