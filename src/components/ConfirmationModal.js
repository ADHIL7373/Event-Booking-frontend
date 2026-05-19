/**
 * Professional Confirmation Modal
 * Apple-inspired design for confirmations
 */

import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  icon = '⚠️',
  isDangerous = false,
  onConfirm, 
  onCancel,
  isLoading = false 
}) => {
  console.log('[DEBUG] ConfirmationModal - isOpen:', isOpen, 'title:', title);
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className={`modal-icon ${isDangerous ? 'danger' : ''}`}>
          {icon}
        </div>

        {/* Title */}
        <h2 className="modal-title">{title}</h2>

        {/* Message */}
        <p className="modal-message">{message}</p>

        {/* Button Group */}
        <div className="modal-buttons">
          <button
            className="modal-btn cancel-btn"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={`modal-btn confirm-btn ${isDangerous ? 'danger' : ''}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                {confirmText}...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
