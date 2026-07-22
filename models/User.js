const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },

    coins: {
        type: Number,
        default: 0
    },

    messages: {
        type: Number,
        default: 0
    },

    voiceTime: {
        type: Number,
        default: 0
    },

    wins: {
        type: Number,
        default: 0
    },

    losses: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("User", UserSchema);
