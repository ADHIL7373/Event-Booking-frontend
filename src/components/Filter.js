import React from 'react';
import './Filter.css';

export default function Filter({ value, onChange }) {
  return (
    <div className="filter">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="this_month">This Month</option>
        <option value="last_month">Last Month</option>
        <option value="3_months">Last 3 Months</option>
      </select>
    </div>
  );
}
