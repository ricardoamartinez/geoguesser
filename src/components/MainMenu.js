// src/components/MainMenu.js
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCreator from './ProfileCreator';
import ProfileDisplay from './ProfileDisplay';
import GameLobby from './GameLobby';

const CenteredContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  pointer-events: none;
`;

const MenuContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 35px #ff00de, 0 0 40px #ff00de, 0 0 50px #ff00de, 0 0 75px #ff00de; }
  100% { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #ff00de, 0 0 70px #ff00de, 0 0 80px #ff00de, 0 0 100px #ff00de, 0 0 150px #ff00de; }
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 2rem;
  color: #ffffff;
  font-family: 'Arial Black', Gadget, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  animation: ${glowAnimation} 2s ease-in-out infinite alternate;

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const PlayButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.5rem;
  background: linear-gradient(45deg, #8e2de2, #4a00e0);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  color: #ffffff;
  box-shadow: 0px 4px 10px rgba(74, 0, 224, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  pointer-events: auto;

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

  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
  }
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 1;
`;

const MenuOptions = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MenuButton = styled(PlayButton)`
  margin-bottom: 1rem;
`;

const HostGameModal = styled(motion.div)`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 90%;
  pointer-events: auto;
`;

const OptionGroup = styled.div`
  margin-bottom: 1rem;
  width: 100%;
`;

const OptionLabel = styled.label`
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: block;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 25px;
  background: rgba(74, 0, 224, 0.2);
  color: #ffffff;
  border: 2px solid #4a00e0;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 2rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 1rem auto;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 0, 224, 0.5);
  }

  option {
    background-color: #2a0080;
    color: #ffffff;
  }
`;

const CheckboxLabel = styled(OptionLabel)`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #4a00e0;
  border-radius: 4px;
  background-color: rgba(74, 0, 224, 0.2);
  cursor: pointer;
  position: relative;

  &:checked {
    background-color: #4a00e0;
  }

  &:checked::after {
    content: '✔';
    font-size: 14px;
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const HostGameButton = styled(PlayButton)`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  width: 200px;
`;

const MainMenu = () => {
  const [showProfileCreator, setShowProfileCreator] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showGameCodeInput, setShowGameCodeInput] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [showHostOptions, setShowHostOptions] = useState(false);
  const [gameOptions, setGameOptions] = useState({
    locationType: 'any',
    region: 'world',
    timeLimit: 60,
    roundCount: 5,
    moveAllowed: true,
  });
  const [showLobby, setShowLobby] = useState(false);
  const [lobbyPlayers, setLobbyPlayers] = useState([]);

  const handlePlayNow = () => {
    setShowProfileCreator(true);
  };

  const handleProfileComplete = (newProfile) => {
    setProfile(newProfile);
    setShowProfileCreator(false);
  };

  const handleJoinGame = () => {
    setShowGameCodeInput(true);
  };

  const handleGameCodeSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle game code submission
    console.log('Game code submitted:', gameCode);
  };

  const handleHostGame = () => {
    setShowHostOptions(true);
  };

  const handleGameCodeChange = (e) => {
    setGameCode(e.target.value);
  };

  const handleOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGameOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStartGame = () => {
    console.log('Starting game with options:', gameOptions);
    setLobbyPlayers([
      { username: profile.username, isHost: true, avatar: profile.avatar },
      { username: 'Player 2', isHost: false, avatar: 'avatar2' },
      { username: 'Player 3', isHost: false, avatar: 'avatar3' },
    ]);
    setShowHostOptions(false);
    setShowGameCodeInput(false);
    setShowProfileCreator(false);
    setShowLobby(true);
  };

  const handleLobbyStartGame = () => {
    // TODO: Implement actual game start logic
    console.log('Starting the game from lobby');
  };

  return (
    <>
      <CenteredContainer>
        <AnimatePresence>
          {!showProfileCreator && !profile && (
            <MenuContent
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Title
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Geo<span style={{ color: '#ff00de' }}>Guesser</span>
              </Title>
              <PlayButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayNow}
              >
                <ButtonText>Play Now</ButtonText>
              </PlayButton>
            </MenuContent>
          )}
          {profile && !showGameCodeInput && !showHostOptions && !showLobby && (
            <MenuContent
              key="options"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <MenuButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleJoinGame}
              >
                <ButtonText>Join Game</ButtonText>
              </MenuButton>
              <MenuButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHostGame}
              >
                <ButtonText>Host Game</ButtonText>
              </MenuButton>
            </MenuContent>
          )}
          {showGameCodeInput && (
            <GameCodeForm
              key="gameCodeForm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onSubmit={handleGameCodeSubmit}
            >
              <GameCodeInput
                type="text"
                value={gameCode}
                onChange={handleGameCodeChange}
                placeholder="Enter game code"
                autoFocus
              />
              <SubmitButton type="submit">
                <ButtonText>Join</ButtonText>
              </SubmitButton>
              <SubmitButton type="button" onClick={() => setShowGameCodeInput(false)}>
                <ButtonText>Back</ButtonText>
              </SubmitButton>
            </GameCodeForm>
          )}
          {showHostOptions && (
            <HostGameModal
              key="hostOptions"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Title style={{ fontSize: '2rem', marginBottom: '1rem' }}>Host Game</Title>
              <OptionGroup>
                <OptionLabel>Location Type</OptionLabel>
                <Select name="locationType" value={gameOptions.locationType} onChange={handleOptionChange}>
                  <option value="any">Any</option>
                  <option value="capitals">Capitals Only</option>
                  <option value="landmarks">Famous Landmarks</option>
                </Select>
              </OptionGroup>
              <OptionGroup>
                <OptionLabel>Region</OptionLabel>
                <Select name="region" value={gameOptions.region} onChange={handleOptionChange}>
                  <option value="world">Worldwide</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia</option>
                  <option value="americas">Americas</option>
                  <option value="africa">Africa</option>
                  <option value="oceania">Oceania</option>
                </Select>
              </OptionGroup>
              <OptionGroup>
                <OptionLabel>Time Limit (seconds)</OptionLabel>
                <Select name="timeLimit" value={gameOptions.timeLimit} onChange={handleOptionChange}>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="120">120</option>
                  <option value="300">300</option>
                </Select>
              </OptionGroup>
              <OptionGroup>
                <OptionLabel>Number of Rounds</OptionLabel>
                <Select name="roundCount" value={gameOptions.roundCount} onChange={handleOptionChange}>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </Select>
              </OptionGroup>
              <OptionGroup>
                <CheckboxLabel>
                  <Checkbox
                    type="checkbox"
                    name="moveAllowed"
                    checked={gameOptions.moveAllowed}
                    onChange={handleOptionChange}
                  />
                  Allow Movement
                </CheckboxLabel>
              </OptionGroup>
              <HostGameButton onClick={handleStartGame}>
                <ButtonText>Start Game</ButtonText>
              </HostGameButton>
              <HostGameButton onClick={() => setShowHostOptions(false)}>
                <ButtonText>Back</ButtonText>
              </HostGameButton>
            </HostGameModal>
          )}
          {showLobby && (
            <HostGameModal
              key="lobby"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Title style={{ fontSize: '2rem', marginBottom: '1rem' }}>Game Lobby</Title>
              <GameLobby
                players={lobbyPlayers}
                isHost={true}
                onStartGame={handleLobbyStartGame}
                onBack={() => {
                  setShowLobby(false);
                  setLobbyPlayers([]);
                }}
                profile={profile}
              />
            </HostGameModal>
          )}
        </AnimatePresence>
      </CenteredContainer>
      {showProfileCreator && <ProfileCreator onComplete={handleProfileComplete} />}
      {profile && !showLobby && <ProfileDisplay profile={profile} />}
    </>
  );
};

const GameCodeForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
`;

const GameCodeInput = styled.input`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 2px solid #4a00e0;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  margin-bottom: 0.5rem;
  width: 200px;
  text-align: center;
  pointer-events: auto;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SubmitButton = styled(PlayButton)`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  width: 200px; // Match the width of the input
`;

export default MainMenu;