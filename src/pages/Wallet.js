import React, { useEffect, useState } from 'react';
import walletService from '../services/walletService';
import TransactionList from '../components/TransactionList';
import Filter from '../components/Filter';
import './Wallet.css';

function formatCurrency(amount) {
  return `₹${amount.toLocaleString()}`;
}

export default function Wallet() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('this_month');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const params = { filter };

    Promise.all([
      walletService.getSummary({ params }),
      walletService.getTransactions(params),
    ])
      .then(([s, t]) => {
        if (!mounted) return;
        setSummary(s.data.data);
        setTransactions(t.data.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [filter]);

  return (
    <div className="wallet-page">
      <div className="wallet-header">
        <h1>Wallet</h1>
        <Filter value={filter} onChange={setFilter} />
      </div>

      <div className="wallet-summary">
        <div className="summary-card">
          <div className="label">Total Spent</div>
          <div className="value spent">{summary ? formatCurrency(summary.totalSpent) : '—'}</div>
        </div>
        <div className="summary-card">
          <div className="label">Total Refunded</div>
          <div className="value refunded">{summary ? formatCurrency(summary.totalRefunded) : '—'}</div>
        </div>
        <div className="summary-card">
          <div className="label">Net Balance</div>
          <div className="value net">{summary ? formatCurrency(summary.netBalance) : '—'}</div>
        </div>
      </div>

      <div className="transactions-section">
        {loading ? (
          <div className="skeleton">Loading transactions...</div>
        ) : (
          <TransactionList transactions={transactions} />
        )}
      </div>
    </div>
  );
}
