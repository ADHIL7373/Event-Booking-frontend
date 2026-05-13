import React, { useState } from 'react';
import axios from 'axios';
import './AdminStyles.css';

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const token = localStorage.getItem('token');

  const generateReport = async (reportType, format) => {
    try {
      setLoading(true);
      setError('');

      const endpoints = {
        bookings: '/api/admin/reports/bookings',
        revenue: '/api/admin/reports/revenue',
        users: '/api/admin/reports/users',
      };

      const params = {
        format,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };

      const response = await axios.get(
        `http://localhost:5000${endpoints[reportType]}`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` },
          responseType: format === 'csv' ? 'blob' : 'json',
        }
      );

      if (format === 'csv') {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // JSON format
        const jsonString = JSON.stringify(response.data, null, 2);
        const url = window.URL.createObjectURL(new Blob([jsonString]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setError('');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to generate ${reportType} report`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-reports">
      <h1 className="page-title">Reports & Downloads</h1>

      {error && <div className="error-banner">{error}</div>}

      {/* Date Range Filter */}
      <div className="filter-section">
        <h3>Date Range (Optional)</h3>
        <div className="date-inputs">
          <div className="date-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="date-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            className="btn-secondary"
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
          >
            Clear Dates
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {/* Bookings Report */}
        <div className="report-card">
          <div className="report-icon">🎫</div>
          <h3>Bookings Report</h3>
          <p>Download all booking data with user and event information</p>
          <div className="report-actions">
            <button
              className="btn-action"
              onClick={() => generateReport('bookings', 'csv')}
              disabled={loading}
            >
              📊 CSV
            </button>
            <button
              className="btn-action"
              onClick={() => generateReport('bookings', 'json')}
              disabled={loading}
            >
              📄 JSON
            </button>
          </div>
        </div>

        {/* Revenue Report */}
        <div className="report-card">
          <div className="report-icon">💵</div>
          <h3>Revenue Report</h3>
          <p>Download revenue data with payment statistics and summary</p>
          <div className="report-actions">
            <button
              className="btn-action"
              onClick={() => generateReport('revenue', 'csv')}
              disabled={loading}
            >
              📊 CSV
            </button>
            <button
              className="btn-action"
              onClick={() => generateReport('revenue', 'json')}
              disabled={loading}
            >
              📄 JSON
            </button>
          </div>
        </div>

        {/* Users Report */}
        <div className="report-card">
          <div className="report-icon">👥</div>
          <h3>Users Report</h3>
          <p>Download user data with booking history and total spending</p>
          <div className="report-actions">
            <button
              className="btn-action"
              onClick={() => generateReport('users', 'csv')}
              disabled={loading}
            >
              📊 CSV
            </button>
            <button
              className="btn-action"
              onClick={() => generateReport('users', 'json')}
              disabled={loading}
            >
              📄 JSON
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="loading-message">Generating report...</div>}
    </div>
  );
};

export default AdminReports;
