const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    userId: String,
    balance: { type: Number, default: 0 },
    bank: { type: Number, default: 0 }
});

module.exports = model('User', userSchema);
