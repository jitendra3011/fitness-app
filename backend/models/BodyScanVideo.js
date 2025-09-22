const mongoose = require('mongoose');

const bodyScanVideoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoUri: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true // in seconds
  },
  type: {
    type: String,
    default: 'body_scan'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BodyScanVideo', bodyScanVideoSchema);