import React from 'react';
import styled from 'styled-components';

const ScoreBoard = ({ players }) => {
  return (
    <ScoreBoardContainer>
      {players.map((player, index) => (
        <PlayerScore key={index}>
          {player.username}: {player.points || 0}
        </PlayerScore>
      ))}
    </ScoreBoardContainer>
  );
};

const ScoreBoardContainer = styled.div`
  // Your styles here
`;

const PlayerScore = styled.div`
  // Your styles here
`;

export default ScoreBoard;