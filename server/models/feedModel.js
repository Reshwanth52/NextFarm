const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const feedSchema = new mongoose.Schema({
  caption: String,
  content: [
    {
      public_id: String,
      url: String,
    },
  ],
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  dislikes: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      postedBy: {
        type: ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Feed", feedSchema);
