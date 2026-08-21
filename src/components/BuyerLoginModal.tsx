import React from 'react';
import { UserProfile } from '../types';
import { AmazonFlipkartAuthModal } from './AmazonFlipkartAuthModal';

interface BuyerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onLoginSuccess: (updatedProfile: UserProfile) => void;
  contextualMessage?: string;
  onContinueAsGuest?: () => void;
}

export const BuyerLoginModal: React.FC<BuyerLoginModalProps> = (props) => {
  return <AmazonFlipkartAuthModal {...props} />;
};

export default BuyerLoginModal;
