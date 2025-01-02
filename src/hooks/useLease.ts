import { useContext } from 'react';
import { LeaseContext } from '../context/LeaseContext';

export const useLease = () => {
  const context = useContext(LeaseContext);
  if (context === undefined) {
    throw new Error('useLease must be used within a LeaseProvider');
  }
  return context;
};