// src/components/MainMenu.js
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCreator from './ProfileCreator';
import ProfileDisplay from './ProfileDisplay';

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

const MainMenu = () => {
  const [showProfileCreator, setShowProfileCreator] = useState(false);
  const [profile, setProfile] = useState(null);

  const handlePlayNow = () => {
    setShowProfileCreator(true);
  };

  const handleProfileComplete = (newProfile) => {
    setProfile(newProfile);
    setShowProfileCreator(false);
  };

  const handleJoinGame = () => {
    console.log('Join Game clicked');
    // Implement join game logic here
  };

  const handleHostGame = () => {
    console.log('Host Game clicked');
    // Implement host game logic here
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
          {profile && (
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
        </AnimatePresence>
      </CenteredContainer>
      {showProfileCreator && <ProfileCreator onComplete={handleProfileComplete} />}
      {profile && <ProfileDisplay profile={profile} />}
    </>
  );
};

export default MainMenu;
