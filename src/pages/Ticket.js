/**
 * Ticket Page
 * Shows QR code ticket for a booking
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import bookingService from '../services/bookingService';
import LoadingSpinner from '../components/LoadingSpinner';
import './Ticket.css';

const Ticket = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const qrRef = useRef();
  const ticketCardRef = useRef();

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getBookingById(bookingId);
      setBooking(data.booking);
    } catch (err) {
      console.error('Failed to fetch booking:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!ticketCardRef.current) {
      alert('Ticket not found');
      return;
    }

    try {
      const canvas = await html2canvas(ticketCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${booking._id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download ticket. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading ticket..." />;
  }

  if (!booking) {
    return <div className="ticket-error">Ticket not found</div>;
  }

  const eventDate = new Date(booking.eventId.date);
  const bookingDate = new Date(booking.bookingDate);

  return (
    <div className="ticket-page">
      <div className="ticket-container">
        <div className="ticket-header">
          <h1>📱 Your Event Ticket</h1>
          <p className="ticket-subtitle">Show this ticket at the venue entrance</p>
        </div>

        <div className="ticket-card" ref={ticketCardRef}>
          <div className="ticket-content">
            {/* Event Details */}
            <div className="ticket-section">
              <h2>{booking.eventId.title}</h2>
              <div className="ticket-meta">
                <div className="meta-item">
                  <span className="label">📅 Date</span>
                  <span className="value">
                    {eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="label">🕐 Time</span>
                  <span className="value">{booking.eventId.time}</span>
                </div>
                <div className="meta-item">
                  <span className="label">📍 Location</span>
                  <span className="value">{booking.eventId.location}</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="qr-section">
              <p className="qr-label">Scan this QR code at the venue</p>
              <div className="qr-code" ref={qrRef}>
                {booking.qrCodeData && (
                  <QRCode
                    value={booking.qrCodeData}
                    size={256}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />
                )}
              </div>
            </div>

            {/* Booking Details */}
            <div className="ticket-section">
              <h3>Booking Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Number of Tickets</span>
                  <span className="value">{booking.numberOfTickets}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Total Amount</span>
                  <span className="value"><span className="currency-symbol">₹</span>{booking.totalPrice}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status</span>
                  <span className={`value status ${booking.status}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Booking Date</span>
                  <span className="value">
                    {bookingDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Numbers */}
            {booking.ticketNumbers && booking.ticketNumbers.length > 0 && (
              <div className="ticket-section">
                <h3>Ticket Numbers</h3>
                <div className="ticket-numbers-list">
                  {booking.ticketNumbers.map((ticket, idx) => (
                    <span key={idx} className="ticket-number">
                      {ticket}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Important Notes */}
            <div className="important-notes">
              <p>
                <strong>Important:</strong> Please arrive 15 minutes before the event.
                Present this ticket with QR code for verification.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="ticket-actions">
          <button className="btn-print" onClick={handlePrint}>
            🖨️ Print Ticket
          </button>
          <button className="btn-download" onClick={handleDownload}>
            ⬇️ Download Ticket
          </button>
          <button
            className="btn-close"
            onClick={() => window.history.back()}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
