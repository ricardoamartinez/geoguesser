import React from 'react';
import styled from 'styled-components';

const GameLobby = ({ players, isHost, onStartGame, onBack, profile }) => {
  return (
    <LobbyContainer>
      {players.map((player, index) => (
        <PlayerItem key={index}>
          {player.username} {player.isHost ? '(Host)' : ''}
        </PlayerItem>
      ))}
      <ChatInput type="text" placeholder="Type a message..." />
      {isHost && (
        <LobbyButton onClick={onStartGame}>
          Start Game
        </LobbyButton>
      )}
      <LobbyButton onClick={onBack}>
        Back
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

const PlayerItem = styled.div`
  margin: 5px 0;
  color: white;
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

const LobbyButton = styled.button`
  margin: 5px 0;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background-color: #4a00e0;
  color: white;
  cursor: pointer;
  
  &:hover {
    background-color: #5c16e0;
  }
`;

export default GameLobby;