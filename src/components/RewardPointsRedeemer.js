import React, { useState, useEffect } from 'react';
import './RewardPointsRedeemer.css';

export default function RewardPointsRedeemer({ 
  totalAmount, 
  availablePoints, 
  onRedeemPoints,
  isLoading = false 
}) {
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate max redeemable points (30% of order value)
  const maxRedeemablePoints = Math.floor(totalAmount * 0.3);
  const maxPoints = Math.min(availablePoints, maxRedeemablePoints);
  const discountAmount = pointsToRedeem * 1; // 1 point = ₹1
  const finalAmount = Math.max(1, totalAmount - discountAmount);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleRedeemClick = async () => {
    setError('');
    setSuccess('');

    if (pointsToRedeem === 0) {
      setError('Enter points to redeem');
      return;
    }

    if (pointsToRedeem > maxPoints) {
      setError(`Maximum ${maxPoints} points can be redeemed`);
      return;
    }

    try {
      await onRedeemPoints(pointsToRedeem);
      setSuccess(`Redeemed ${pointsToRedeem} points successfully!`);
      setPointsToRedeem(0);
    } catch (err) {
      setError(err.message || 'Failed to redeem points');
    }
  };

  const handleSliderChange = (e) => {
    setPointsToRedeem(Math.min(Math.max(0, parseInt(e.target.value)), maxPoints));
  };

  const handleMaxClick = () => {
    setPointsToRedeem(maxPoints);
  };

  return (
    <div className="reward-points-redeemer">
      <div className="redeemer-header">
        <h3>💎 Redeem Reward Points</h3>
        <p className="available-points">Available: {availablePoints.toLocaleString()} points</p>
      </div>

      {/* Slider */}
      <div className="slider-section">
        <div className="slider-labels">
          <span>0 points</span>
          <span className="max-label">Max {maxPoints} points</span>
        </div>
        <input
          type="range"
          min="0"
          max={maxPoints}
          value={pointsToRedeem}
          onChange={handleSliderChange}
          className="points-slider"
          disabled={isLoading || maxPoints === 0}
        />
      </div>

      {/* Points Display */}
      <div className="points-display">
        <div className="point-item">
          <span className="point-label">Points to Redeem</span>
          <span className="point-value selected">{pointsToRedeem.toLocaleString()}</span>
        </div>
        <div className="point-item">
          <span className="point-label">Discount (₹)</span>
          <span className="point-value discount">-₹{discountAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="price-breakdown">
        <div className="breakdown-row">
          <span>Original Price</span>
          <span>₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="breakdown-row">
          <span>Discount</span>
          <span className="discount">-₹{discountAmount.toLocaleString()}</span>
        </div>
        <div className="breakdown-row total">
          <span>Final Price</span>
          <span>₹{finalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Info Text */}
      {maxRedeemablePoints < availablePoints && (
        <div className="info-text">
          ℹ️ Maximum redeemable: ₹{maxRedeemablePoints} (30% of order)
        </div>
      )}

      {/* Max Button & Redeem Button */}
      <div className="button-group">
        <button
          className="button-secondary"
          onClick={handleMaxClick}
          disabled={isLoading || maxPoints === 0}
        >
          Use Max
        </button>
        <button
          className="button-primary"
          onClick={handleRedeemClick}
          disabled={isLoading || pointsToRedeem === 0 || maxPoints === 0}
        >
          {isLoading ? 'Applying...' : 'Apply Points'}
        </button>
      </div>

      {/* Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* No Points Available */}
      {maxPoints === 0 && (
        <div className="empty-state">
          <p>No reward points available to redeem</p>
        </div>
      )}
    </div>
  );
}
