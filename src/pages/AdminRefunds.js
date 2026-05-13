import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminStyles.css';

const AdminRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRefund, setSelectedRefund] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRefunds();
  }, [page, statusFilter]);

  const fetchRefunds = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/refunds`, {
        params: { page, limit: 10, status: statusFilter },
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefunds(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load refunds');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefund = async (paymentId) => {
    const reason = prompt('Enter refund reason:');
    if (!reason) return;

    try {
      await axios.post(
        `${API_BASE_URL}/admin/refunds/${paymentId}/process`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRefunds();
      alert('Refund processed successfully');
    } catch (err) {
      setError('Failed to process refund');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-refunds">
      <div className="page-header">
        <h1>Refunds Management</h1>
        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processed">Processed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="refunds-table">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Event</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((refund) => (
              <tr key={refund._id}>
                <td className="mono">{refund.bookingId._id.slice(-8)}</td>
                <td>{refund.userId?.fullName}</td>
                <td>{refund.eventId?.title}</td>
                <td className="amount">${refund.amount.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${refund.status}`}>
                    {refund.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-action"
                    onClick={() => handleProcessRefund(refund._id)}
                  >
                    Process
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {refunds.length === 0 && (
        <div className="empty-state">
          <p>No refunds found</p>
        </div>
      )}
    </div>
  );
};

export default AdminRefunds;
