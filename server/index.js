require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const supabase = require('./supabase');

const app = express();
const port = process.env.PORT || 5000;

// Update CORS configuration to allow your client domain
app.use(cors({
  origin: ['http://localhost:3000', 'https://sportomic-task-wgco.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());

// Initialize venues if they don't exist
const initializeVenues = async () => {
  const venues = [
    { name: 'Basketball Court' },
    { name: 'Tennis Court' },
    { name: 'Swimming Pool' },
    { name: 'Football Field' }
  ];

  for (const venue of venues) {
    const { data, error } = await supabase
      .from('venues')
      .upsert({ name: venue.name })
      .select();

    if (error) {
      console.error('Error initializing venue:', error);
    }
  }
};

// Initialize venues on server start
initializeVenues();

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

// GET /venues endpoint
app.get('/venues', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching venues' });
  }
});

// GET /slots endpoint
app.get('/slots', async (req, res) => {
  const { venue, date } = req.query;
  
  if (!venue || !date) {
    return res.status(400).json({ error: 'Venue and date are required' });
  }

  try {
    // Get booked slots for the venue and date
    const { data: bookedSlots, error } = await supabase
      .from('bookings')
      .select('time_slot')
      .eq('venue', venue)
      .eq('date', date);

    if (error) throw error;

    const bookedTimeSlots = bookedSlots.map(booking => booking.time_slot);
    
    // Return available slots
    const availableSlots = timeSlots.filter(slot => !bookedTimeSlots.includes(slot));
    
    res.json({ availableSlots });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching available slots' });
  }
});

// POST /book endpoint
app.post('/book', async (req, res) => {
  const { name, sport, venue, date, timeSlot } = req.body;

  if (!name || !sport || !venue || !date || !timeSlot) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if slot is already booked
    const { data: existingBooking, error: checkError } = await supabase
      .from('bookings')
      .select('*')
      .eq('venue', venue)
      .eq('date', date)
      .eq('time_slot', timeSlot)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw checkError;
    }

    if (existingBooking) {
      return res.status(400).json({ error: 'Slot is already booked' });
    }

    // Create new booking
    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert([
        {
          name,
          sport,
          venue,
          date,
          time_slot: timeSlot
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    res.json({ message: 'Booking successful', booking });
  } catch (err) {
    res.status(500).json({ error: 'Error creating booking' });
  }
});

// GET /bookings endpoint
app.get('/bookings', async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) throw error;
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching bookings' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 