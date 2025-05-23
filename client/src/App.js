import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import AdminPortal from './components/AdminPortal';
import BookingTicket from './components/BookingTicket';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    sport: '',
    venue: '',
    date: '',
    timeSlot: ''
  });
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch venues on component mount
  useEffect(() => {
    console.log('Fetching venues from:', `${API_URL}/venues`);
    fetch(`${API_URL}/venues`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Venues data:', data);
        setVenues(data);
      })
      .catch(err => {
        console.error('Error fetching venues:', err);
        alert('Error loading venues. Please try again later.');
      });
  }, []);

  // Fetch available slots when venue or date changes
  useEffect(() => {
    if (selectedVenue && selectedDate) {
      console.log('Fetching slots from:', `${API_URL}/slots?venue=${selectedVenue}&date=${selectedDate}`);
      fetch(`${API_URL}/slots?venue=${selectedVenue}&date=${selectedDate}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Slots data:', data);
          setAvailableSlots(data.availableSlots);
        })
        .catch(err => {
          console.error('Error fetching slots:', err);
          alert('Error loading time slots. Please try again later.');
        });
    }
  }, [selectedVenue, selectedDate]);

  // Poll for slot updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedVenue && selectedDate) {
        fetch(`${API_URL}/slots?venue=${selectedVenue}&date=${selectedDate}`)
          .then(res => res.json())
          .then(data => setAvailableSlots(data.availableSlots))
          .catch(err => console.error('Error fetching slots:', err));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedVenue, selectedDate]);

  const handleVenueChange = (e) => {
    setSelectedVenue(e.target.value);
    setBookingForm(prev => ({ ...prev, venue: e.target.value }));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setBookingForm(prev => ({ ...prev, date: e.target.value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingForm),
      });
      const data = await response.json();
      if (response.ok) {
        setBookingConfirmation(data.booking);
        setBookingForm({
          name: '',
          sport: '',
          venue: '',
          date: '',
          timeSlot: ''
        });
        setSelectedVenue('');
        setSelectedDate('');
        setAvailableSlots([]);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error('Error making booking:', err);
      alert('Error making booking. Please try again.');
    }
  };

  return (
    <div className="App">
      <Navbar />
      {isAdmin ? (
        <AdminPortal />
      ) : (
        <>
          <div className="card">
            <div className="venue-selection">
              <select value={selectedVenue} onChange={handleVenueChange}>
                <option value="">Select a venue</option>
                {venues.map(venue => (
                  <option key={venue.id || venue.name} value={venue.name}>{venue.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {availableSlots.length > 0 && (
              <div className="available-slots">
                <h2>Available Time Slots</h2>
                <div className="slots-grid">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setBookingForm(prev => ({ ...prev, timeSlot: slot }))}
                      className={bookingForm.timeSlot === slot ? 'selected' : ''}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="booking-form">
              <h2>Book a Slot</h2>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={bookingForm.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="sport"
                placeholder="Sport"
                value={bookingForm.sport}
                onChange={handleInputChange}
                required
              />
              <button type="submit" disabled={!bookingForm.timeSlot}>
                Book Slot
              </button>
            </form>

            {bookingConfirmation && (
              <div className="confirmation">
                <h2>Booking Confirmed!</h2>
                <p>Name: {bookingConfirmation.name}</p>
                <p>Sport: {bookingConfirmation.sport}</p>
                <p>Venue: {bookingConfirmation.venue}</p>
                <p>Date: {bookingConfirmation.date}</p>
                <p>Time: {bookingConfirmation.timeSlot}</p>
                <BookingTicket booking={bookingConfirmation} />
              </div>
            )}
          </div>
        </>
      )}
      <button 
        className="switch-view-btn"
        onClick={() => setIsAdmin(!isAdmin)}
      >
        {isAdmin ? 'Switch to Booking View' : 'Switch to Admin View'}
      </button>
    </div>
  );
}

export default App;
