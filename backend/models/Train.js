const mongoose = require('mongoose');

const scheduleStopSchema = new mongoose.Schema({
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true
  },
  stationName: {
    type: String,
    required: true
  },
  departureTime: {
    type: String, // Format: "HH:MM"
    required: true
  },
  arrivalTime: {
    type: String, // Format: "HH:MM" (same as departure for first station)
    required: true
  },
  distanceFromPrevious: {
    type: Number,
    required: true,
    min: 0
  },
  cumulativeDistance: {
    type: Number,
    required: true,
    min: 0
  },
  stopNumber: {
    type: Number,
    required: true,
    min: 1
  }
});

const trainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Express', 'Superfast', 'Passenger', 'Rajdhani', 'Shatabdi'],
    default: 'Express'
  },
  schedule: [scheduleStopSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient searching
trainSchema.index({ 'schedule.station': 1 });
trainSchema.index({ 'schedule.stationName': 1 });

module.exports = mongoose.model('Train', trainSchema); 