const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  
  // Profile Information
  fullName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  profilePhoto: {
    type: String // URL or file path
  },
  
  // Contact Details
  mobileNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  
  // Address
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  village: {
    type: String
  },
  pincode: {
    type: String,
    required: true,
    match: /^[0-9]{6}$/
  },
  
  // Identity Verification
  idType: {
    type: String,
    enum: ['Aadhaar', 'Passport', 'PAN', 'Others'],
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  
  // Physical Details
  height: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  
  // Training Information
  trainingLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  achievements: {
    type: String
  },
  demoVideos: [{
    filename: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);