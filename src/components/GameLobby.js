import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import socket, { sendMessage, onNewMessage } from '../services/socket';
import CountdownScreen from './CountdownScreen';

const playMessageSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1998/1998-preview.mp3');
  audio.play().catch(error => console.error('Error playing sound:', error));
};

const playCountdownSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
  audio.play().catch(error => console.error('Error playing countdown sound:', error));
};

function GameLobby({ gameSession, isHost, onStartGame, onBack, profile, isCountingDown }) {
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [countdownText, setCountdownText] = useState('');
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [showCountdownScreen, setShowCountdownScreen] = useState(false);

  useEffect(() => {
    const handleNewMessage = (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    };

    onNewMessage(handleNewMessage);

    return () => {
      // Clean up the event listener
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatMessage.trim() && gameSession) {
      const newMessage = {
        sender: profile.username,
        avatar: profile.avatar,
        content: chatMessage.trim(),
        timestamp: new Date().toLocaleTimeString(),
      };
      sendMessage(gameSession.id, newMessage);
      setChatMessage('');
      playMessageSound();
    }
  };

  const handleStartGame = () => {
    setIsCountdownActive(true);
    // Start the initial countdown
    let count = 3;
    const countdownInterval = setInterval(() => {
      if (count > 0) {
        setCountdownText(count.toString());
        playCountdownSound();
        count--;
      } else {
        clearInterval(countdownInterval);
        setCountdownText("Go!");
        playCountdownSound();
        // Transition to the CountdownScreen
        setShowCountdownScreen(true);
      }
    }, 1000);
  };

  const handleCountdownComplete = () => {
    onStartGame();
  };

  if (!gameSession || !gameSession.players) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {showCountdownScreen && (
        <CountdownScreen 
          players={gameSession.players} 
          onCountdownComplete={handleCountdownComplete} 
        />
      )}
      <LobbyContainer showCountdown={showCountdownScreen}>
        <PlayerList>
          {gameSession.players.map((player, index) => (
            <PlayerItem key={index}>
              {player.avatar && (
                <PlayerAvatar>{player.avatar}</PlayerAvatar>
              )}
              <PlayerName>{player.username} {player.id === gameSession.host ? '(Host)' : ''}</PlayerName>
            </PlayerItem>
          ))}
        </PlayerList>
        <ChatContainer>
          <ChatMessages>
            {chatMessages.map((msg, index) => (
              <ChatMessage key={index}>
                <PlayerAvatar>{msg.avatar}</PlayerAvatar>
                <MessageContent>
                  <MessageSender>{msg.sender}</MessageSender>
                  <MessageText>{msg.content}</MessageText>
                </MessageContent>
                <MessageTime>{msg.timestamp}</MessageTime>
              </ChatMessage>
            ))}
          </ChatMessages>
          <ChatForm onSubmit={handleSendMessage}>
            <ChatInput
              type="text"
              placeholder="Type a message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <SendButton type="submit">Send</SendButton>
          </ChatForm>
        </ChatContainer>
        {isHost ? (
          <LobbyButton
            whileHover={{ scale: isCountdownActive ? 1 : 1.05 }}
            whileTap={{ scale: isCountdownActive ? 1 : 0.95 }}
            onClick={handleStartGame}
            disabled={isCountdownActive}
            style={{ opacity: isCountdownActive ? 0.5 : 1, cursor: isCountdownActive ? 'not-allowed' : 'pointer' }}
          >
            <ButtonText>{isCountdownActive ? countdownText || 'Game Starting...' : 'Start Game'}</ButtonText>
          </LobbyButton>
        ) : (
          <WaitingMessage>
            {isCountdownActive ? countdownText || 'Game is starting...' : 'Waiting for host to start the game...'}
          </WaitingMessage>
        )}
        <LobbyButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          disabled={isCountingDown}
          style={{ opacity: isCountingDown ? 0.5 : 1, cursor: isCountingDown ? 'not-allowed' : 'pointer' }}
        >
          <ButtonText>Back</ButtonText>
        </LobbyButton>
      </LobbyContainer>
    </>
  );
}

const LobbyContainer = styled.div`
  display: ${props => (props.showCountdown ? 'none' : 'flex')}; // Hide lobby when countdown is active
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
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

const PlayerAvatar = styled.span`
  font-size: 2rem;
  margin-right: 10px;
`;

const PlayerName = styled.span`
  color: white;
  font-size: 1rem;
`;

const ChatContainer = styled.div`
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 15px;
`;

const ChatMessages = styled.div`
  padding: 10px;
`;

const ChatMessage = styled.div`
  display: flex;
  align-items: start;
  margin-bottom: 10px;
`;

const MessageContent = styled.div`
  flex-grow: 1;
  margin-left: 10px;
`;

const MessageSender = styled.div`
  font-weight: bold;
  color: #ff00de;
`;

const MessageText = styled.div`
  color: white;
`;

const MessageTime = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

const ChatForm = styled.form`
  display: flex;
  padding: 10px;
`;

const ChatInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 20px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  margin-right: 10px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled.button`
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

const WaitingMessage = styled.div`
  color: #ff00de;
  font-size: 1.2rem;
  margin: 20px 0;
  text-align: center;
`;

export default GameLobby;