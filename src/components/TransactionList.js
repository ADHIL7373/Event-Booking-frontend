import React from 'react';
import './TransactionList.css';

function formatCurrency(amount) {
  const sign = amount >= 0 ? '+' : '-';
  return `${sign}₹${Math.abs(amount).toLocaleString()}`;
}

const Icon = ({ type }) => (
  <div className={`tx-icon ${type}`} aria-hidden>
    {type === 'debit' ? '−' : '+'}
  </div>
);

export default function TransactionList({ transactions = [] }) {
  if (!transactions.length) {
    return (
      <div className="empty-state">
        <div className="empty-card">
          <h3>No transactions yet</h3>
          <p>Your purchases and refunds will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {transactions.map((tx) => (
        <div className="transaction-row" key={tx._id}>
          <div className="tx-left">
            <Icon type={tx.type} />
            <div className="tx-meta">
              <div className="tx-title">{tx.eventId?.title || 'Event Purchase'}</div>
              <div className="tx-date">{new Date(tx.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div className="tx-right">
            <div className={`tx-amount ${tx.type === 'credit' ? 'credit' : 'debit'}`}>
              {formatCurrency(tx.type === 'credit' ? tx.amount : -tx.amount)}
            </div>
            <div className="tx-status">{tx.status}</div>
            {tx.refund?.amount ? (
              <div className="tx-refund">Refund: +₹{tx.refund.amount}</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
