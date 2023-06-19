const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    images: [{
        public_id: String,
        url: String,
    }],
    yieldName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    yieldType: {
        type: String,
        required: true
    },
    comments: [{
        comment: {
            type: String
        },
        postedBy: {
            type: ObjectId,
            ref: 'User'
        },
        likes: [{
            type: ObjectId,
            ref: 'User'
        }],
        dislikes: [{
            type: ObjectId,
            ref: 'User'
        }],
        date: {
            type: Date,
            default: Date.now,
        }
    }],
    price: {
        type: Number,
        required: true,
        min: 100,
        max: 1000000
    },
    quantity: [{
        type: Number,
        required: [true, "Please enter the quantity"],
    }],
    qualiity: [{
        type: String
    }],
    availability: {
        type: Boolean,
        required: true
    },
});

module.exports = mongoose.model("Post", postSchema);