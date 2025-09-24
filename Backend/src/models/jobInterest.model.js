const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobInterestSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    opening: {
        type: mongoose.Schema.ObjectId,
        ref: 'Opening',
        required: true
    },
    isInterested: {
        type: Boolean,
        required: true
    },
    reason: {
        type: String,
        default: ""
    },
    isEligible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create a compound index to ensure a user can only have one interest record per opening
JobInterestSchema.index({ user: 1, opening: 1 }, { unique: true });

const JobInterest = mongoose.model('JobInterest', JobInterestSchema);

module.exports = JobInterest;