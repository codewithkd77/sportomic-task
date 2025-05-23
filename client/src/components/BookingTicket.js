import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import './BookingTicket.css';

function BookingTicket({ booking }) {
  const ticketRef = useRef(null);

  const downloadTicket = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, {
          scale: 2,
          backgroundColor: '#ffffff'
        });
        const link = document.createElement('a');
        link.download = `booking-ticket-${booking.date}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error generating ticket:', error);
      }
    }
  };

  const ticketData = JSON.stringify({
    name: booking.name,
    sport: booking.sport,
    venue: booking.venue,
    date: booking.date,
    timeSlot: booking.time_slot
  });

  return (
    <div className="ticket-container">
      <div className="ticket" ref={ticketRef}>
        <div className="ticket-header">
          <h2>Booking Confirmation</h2>
          <div className="ticket-qr">
            <QRCodeSVG value={ticketData} size={150} />
          </div>
        </div>
        <div className="ticket-details">
          <div className="ticket-row">
            <span className="label">Name:</span>
            <span className="value">{booking.name}</span>
          </div>
          <div className="ticket-row">
            <span className="label">Sport:</span>
            <span className="value">{booking.sport}</span>
          </div>
          <div className="ticket-row">
            <span className="label">Venue:</span>
            <span className="value">{booking.venue}</span>
          </div>
          <div className="ticket-row">
            <span className="label">Date:</span>
            <span className="value">{booking.date}</span>
          </div>
          <div className="ticket-row">
            <span className="label">Time:</span>
            <span className="value">{booking.time_slot}</span>
          </div>
        </div>
        <div className="ticket-footer">
          <p>Please present this ticket at the venue</p>
        </div>
      </div>
      <button className="download-button" onClick={downloadTicket}>
        Download Ticket
      </button>
    </div>
  );
}

export default BookingTicket; 