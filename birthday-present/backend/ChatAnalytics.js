const mongoose = require('mongoose');

const ChatAnalyticsSchema = new mongoose.Schema({
    chatName: {
        type: String,
        required: true,
    },
    totalMessages: {
        type: Number,
        required: true,
    },
    topSenders: [
        {
            user: String,
            count: Number,
        }
    ],
    messagesByHour: {
        type: Map,
        of: Number, // Хранит активность по часам, например: { "12": 150, "13": 89 }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('ChatAnalytics', ChatAnalyticsSchema);