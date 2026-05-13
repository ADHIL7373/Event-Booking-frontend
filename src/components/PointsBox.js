/**
 * PointsBox Component
 * Displays user's reward points in top corner
 * Minimal design, small size
 */

import React, { useEffect } from 'react';
import { useRewardPoints } from '../context/RewardPointsContext';
import './PointsBox.css';

const PointsBox = () => {
  const { availablePoints, loadUserPoints } = useRewardPoints();

  useEffect(() => {
    loadUserPoints();
  }, [loadUserPoints]);

  return (
    <div className="points-box">
      <div className="points-box-icon">💰</div>
      <div className="points-box-content">
        <div className="points-box-label">Points</div>
        <div className="points-box-value">{availablePoints || 0}</div>
      </div>
    </div>
  );
};

export default PointsBox;
