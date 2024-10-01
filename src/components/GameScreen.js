import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const GameScreen = ({ players }) => {
  return (
    <GameScreenContainer>
      {players.map((player, index) => (
        <PlayerCard
          key={player.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <PlayerAvatar>{player.avatar}</PlayerAvatar>
          <PlayerName>{player.username}</PlayerName>
          <PlayerPoints>Points: {player.points || 0}</PlayerPoints>
        </PlayerCard>
      ))}
    </GameScreenContainer>
  );
};

const GameScreenContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  background: linear-gradient(45deg, #1e1e1e, #2a0080);
`;

const PlayerCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
`;

const PlayerAvatar = styled.div`
  font-size: 4rem;
  margin-bottom: 10px;
`;

const PlayerName = styled.div`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 5px;
`;

const PlayerPoints = styled.div`
  font-size: 1.2rem;
  color: #ff00de;
`;

export default GameScreen;