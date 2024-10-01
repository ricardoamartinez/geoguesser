import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProfileContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const ProfileContent = styled(motion.div)`
  background: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 500px;
`;

const Title = styled.h2`
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: center;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid ${props => props.selected ? '#ff00de' : 'transparent'};
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  background-color: ${props => props.selected ? 'rgba(255, 0, 222, 0.2)' : 'transparent'};

  &:hover {
    transform: scale(1.1);
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
`;

const Button = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: linear-gradient(45deg, #8e2de2, #4a00e0);
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
`;

const avatars = [
  '🦊', '🦉', '🐼', '🐧', '🐨',
  '🦁', '🐯', '🐘', '🦒', '🐵'
];

const ProfileCreator = ({ onComplete }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    if (selectedAvatar !== null && username) {
      onComplete({ avatar: avatars[selectedAvatar], username });
    }
  };

  return (
    <ProfileContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ProfileContent
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <Title>Create Your Profile</Title>
        <AvatarGrid>
          {avatars.map((avatar, index) => (
            <Avatar
              key={index}
              onClick={() => setSelectedAvatar(index)}
              selected={selectedAvatar === index}
            >
              {avatar}
            </Avatar>
          ))}
        </AvatarGrid>
        <Input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
        >
          Create Profile
        </Button>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default ProfileCreator;