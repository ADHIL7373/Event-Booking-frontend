import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminStyles.css';

const AdminWallet = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState('all');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchWalletData();
  }, [page, timeFilter]);

  const fetchWalletData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/wallet', {
        params: { page, limit: 20 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-banner">{error}</div>;

  const { walletStats, rewardStats, transactions } = data || {};

  return (
    <div className="admin-wallet">
      <h1 className="page-title">Wallet & Financial Overview</h1>

      {/* Wallet Statistics */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <div className="card-label">Total Wallet Balance</div>
            <div className="card-value">${walletStats?.totalBalance?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <div className="card-meta">{walletStats?.totalUsersWithWallet} users</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <div className="card-label">Average Balance</div>
            <div className="card-value">${walletStats?.avgBalance?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">⭐</div>
          <div className="card-content">
            <div className="card-label">Reward Points Issued</div>
            <div className="card-value">{rewardStats?.totalPointsIssued?.toLocaleString()}</div>
            <div className="card-meta">{rewardStats?.totalTransactions} transactions</div>
          </div>
        </div>
      </div>

      {/* Time Filter */}
      <div className="filter-section">
        <label>Filter by Period:</label>
        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="admin-section">
        <h2>Recent Transactions</h2>
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.userId?.fullName}</td>
                  <td>
                    <span className={`transaction-type ${transaction.type}`}>
                      {transaction.type === 'debit' ? '📤 Debit' : '📥 Credit'}
                    </span>
                  </td>
                  <td className={`amount ${transaction.type}`}>
                    {transaction.type === 'debit' ? '-' : '+'}${transaction.amount.toFixed(2)}
                  </td>
                  <td className="amount">${transaction.balanceAfter?.toFixed(2) || 'N/A'}</td>
                  <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                  <td className="description">{transaction.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions?.length === 0 && (
          <div className="empty-state">
            <p>No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWallet;
