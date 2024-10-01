import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProfileContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 25px;
  z-index: 1000;
`;

const Avatar = styled.div`
  font-size: 2rem;
  margin-right: 10px;
`;

const Username = styled.span`
  color: white;
  font-size: 1rem;
`;

const ProfileDisplay = ({ profile }) => {
  return (
    <ProfileContainer
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Avatar>{profile.avatar}</Avatar>
      <Username>{profile.username}</Username>
    </ProfileContainer>
  );
};

export default ProfileDisplay;