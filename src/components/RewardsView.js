import React, { useEffect, useState } from 'react';
import walletService from '../services/walletService';
import './RewardsView.css';

function formatCurrency(amount) {
  return `₹${amount.toLocaleString()}`;
}

export default function RewardsView({ compact = false }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchSummary = async () => {
      try {
        const response = await walletService.getSummary({ params: {} });
        if (mounted) {
          setSummary(response.data.data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || 'Failed to load rewards');
          console.error(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSummary();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="rewards-skeleton">Loading rewards...</div>;
  }

  if (error) {
    return <div className="rewards-error">{error}</div>;
  }

  const rewardPoints = summary?.rewardPoints || 0;
  const equivalentValue = rewardPoints * 1; // 1 point = ₹1

  return (
    <div className={`rewards-view ${compact ? 'rewards-view-compact' : ''}`}>
      <div className="rewards-header">
        <h2>✨ Reward Points</h2>
        <p className="rewards-subtitle">Earn points on every purchase</p>
      </div>

      <div className="rewards-card main-card">
        <div className="points-circle">
          <div className="points-value">{rewardPoints.toLocaleString()}</div>
          <div className="points-label">Total Points</div>
        </div>
        <div className="points-info">
          <div className="info-item">
            <span className="info-label">Equivalent Value</span>
            <span className="info-value">{formatCurrency(equivalentValue)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Rate</span>
            <span className="info-value">₹10 = 1 Point</span>
          </div>
        </div>
      </div>

      <div className="rewards-benefits">
        <h3>How to Earn & Use Points</h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🎁</div>
            <h4>Earn Points</h4>
            <p>Get 1 point for every ₹10 spent on bookings</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💰</div>
            <h4>Redeem Points</h4>
            <p>Use points as discount during checkout</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📊</div>
            <h4>Max Discount</h4>
            <p>Up to 30% of order value per booking</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🔄</div>
            <h4>Auto Reversal</h4>
            <p>Points returned if booking is cancelled</p>
          </div>
        </div>
      </div>

      <div className="rewards-note">
        <strong>💡 Tip:</strong> Apply reward points during checkout to get instant discounts on your event bookings!
      </div>
    </div>
  );
}
