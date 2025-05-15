import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
  walletAddress: { type: String, required: true },
  privateKey: { type: String, required: true },
  externalWalletAddress: { type: String, required: true, unique: true },
  nonce: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastStudyDate: { type: Date },
  lastQuizDate: { type: Date },
  levelOfEducation: { 
    type: String, 
    enum: ['secondary', 'university'], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;