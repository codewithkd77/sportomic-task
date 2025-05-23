import React, { useState, useEffect } from 'react';
import './AdminPortal.css';

function AdminPortal() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBooking, setEditedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://sportomic-task-backend.onrender.com/bookings');
      const data = await response.json();
      if (response.ok) {
        setBookings(data);
      } else {
        throw new Error(data.error || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setEditedBooking({ ...booking });
    setIsEditing(true);
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setIsLoading(true);
        console.log('Cancelling booking with ID:', bookingId);

        const response = await fetch(`http://localhost:5000/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Delete response:', data);

        if (response.ok) {
          // Remove the cancelled booking from the state
          setBookings(prevBookings => prevBookings.filter(booking => booking.id === bookingId ? false : true));
          alert('Booking cancelled successfully');
        } else {
          throw new Error(data.error || 'Failed to cancel booking');
        }
      } catch (err) {
        setError(err.message || 'Failed to cancel booking');
        console.error('Error cancelling booking:', err);
        alert(err.message || 'Failed to cancel booking');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/bookings/${editedBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedBooking),
      });
      if (response.ok) {
        setBookings(bookings.map(booking => 
          booking.id === editedBooking.id ? editedBooking : booking
        ));
        setIsEditing(false);
        setSelectedBooking(null);
        alert('Booking updated successfully');
      } else {
        throw new Error('Failed to update booking');
      }
    } catch (err) {
      setError('Failed to update booking');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBooking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) return <div className="admin-loading">Loading bookings...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-portal">
      <h1>Admin Portal</h1>
      <div className="admin-content">
        <div className="bookings-list">
          <h2>All Bookings</h2>
          {bookings.length === 0 ? (
            <p className="no-bookings">No bookings found</p>
          ) : (
            bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-info">
                  <h3>{booking.venue}</h3>
                  <p>Date: {booking.date}</p>
                  <p>Time: {booking.time_slot}</p>
                  <p>Sport: {booking.sport}</p>
                  <p>Booked by: {booking.name}</p>
                </div>
                <div className="booking-actions">
                  <button onClick={() => handleEdit(booking)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleCancel(booking.id)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {isEditing && selectedBooking && (
          <div className="edit-modal">
            <div className="edit-content">
              <h2>Edit Booking</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={editedBooking.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Venue:</label>
                  <input
                    type="text"
                    name="venue"
                    value={editedBooking.venue}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    name="date"
                    value={editedBooking.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Time Slot:</label>
                  <input
                    type="text"
                    name="time_slot"
                    value={editedBooking.time_slot}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Sport:</label>
                  <input
                    type="text"
                    name="sport"
                    value={editedBooking.sport}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="save-btn">Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPortal; 