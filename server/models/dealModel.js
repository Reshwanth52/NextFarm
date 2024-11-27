const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  crop: {
    type: String,
    required: [true, "Please Enter Yield Name"],
  },
  address: {
    state: {
      type: String,
      required: [true, "Please Enter the Address"],
    },
    city: {
      type: String,
      required: [true, "Please Enter the Address"],
    },
    district: {
      type: String,
      required: [true, "Please Enter the Address"],
    },
  },
  cropType: {
    type: String,
    required: [true, "Please Enter the Crop Type"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  contactNumber: {
    type: Number,
    required: [true, "Please Enter your Contact Number"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Deal", dealSchema);
