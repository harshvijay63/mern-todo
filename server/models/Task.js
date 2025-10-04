const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['todo', 'inprogress', 'done'],
        default: 'todo'
    },
    order: {
        type: Number,
        default: 0
    },
    boardId: {
        type: String,
        default: 'default'
    },
    columnId: {
        type: String,
        required: true
    },
    assignedTo: {
        type: String,
        default: null
    },
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
taskSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Task', taskSchema);
