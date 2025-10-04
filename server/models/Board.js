const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Default Board'
    },
    columns: [{
        id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    users: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
boardSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Board', boardSchema);
