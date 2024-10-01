import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const GameLobby = ({ players, isHost, onStartGame, onBack, profile }) => {
  console.log('GameLobby players:', players); // Add this line
  return (
    <LobbyContainer>
      <PlayerList>
        {players.map((player, index) => (
          <PlayerItem key={index}>
            {player.avatar && (
              <PlayerAvatar src={player.avatar} alt={`${player.username}'s avatar`} />
            )}
            <PlayerName>{player.username} {player.isHost ? '(Host)' : ''}</PlayerName>
          </PlayerItem>
        ))}
      </PlayerList>
      <ChatInput type="text" placeholder="Type a message..." />
      {isHost && (
        <LobbyButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartGame}
        >
          <ButtonText>Start Game</ButtonText>
        </LobbyButton>
      )}
      <LobbyButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
      >
        <ButtonText>Back</ButtonText>
      </LobbyButton>
    </LobbyContainer>
  );
};

const LobbyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const PlayerList = styled.div`
  width: 100%;
  margin-bottom: 15px;
`;

const PlayerItem = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
`;

const PlayerAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const PlayerName = styled.span`
  color: white;
  font-size: 1rem;
`;

const ChatInput = styled.input`
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 20px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const LobbyButton = styled(motion.button)`
  margin: 5px 0;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: linear-gradient(45deg, #8e2de2, #4a00e0);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  color: #ffffff;
  box-shadow: 0px 4px 10px rgba(74, 0, 224, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 200px;

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
    transform: scale(0);
    transition: transform 0.5s;
  }

  &:hover {
    background: linear-gradient(45deg, #9b4dff, #4a00e0);
    box-shadow: 0px 6px 15px rgba(74, 0, 224, 0.5);
    animation: ${pulseAnimation} 1.5s infinite;
  }

  &:hover:before {
    transform: scale(1);
  }

  &:active {
    transform: translateY(2px);
  }
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 1;
`;

export default GameLobby;