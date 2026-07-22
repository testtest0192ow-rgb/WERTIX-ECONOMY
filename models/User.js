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


    timelyStreak: {
        type: Number,
        default: 0
    },


    lastTimely: {
        type: Date,
        default: null
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
    },


    marriedTo: {
        type: String,
        default: null
    },


    marryDate: {
        type: Date,
        default: null
    }

});


module.exports = mongoose.model(
    "User",
    UserSchema
);
