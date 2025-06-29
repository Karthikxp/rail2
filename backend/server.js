require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import models to ensure they are registered
require('./models/Station');
require('./models/Train');

// Import routes
const trainRoutes = require('./routes/trains');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/trains', trainRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Train Search API',
    version: '1.0.0',
    endpoints: {
      stations: 'GET /api/trains/stations',
      search: 'GET /api/trains/search?source={source}&destination={destination}&sortBy={price|time}',
      health: 'GET /api/trains/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}`);
}); 