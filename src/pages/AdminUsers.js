import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminStyles.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        params: { page, limit: 10, search },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(response.data.data);
      setShowDetails(true);
    } catch (err) {
      setError('Failed to load user details');
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/users/${userId}/toggle-status`, 
        { isBlocked: !isBlocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      setShowDetails(false);
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1>Users Management</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Bookings</th>
              <th>Total Spent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.totalBookings}</td>
                <td>${user.totalSpent.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${user.isBlocked ? 'blocked' : 'active'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-small"
                    onClick={() => handleViewDetails(user._id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDetails(false)}>✕</button>
            
            <h2>{selectedUser.user.fullName}</h2>
            
            <div className="details-section">
              <h3>User Information</h3>
              <p><strong>Email:</strong> {selectedUser.user.email}</p>
              <p><strong>Phone:</strong> {selectedUser.user.phone || 'N/A'}</p>
              <p><strong>Reward Points:</strong> {selectedUser.user.rewardPoints}</p>
            </div>

            <div className="details-section">
              <h3>Bookings ({selectedUser.bookings.length})</h3>
              <div className="bookings-list">
                {selectedUser.bookings.slice(0, 5).map((booking) => (
                  <div key={booking._id} className="booking-item">
                    <div>{booking.eventId.title}</div>
                    <div className="booking-meta">
                      {booking.numberOfTickets} tickets • ${booking.totalPrice}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className={`btn-action ${selectedUser.user.isBlocked ? 'unblock' : 'block'}`}
                onClick={() => handleBlockUser(selectedUser.user._id, selectedUser.user.isBlocked)}
              >
                {selectedUser.user.isBlocked ? 'Unblock User' : 'Block User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
