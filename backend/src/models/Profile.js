import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  profilePhoto: { type: String }, // store URL or base64
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  idType: { type: String, required: true },
  idNumber: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  trainingLevel: { type: String, required: true },
  achievements: { type: String },
  demoVideos: [{ type: String }], // store video URLs
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
