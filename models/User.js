// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  guildId: { type: String, required: true },

  // Экономика
  balance: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  lastDaily: { type: Date, default: null },

  // Уровни
  level: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  totalXp: { type: Number, default: 0 },

  // Репутация
  reputation: { type: Number, default: 0 },
  receivedReps: [{ type: String }],

  // Голосовое время (в минутах)
  voiceTime: { type: Number, default: 0 },

  // Сообщения
  messages: { type: Number, default: 0 },

  // Профиль
  background: { type: String, default: 'default' },
  roleColor: { type: String, default: '#5865f2' },
  about: { type: String, default: '' },

  // ❤️ Любовный профиль
  partnerId: { type: String, default: null },
  loveLevel: { type: Number, default: 0 },
  loveXp: { type: Number, default: 0 },
  marriedAt: { type: Date, default: null },

  // Доска почёта
  topPosition: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
