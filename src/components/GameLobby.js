import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { getAvatarUrl } from '../utils/avatars'; // Assuming you have this utility function

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 35px #ff00de, 0 0 40px #ff00de, 0 0 50px #ff00de, 0 0 75px #ff00de; }
  100% { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #ff00de, 0 0 70px #ff00de, 0 0 80px #ff00de, 0 0 100px #ff00de, 0 0 150px #ff00de; }
`;

const LobbyContainer = styled(motion.div)`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 90%;
  color: #ffffff;
  pointer-events: auto;
`;

const LobbyTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ff00de;
  animation: ${glowAnimation} 2s ease-in-out infinite alternate;
`;

const PlayerList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
`;

const PlayerItem = styled.li`
  background: rgba(74, 0, 224, 0.2);
  border: 2px solid #4a00e0;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayerAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  border: 2px solid #4a00e0;
  object-fit: cover;
`;

const PlayerName = styled.span`
  font-size: 1rem;
  color: #ffffff;
`;

const ChatArea = styled.div`
  width: 100%;
  margin-top: 1rem;
  border: 2px solid #4a00e0;
  border-radius: 10px;
  height: 200px;
  overflow-y: auto;
  padding: 1rem;
  background: rgba(74, 0, 224, 0.1);
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #4a00e0;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  margin-top: 0.5rem;
`;

const StartGameButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: linear-gradient(45deg, #8e2de2, #4a00e0);
  border: none;
  border-radius: 25px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #9b4dff, #4a00e0);
  }
`;

const GameLobby = ({ players, isHost, onStartGame }) => {
  const [chatMessage, setChatMessage] = useState('');

  const handleChatSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement chat functionality
    console.log('Chat message:', chatMessage);
    setChatMessage('');
  };

  return (
    <LobbyContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <LobbyTitle>Game Lobby</LobbyTitle>
      <PlayerList>
        {players.map((player, index) => (
          <PlayerItem key={index}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <PlayerAvatar src={getAvatarUrl(player.avatar)} alt={player.username} />
              <PlayerName>
                {player.username} {player.isHost && '(Host)'}
              </PlayerName>
            </div>
          </PlayerItem>
        ))}
      </PlayerList>
      <ChatArea>
        {/* Chat messages will be displayed here */}
      </ChatArea>
      <form onSubmit={handleChatSubmit}>
        <ChatInput
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Type a message..."
        />
      </form>
      {isHost && <StartGameButton onClick={onStartGame}>Start Game</StartGameButton>}
    </LobbyContainer>
  );
};

export default GameLobby;