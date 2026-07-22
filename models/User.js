import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  guildId: { type: String, required: true },
  balance: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  reputation: { type: Number, default: 0 },
  voiceTime: { type: Number, default: 0 },
  messages: { type: Number, default: 0 },
  partnerId: { type: String, default: null },
  loveLevel: { type: Number, default: 0 },
  loveXp: { type: Number, default: 0 },
  marriedAt: { type: Date, default: null },
  background: { type: String, default: 'default' },
  about: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
