import { createContext, useContext, useState, useCallback } from 'react';
import walletService from '../services/walletService';

const RewardPointsContext = createContext();

export function RewardPointsProvider({ children }) {
  const [rewardState, setRewardState] = useState({
    availablePoints: 0,
    pointsRedeemed: 0,
    discountAmount: 0,
    loading: false,
    error: null,
  });

  const loadUserPoints = useCallback(async () => {
    try {
      setRewardState(prev => ({ ...prev, loading: true, error: null }));
      const response = await walletService.getSummary({ params: {} });
      setRewardState(prev => ({
        ...prev,
        availablePoints: response.data.data.rewardPoints || 0,
        loading: false,
      }));
    } catch (err) {
      setRewardState(prev => ({
        ...prev,
        error: err.response?.data?.message || 'Failed to load points',
        loading: false,
      }));
    }
  }, []);

  const redeemPoints = useCallback(async (bookingId, pointsToRedeem) => {
    try {
      setRewardState(prev => ({ ...prev, loading: true, error: null }));
      const response = await walletService.redeemPoints({
        bookingId,
        pointsToRedeem,
      });
      const data = response.data.data;
      setRewardState(prev => ({
        ...prev,
        pointsRedeemed: data.pointsRedeemed,
        discountAmount: data.discountAmount,
        availablePoints: data.remainingPoints,
        loading: false,
      }));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to redeem points';
      setRewardState(prev => ({
        ...prev,
        error: errorMsg,
        loading: false,
      }));
      throw new Error(errorMsg);
    }
  }, []);

  const earnPoints = useCallback(async (bookingId) => {
    try {
      setRewardState(prev => ({ ...prev, loading: true, error: null }));
      const response = await walletService.earnPoints({ bookingId });
      const data = response.data.data;
      setRewardState(prev => ({
        ...prev,
        availablePoints: data.totalPoints,
        loading: false,
      }));
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to earn points';
      setRewardState(prev => ({
        ...prev,
        error: errorMsg,
        loading: false,
      }));
      throw new Error(errorMsg);
    }
  }, []);

  const resetPoints = useCallback(() => {
    setRewardState({
      availablePoints: 0,
      pointsRedeemed: 0,
      discountAmount: 0,
      loading: false,
      error: null,
    });
  }, []);

  const value = {
    ...rewardState,
    loadUserPoints,
    redeemPoints,
    earnPoints,
    resetPoints,
  };

  return (
    <RewardPointsContext.Provider value={value}>
      {children}
    </RewardPointsContext.Provider>
  );
}

export function useRewardPoints() {
  const context = useContext(RewardPointsContext);
  if (!context) {
    throw new Error('useRewardPoints must be used within RewardPointsProvider');
  }
  return context;
}
