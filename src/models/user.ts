import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
    walletAddress: { type: String, default: '' },
  privateKey: { type: String, default: '' },
   externalWalletAddress: { 
    type: String, 
    default: '',
    index: true 
  },
    nonce: { 
    type: Number, 
    default: () => Math.floor(Math.random() * 1000000) },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastStudyDate: { type: Date },
  lastQuizDate: { type: Date },
  achievements: { type: [String], default: [] },
  levelOfEducation: { 
    type: String, 
    enum: ['secondary', 'university'], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  });
  userSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const User = mongoose.model('User', userSchema);

export default User;