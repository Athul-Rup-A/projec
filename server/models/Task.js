const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    dueDate: {
        type: Date,
        required: true
    },
    priorityLevel: {
        type: String,
        enum: ['high', 'medium', 'low'], // Allowed values
        required: true // Ensures this field is always provided
    },
    completed: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'taskSign',
        required: true
    }

});

module.exports = mongoose.model('Task', taskSchema);
