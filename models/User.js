const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    wallet: { type: Number, default: 500 },
    bank: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    prestige: { type: Number, default: 0 },
    dailyStreak: { type: Number, default: 0 },
    lastDaily: { type: Date },
    lastWeekly: { type: Date },
    lastMonthly: { type: Date },
    lastWork: { type: Date },
    lastFish: { type: Date },
    lastRob: { type: Date },
    lastCrime: { type: Date },
    shield: { type: Boolean, default: false },
    bio: { type: String, default: '' },
    badges: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    totalEarned: { type: Number, default: 0 },
    totalLost: { type: Number, default: 0 },
    reputation: { type: Number, default: 0 },
    marriedTo: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
});

UserSchema.index({ userId: 1, guildId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', UserSchema);
