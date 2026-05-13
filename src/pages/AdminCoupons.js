import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminStyles.css';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    maxDiscount: '',
    minPurchaseAmount: '',
    expiryDate: '',
    maxUsage: '',
    description: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCoupons();
  }, [page, search]);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/coupons`, {
        params: { page, limit: 10, search },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        minPurchaseAmount: parseFloat(formData.minPurchaseAmount) || 0,
        maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null,
      };

      await axios.post(
        `${API_BASE_URL}/admin/coupons`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCoupons();
      setShowCreateForm(false);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        maxDiscount: '',
        minPurchaseAmount: '',
        expiryDate: '',
        maxUsage: '',
        description: '',
      });
      alert('Coupon created successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/coupons/${couponId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchCoupons();
        alert('Coupon deleted successfully');
      } catch (err) {
        setError('Failed to delete coupon');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-coupons">
      <div className="page-header">
        <h1>Coupon Management</h1>
        <button className="btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : '+ New Coupon'}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Create Coupon Form */}
      {showCreateForm && (
        <div className="form-card">
          <h2>Create New Coupon</h2>
          <form onSubmit={handleCreateCoupon}>
            <div className="form-grid">
              <div className="form-group">
                <label>Coupon Code *</label>
                <input
                  type="text"
                  placeholder="e.g., SAVE20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Discount Type *</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Discount Value *</label>
                <input
                  type="number"
                  placeholder={formData.discountType === 'percentage' ? '20' : '10'}
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Max Discount (optional)</label>
                <input
                  type="number"
                  placeholder="100"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Min Purchase Amount *</label>
                <input
                  type="number"
                  placeholder="50"
                  value={formData.minPurchaseAmount}
                  onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Expiry Date *</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Max Usage (optional)</label>
                <input
                  type="number"
                  placeholder="Unlimited"
                  value={formData.maxUsage}
                  onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                />
              </div>

              <div className="form-group full">
                <label>Description</label>
                <textarea
                  placeholder="Describe this coupon..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Create Coupon</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Coupons Table */}
      <div className="coupons-table">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Min Purchase</th>
              <th>Expiry</th>
              <th>Usage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td className="code">{coupon.code}</td>
                <td>
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                </td>
                <td>${coupon.minPurchaseAmount}</td>
                <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                <td>{coupon.maxUsage ? `${coupon.usageCount}/${coupon.maxUsage}` : `${coupon.usageCount}`}</td>
                <td>
                  <span className={`status-badge ${coupon.isExpired ? 'expired' : coupon.isActive ? 'active' : 'inactive'}`}>
                    {coupon.isExpired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteCoupon(coupon._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {coupons.length === 0 && (
        <div className="empty-state">
          <p>No coupons found</p>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
