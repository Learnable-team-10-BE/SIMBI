// import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from '../interfaces/auth.interface';

// const userSchema: Schema<IUser> = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   verificationToken: { type: String },
//   isVerified: { type: Boolean, default: false },
//   walletAddress: { type: String },
//   privateKey: { type: String },
// });

// export default mongoose.model<IUser>('User', userSchema);


import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/auth.interface';

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false },
  walletAddress: { type: String },
  privateKey: { type: String },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastStudyDate: { type: Date },
  lastQuizDate: { type: Date },
  levelOfEducation: { 
    type: String, 
    enum: ['secondary', 'university'], 
    required: true 
  },
});



export default mongoose.model<IUser>('User', userSchema);