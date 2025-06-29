const express = require('express');
const router = express.Router();
const trainSearchService = require('../services/trainSearchService');

// GET /api/trains/stations - Get all available stations
router.get('/stations', async (req, res) => {
  try {
    const stations = await trainSearchService.getAllStations();
    res.json({
      success: true,
      data: stations
    });
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stations',
      error: error.message
    });
  }
});

// GET /api/trains/search - Search trains between source and destination
router.get('/search', async (req, res) => {
  try {
    const { source, destination, sortBy } = req.query;

    // Validation
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination stations are required'
      });
    }

    if (source === destination) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination cannot be the same'
      });
    }

    const validSortOptions = ['price', 'time'];
    const sortOption = validSortOptions.includes(sortBy) ? sortBy : 'price';

    const results = await trainSearchService.searchTrains(source, destination, sortOption);

    res.json({
      success: true,
      data: results,
      query: {
        source,
        destination,
        sortBy: sortOption
      }
    });
  } catch (error) {
    console.error('Error searching trains:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search trains',
      error: error.message
    });
  }
});

// GET /api/trains/health - Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Train search API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 